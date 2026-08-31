import { User, UserRole } from "../../../domain/entities/User.entity";
import { AppError } from "../../../domain/errors/AppError";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { ITeamRepository } from "../../../domain/repositories/ITeamRepository";
import { statusCode } from "../../constants/enums/statusCode";
import { RegisterUserInputDTO, RegisterUserOutputDTO } from "../../dtos/auth/register.auth.dto";
import { IHashService } from "../../interfaces/services/auth/IHashService";
import { ITokenService } from "../../interfaces/services/auth/ITokenService";
import { IRegisterUserUsecase } from "../../interfaces/usecases/auth/IRegisterUserUsecase";
import { Team } from "../../../domain/entities/Team.entity";

export class RegisterUser implements IRegisterUserUsecase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly teamRepository: ITeamRepository,
    private readonly hashService: IHashService,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(
    data: RegisterUserInputDTO,
  ): Promise<RegisterUserOutputDTO> {
    const {
      name,
      email,
      password,
      confirmPassword,
      role,
      teamName,
      leadId,
    } = data;

    if (password !== confirmPassword) {
      throw new AppError(
        "Passwords do not match",
        statusCode.BAD_REQUEST,
      );
    }

    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new AppError(
        "User with this email already exists",
        statusCode.BAD_REQUEST,
      );
    }

    if (role === UserRole.LEAD && !teamName?.trim()) {
      throw new AppError(
        "Team name is required for a lead",
        statusCode.BAD_REQUEST,
      );
    }

    if (role === UserRole.MEMBER && !leadId) {
      throw new AppError(
        "Lead is required for a member",
        statusCode.BAD_REQUEST,
      );
    }

    let teamId: string | undefined;

    if (role === UserRole.MEMBER) {
      const lead = await this.userRepository.findById(leadId!);

      if (!lead) {
        throw new AppError(
          "Selected lead not found",
          statusCode.NOT_FOUND,
        );
      }

      if (!lead.isLead()) {
        throw new AppError(
          "Selected user is not a lead",
          statusCode.BAD_REQUEST,
        );
      }

      const team = await this.teamRepository.findByLeadId(lead.getId());

      if (!team) {
        throw new AppError(
          "Selected lead does not have a team",
          statusCode.BAD_REQUEST,
        );
      }

      teamId = team.getId();
    }

    const hashedPassword = await this.hashService.hash(password);

    const user = new User({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role,
      teamId,
    });

    const createdUser = await this.userRepository.save(user);

    if (role === UserRole.LEAD) {
      const team = new Team({
        name: teamName!.trim(),
        leadId: createdUser.getId(),
      });

      const createdTeam = await this.teamRepository.save(team);

      createdUser.setTeam(createdTeam.getId());

      const updatedUser = await this.userRepository.save(createdUser);

      teamId = updatedUser.teamId;
    }

    // Generate tokens
    const accessToken = this.tokenService.generateAccessToken({
      userId: createdUser.getId(),
      email: createdUser.email,
      role: createdUser.role,
      teamId,
    });

    const refreshToken = this.tokenService.generateRefreshToken({
      userId: createdUser.getId(),
    });

    // Store hashed refresh token
    const hashedRefreshToken =
      await this.hashService.hash(refreshToken);

    createdUser.addRefreshToken(hashedRefreshToken);

    await this.userRepository.save(createdUser);

    return {
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: createdUser.getId(),
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
        teamId: createdUser.teamId,
      },
    };
  }
}