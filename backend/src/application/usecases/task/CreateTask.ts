import { CreateTaskDTO } from "../../dtos/task/createTask.dto";
import { ITaskRepository } from "../../../domain/repositories/ITaskRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { Task, TaskStatus } from "../../../domain/entities/Task.entity";
import { AppError } from "../../../domain/errors/AppError";
import { statusCode } from "../../constants/enums/statusCode";
import { ICreateTaskUseCase } from "../../interfaces/usecases/task/ICreateTaskUseCase";
import { IRealtimeService } from "../../interfaces/services/task/IRealtimeService";

export class CreateTask implements ICreateTaskUseCase {
    constructor(
        private readonly taskRepository: ITaskRepository,
        private readonly userRepository: IUserRepository,
        private readonly realtimeService: IRealtimeService,
    ) { }

    async execute(
        data: CreateTaskDTO,
        createdBy: string,
    ): Promise<Task> {
        const creator = await this.userRepository.findById(createdBy);

        if (!creator) {
            throw new AppError(
                "User not found",
                statusCode.NOT_FOUND,
            );
        }

        if (!creator.isLead()) {
            throw new AppError(
                "Only team leads can create tasks",
                statusCode.FORBIDDEN,
            );
        }

        if (!creator.teamId) {
            throw new AppError(
                "Lead is not associated with a team",
                statusCode.BAD_REQUEST,
            );
        }

        if (creator.teamId !== data.teamId) {
            throw new AppError(
                "You can only create tasks for your own team",
                statusCode.FORBIDDEN,
            );
        }

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

        if (assignee.teamId !== creator.teamId) {
            throw new AppError(
                "You can only assign tasks to members of your team",
                statusCode.FORBIDDEN,
            );
        }

        const task = new Task({
            title: data.title,
            description: data.description,
            teamId: creator.teamId,
            assignedTo: assignee.getId(),
            createdBy: creator.getId(),
            status: TaskStatus.TODO,
            priority: data.priority,
            dueDate: data.dueDate,
        });

        const createdTask = await this.taskRepository.save(task);

        this.realtimeService.emitToTeam(
            creator.teamId,
            "task:created",
            createdTask,
        );

        return createdTask;
    }
}