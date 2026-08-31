import "../config/env";

// Services
import { HashService } from "../services/auth/HashService";
import { TokenService } from "../services/auth/TokenService";

// Use cases
import { RegisterUser } from "../../application/usecases/auth/RegisterUser";

// Controller
import { AuthController } from "../../interfaces/controllers/auth/AuthController";

// Interfaces
import { IRegisterUserUsecase } from "../../application/interfaces/usecases/auth/IRegisterUserUsecase";
import { UserRepository } from "../respositories/UserRepository";
import { TeamRepository } from "../respositories/TeamRepository";
import { ILoginUsecase } from "../../application/interfaces/usecases/auth/ILoginUsecase";
import { LoginUser } from "../../application/usecases/auth/LoginUser";

// Repositories
const userRepository = new UserRepository();
const teamRepository = new TeamRepository();

const hashService = new HashService();
const tokenService = new TokenService();

// Use case
const registerUser: IRegisterUserUsecase = new RegisterUser(
  userRepository,
  teamRepository,
  hashService,
  tokenService,
);

const loginUser: ILoginUsecase = new LoginUser(
  userRepository,
  tokenService,
  hashService,
);

// Controller
export const authController = new AuthController(
  registerUser,
  loginUser,
);

export { tokenService };