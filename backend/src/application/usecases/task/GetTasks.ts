import { Task } from "../../../domain/entities/Task.entity";
import { AppError } from "../../../domain/errors/AppError";
import { ITaskRepository } from "../../../domain/repositories/ITaskRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { statusCode } from "../../constants/enums/statusCode";
import { GetTasksDTO } from "../../dtos/task/getTasks.dto";
import { IGetTasksUseCase } from "../../interfaces/services/task/IGetTasksUseCase";

export class GetTasks implements IGetTasksUseCase {
    constructor(
        private readonly taskRepository: ITaskRepository,
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(
        _data: GetTasksDTO,
        userId: string,
    ): Promise<Task[]> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new AppError(
                "User not found",
                statusCode.NOT_FOUND,
            );
        }

        if (!user.teamId) {
            throw new AppError(
                "User is not associated with a team",
                statusCode.BAD_REQUEST,
            );
        }

        if (user.isLead()) {
            return this.taskRepository.findByTeamId(
                user.teamId,
            );
        }

        if (user.isMember()) {
            return this.taskRepository.findByAssigneeId(
                user.getId(),
            );
        }

        throw new AppError(
            "Invalid user role",
            statusCode.FORBIDDEN,
        );
    }
}