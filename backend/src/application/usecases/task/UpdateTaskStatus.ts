import {
    TaskStatus,
} from "../../../domain/entities/Task.entity";
import { AppError } from "../../../domain/errors/AppError";
import { ITaskRepository } from "../../../domain/repositories/ITaskRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { statusCode } from "../../constants/enums/statusCode";
import { IRealtimeService } from "../../interfaces/services/task/IRealtimeService";
import { UpdateTaskStatusDTO } from "../../dtos/task/updateTaskStatus.dto";
import { IUpdateTaskStatusUseCase } from "../../interfaces/services/task/IUpdateTaskStatusUseCase";

export class UpdateTaskStatus
    implements IUpdateTaskStatusUseCase {
    constructor(
        private readonly taskRepository: ITaskRepository,
        private readonly userRepository: IUserRepository,
        private readonly realtimeService: IRealtimeService,
    ) { }

    async execute(
        data: UpdateTaskStatusDTO,
        userId: string,
    ) {
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

        const task = await this.taskRepository.findById(
            data.taskId,
        );

        if (!task) {
            throw new AppError(
                "Task not found",
                statusCode.NOT_FOUND,
            );
        }

        if (task.teamId !== user.teamId) {
            throw new AppError(
                "You do not have access to this task",
                statusCode.FORBIDDEN,
            );
        }

        const isAssignedMember =
            user.isMember() &&
            task.assignedTo === user.getId();

        const isTeamLead =
            user.isLead();

        if (!isAssignedMember && !isTeamLead) {
            throw new AppError(
                "You are not allowed to update this task",
                statusCode.FORBIDDEN,
            );
        }

        switch (data.status) {
            case TaskStatus.TODO:
                task.resetToTodo();
                break;

            case TaskStatus.IN_PROGRESS:
                task.start();
                break;

            case TaskStatus.COMPLETED:
                task.complete();
                break;

            default:
                throw new AppError(
                    "Invalid task status",
                    statusCode.BAD_REQUEST,
                );
        }

        const updatedTask = await this.taskRepository.save(task);

        this.realtimeService.emitToTeam(
            user.teamId,
            "task:status-updated",
            updatedTask,
        );

        return updatedTask;
    }
}