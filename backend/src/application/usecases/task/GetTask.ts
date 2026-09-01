import { Task } from "../../../domain/entities/Task.entity";
import { AppError } from "../../../domain/errors/AppError";
import { ITaskRepository } from "../../../domain/repositories/ITaskRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { statusCode } from "../../constants/enums/statusCode";
import { GetTaskDTO } from "../../dtos/task/getTask.dto";
import { IGetTaskUseCase } from "../../interfaces/services/task/IGetTaskUseCase";

export class GetTask implements IGetTaskUseCase {
    constructor(
        private readonly taskRepository: ITaskRepository,
        private readonly userRepository: IUserRepository,
    ) {}

    async execute(
        data: GetTaskDTO,
        userId: string,
    ): Promise<Task> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new AppError(
                "User not found",
                statusCode.NOT_FOUND,
            );
        }

        const task = await this.taskRepository.findById(
            data.taskId,
        );

        if (!task) {
            throw new AppError(
                "Task not found",
                statusCode.NOT_FOUND,
            );
        }

        if (!user.teamId) {
            throw new AppError(
                "User is not associated with a team",
                statusCode.BAD_REQUEST,
            );
        }

        if (task.teamId !== user.teamId) {
            throw new AppError(
                "You do not have access to this task",
                statusCode.FORBIDDEN,
            );
        }

        return task;
    }
}