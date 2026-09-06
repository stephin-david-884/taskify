import "../config/env";

import { HashService } from "../services/auth/HashService";
import { TokenService } from "../services/auth/TokenService";

import { RegisterUser } from "../../application/usecases/auth/RegisterUser";

import { AuthController } from "../../interfaces/controllers/auth/AuthController";

// Interfaces
import { IRegisterUserUsecase } from "../../application/interfaces/usecases/auth/IRegisterUserUsecase";
import { UserRepository } from "../respositories/UserRepository";
import { TeamRepository } from "../respositories/TeamRepository";
import { ILoginUsecase } from "../../application/interfaces/usecases/auth/ILoginUsecase";
import { LoginUser } from "../../application/usecases/auth/LoginUser";
import { IRefreshTokenUseCase } from "../../application/interfaces/usecases/auth/IRefreshTokenUseCase";
import { RefreshToken } from "../../application/usecases/auth/RefreshToken.auth";
import { IGetCurrentUserUseCase } from "../../application/interfaces/usecases/auth/IGetCurrentUserUseCase";
import { GetCurrentUser } from "../../application/usecases/auth/GetCurrentUser.auth";
import { ILogoutUseCase } from "../../application/interfaces/usecases/auth/ILogoutUseCase";
import { Logout } from "../../application/usecases/auth/Logout.auth";
import { IGetLeadsUsecase } from "../../application/interfaces/usecases/auth/IGetLeadsUsecase";
import { GetLeads } from "../../application/usecases/auth/GetLeads.auth";
import { TaskRepository } from "../respositories/TaskRepository";
import { SocketIORealtimeService } from "../services/task/SocketIORealtimeService";
import { Server as SocketServer } from "socket.io";
import { ICreateTaskUseCase } from "../../application/interfaces/usecases/task/ICreateTaskUseCase";
import { CreateTask } from "../../application/usecases/task/CreateTask";
import { IGetTaskUseCase } from "../../application/interfaces/usecases/task/IGetTaskUseCase";
import { GetTask } from "../../application/usecases/task/GetTask";
import { IGetTasksUseCase } from "../../application/interfaces/usecases/task/IGetTasksUseCase";
import { GetTasks } from "../../application/usecases/task/GetTasks";
import { IUpdateTaskUseCase } from "../../application/interfaces/usecases/task/IUpdateTaskUseCase";
import { UpdateTask } from "../../application/usecases/task/UpdateTask";
import { IUpdateTaskStatusUseCase } from "../../application/interfaces/usecases/task/IUpdateTaskStatusUseCase";
import { UpdateTaskStatus } from "../../application/usecases/task/UpdateTaskStatus";
import { IDeleteTaskUseCase } from "../../application/interfaces/usecases/task/IDeleteTaskUseCase";
import { DeleteTask } from "../../application/usecases/task/DeleteTask";
import { IGetTaskStatisticsUseCase } from "../../application/interfaces/usecases/task/IGetTaskStatisticsUseCase";
import { GetTaskStatistics } from "../../application/usecases/task/GetTaskStatistics";
import { TaskController } from "../../interfaces/controllers/task/TaskController";
import { IGetTeamMembersUseCase } from "../../application/interfaces/usecases/auth/IGetTeamMembersUseCase";
import { GetTeamMembers } from "../../application/usecases/auth/GetTeamMembers.auth";
import { TaskResponseService } from "../services/task/TaskResponseService";

// Repositories
const userRepository = new UserRepository();
const teamRepository = new TeamRepository();
const taskRepository = new TaskRepository();

const hashService = new HashService();
const tokenService = new TokenService();
const realtimeService = new SocketIORealtimeService();

const taskResponseService = new TaskResponseService(userRepository, teamRepository);

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

const refreshToken: IRefreshTokenUseCase = new RefreshToken(
  userRepository,
  tokenService,
  hashService,
);

const getCurrentUser: IGetCurrentUserUseCase =
  new GetCurrentUser(userRepository);

const logout: ILogoutUseCase = new Logout(
  userRepository,
  tokenService,
  hashService,
);

const getLeads: IGetLeadsUsecase = new GetLeads(
  userRepository,
);


const createTask: ICreateTaskUseCase = new CreateTask(
  taskRepository,
  userRepository,
  realtimeService,
  taskResponseService,
);

const getTask: IGetTaskUseCase = new GetTask(
  taskRepository,
  userRepository,
  teamRepository,
  
);

const getTasks: IGetTasksUseCase = new GetTasks(
  taskRepository,
  userRepository,
  taskResponseService
);

const updateTask: IUpdateTaskUseCase = new UpdateTask(
  taskRepository,
  userRepository,
  realtimeService,
  taskResponseService
);

const updateTaskStatus: IUpdateTaskStatusUseCase = new UpdateTaskStatus(
  taskRepository,
  userRepository,
  realtimeService,
  taskResponseService
);

const deleteTask: IDeleteTaskUseCase = new DeleteTask(
  taskRepository,
  userRepository,
  realtimeService,
);

const getTaskStatistics: IGetTaskStatisticsUseCase = new GetTaskStatistics(
  taskRepository,
  userRepository,
);



const getTeamMembers: IGetTeamMembersUseCase = new GetTeamMembers(
  userRepository,
);

// Controller
export const authController = new AuthController(
  registerUser,
  loginUser,
  refreshToken,
  getCurrentUser,
  logout,
  getLeads,
  getTeamMembers,
);

export const taskController = new TaskController(
  createTask,
  getTask,
  getTasks,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getTaskStatistics,
);

export const attachRealtimeServer = (io: SocketServer): void => {
  realtimeService.attach(io);
};

export { tokenService };