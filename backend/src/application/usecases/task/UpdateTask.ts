import { AppError } from "../../../domain/errors/AppError";
import { ITaskRepository } from "../../../domain/repositories/ITaskRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { statusCode } from "../../constants/enums/statusCode";
import { IRealtimeService } from "../../interfaces/services/task/IRealtimeService";
import { UpdateTaskDTO } from "../../dtos/task/updateTask.dto";
import { IUpdateTaskUseCase } from "../../interfaces/services/task/IUpdateTaskUseCase";

export class UpdateTask implements IUpdateTaskUseCase {
    constructor(
        private readonly taskRepository: ITaskRepository,
        private readonly userRepository: IUserRepository,
        private readonly realtimeService: IRealtimeService,
    ) {}

    async execute(
        data: UpdateTaskDTO,
        userId: string,
    ) {
        const lead = await this.userRepository.findById(userId);

        if (!lead) {
            throw new AppError(
                "User not found",
                statusCode.NOT_FOUND,
            );
        }

        if (!lead.isLead()) {
            throw new AppError(
                "Only team leads can update task details",
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
                "You can only update tasks belonging to your team",
                statusCode.FORBIDDEN,
            );
        }

        if (data.title !== undefined) {
            task.updateTitle(data.title);
        }

        if (data.description !== undefined) {
            task.updateDescription(data.description);
        }

        if (data.priority !== undefined) {
            task.updatePriority(data.priority);
        }

        if (data.dueDate !== undefined) {
            task.updateDueDate(data.dueDate);
        }

        if (data.assignedTo !== undefined) {
            const assignee = await this.userRepository.findById(
                data.assignedTo,
            );

            if (!assignee) {
                throw new AppError(
                    "Assigned member not found",
                    statusCode.NOT_FOUND,
                );
            }

            if (!assignee.isMember()) {
                throw new AppError(
                    "Tasks can only be assigned to team members",
                    statusCode.BAD_REQUEST,
                );
            }

            if (assignee.teamId !== lead.teamId) {
                throw new AppError(
                    "You can only assign tasks to members of your team",
                    statusCode.FORBIDDEN,
                );
            }

            task.assignTo(assignee.getId());
        }

        const updatedTask = await this.taskRepository.save(task);

        this.realtimeService.emitToTeam(
            lead.teamId,
            "task:updated",
            updatedTask,
        );

        return updatedTask;
    }
}