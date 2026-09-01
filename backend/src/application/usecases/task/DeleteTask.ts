import { AppError } from "../../../domain/errors/AppError";
import { ITaskRepository } from "../../../domain/repositories/ITaskRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { statusCode } from "../../constants/enums/statusCode";
import { IRealtimeService } from "../../interfaces/services/task/IRealtimeService";
import { DeleteTaskDTO } from "../../dtos/task/deleteTask.dto";
import { IDeleteTaskUseCase } from "../../interfaces/services/task/IDeleteTaskUseCase";

export class DeleteTask implements IDeleteTaskUseCase {
    constructor(
        private readonly taskRepository: ITaskRepository,
        private readonly userRepository: IUserRepository,
        private readonly realtimeService: IRealtimeService,
    ) {}

    async execute(
        data: DeleteTaskDTO,
        userId: string,
    ): Promise<void> {
        const lead = await this.userRepository.findById(userId);

        if (!lead) {
            throw new AppError(
                "User not found",
                statusCode.NOT_FOUND,
            );
        }

        if (!lead.isLead()) {
            throw new AppError(
                "Only team leads can delete tasks",
                statusCode.FORBIDDEN,
            );
        }

        if (!lead.teamId) {
            throw new AppError(
                "Lead is not associated with a team",
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

        if (task.teamId !== lead.teamId) {
            throw new AppError(
                "You can only delete tasks belonging to your team",
                statusCode.FORBIDDEN,
            );
        }

        await this.taskRepository.deleteById(
            task.getId(),
        );

        this.realtimeService.emitToTeam(
            lead.teamId,
            "task:deleted",
            {
                taskId: task.getId(),
            },
        );
    }
}