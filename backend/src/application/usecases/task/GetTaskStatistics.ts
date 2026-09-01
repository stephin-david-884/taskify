import {
    TaskPriority,
    TaskStatus,
} from "../../../domain/entities/Task.entity";
import { AppError } from "../../../domain/errors/AppError";
import { ITaskRepository } from "../../../domain/repositories/ITaskRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { statusCode } from "../../constants/enums/statusCode";
import {
    GetTaskStatisticsDTO,
    TaskStatistics,
} from "../../dtos/task/getTaskStatistics.dto";
import { IGetTaskStatisticsUseCase } from "../../interfaces/services/task/IGetTaskStatisticsUseCase";

export class GetTaskStatistics
    implements IGetTaskStatisticsUseCase
{
    constructor(
        private readonly taskRepository: ITaskRepository,
        private readonly userRepository: IUserRepository,
    ) {}

    async execute(
        _data: GetTaskStatisticsDTO,
        userId: string,
    ): Promise<TaskStatistics> {
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

        let tasks;

        if (user.isLead()) {
            tasks = await this.taskRepository.findByTeamId(
                user.teamId,
            );
        } else if (user.isMember()) {
            tasks =
                await this.taskRepository.findByAssigneeId(
                    user.getId(),
                );
        } else {
            throw new AppError(
                "Invalid user role",
                statusCode.FORBIDDEN,
            );
        }

        const statistics: TaskStatistics = {
            total: tasks.length,

            byStatus: {
                todo: 0,
                inProgress: 0,
                completed: 0,
            },

            byPriority: {
                low: 0,
                medium: 0,
                high: 0,
            },

            overdue: 0,
        };

        const now = new Date();

        for (const task of tasks) {
            // Status statistics
            if (task.status === TaskStatus.TODO) {
                statistics.byStatus.todo++;
            }

            if (task.status === TaskStatus.IN_PROGRESS) {
                statistics.byStatus.inProgress++;
            }

            if (task.status === TaskStatus.COMPLETED) {
                statistics.byStatus.completed++;
            }

            // Priority statistics
            if (task.priority === TaskPriority.LOW) {
                statistics.byPriority.low++;
            }

            if (task.priority === TaskPriority.MEDIUM) {
                statistics.byPriority.medium++;
            }

            if (task.priority === TaskPriority.HIGH) {
                statistics.byPriority.high++;
            }

            // Overdue statistics
            if (
                task.dueDate &&
                task.dueDate < now &&
                task.status !== TaskStatus.COMPLETED
            ) {
                statistics.overdue++;
            }
        }

        return statistics;
    }
}