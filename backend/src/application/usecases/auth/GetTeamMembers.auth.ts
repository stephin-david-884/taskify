import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { GetTeamMembersOutputDTO } from "../../dtos/auth/getTeamMembers.auth.dto";
import { IGetTeamMembersUseCase } from "../../interfaces/usecases/auth/IGetTeamMembersUseCase";
import { AppError } from "../../../domain/errors/AppError";
import { statusCode } from "../../constants/enums/statusCode";

export class GetTeamMembers implements IGetTeamMembersUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(userId: string): Promise<GetTeamMembersOutputDTO> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new AppError("User not found", statusCode.NOT_FOUND);
        }

        if (!user.teamId) {
            throw new AppError("User is not associated with a team", statusCode.BAD_REQUEST);
        }

        const members = await this.userRepository.findMembersByTeamId(user.teamId);

        return {
            members: members.map((member) => ({
                id: member.getId(),
                name: member.name,
                email: member.email,
                role: member.role,
                teamId: member.teamId,
            })),
        };
    }
}
