import { Task } from "../../../domain/entities/Task.entity";
import { AppError } from "../../../domain/errors/AppError";
import { ITaskRepository } from "../../../domain/repositories/ITaskRepository";
import { ITeamRepository } from "../../../domain/repositories/ITeamRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { statusCode } from "../../constants/enums/statusCode";
import { GetTaskDTO } from "../../dtos/task/getTask.dto";
import { TaskResponseDTO } from "../../dtos/task/taskResponse.dto";
import { IGetTaskUseCase } from "../../interfaces/usecases/task/IGetTaskUseCase";
import { toTaskResponse } from "../../mappers/TaskResponse.mapper";

export class GetTask implements IGetTaskUseCase {
    constructor(
        private readonly taskRepository: ITaskRepository,
        private readonly userRepository: IUserRepository,
        private readonly teamRepository: ITeamRepository,
    ) { }

    async execute(
        data: GetTaskDTO,
        userId: string,
    ): Promise<TaskResponseDTO> {
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

        const assignedMember = await this.userRepository.findById(
            task.assignedTo,
        );

        if (!assignedMember) {
            throw new AppError(
                "Assigned User not found",
                statusCode.BAD_REQUEST,
            )
        }

        const creator = await this.userRepository.findById(
            task.createdBy,
        );

        if (!creator) {
            throw new AppError(
                "Lead not found",
                statusCode.BAD_REQUEST,
            )
        }

        const team = await this.teamRepository.findById(
            task.teamId,
        );

        if (!team) {
            throw new AppError(
                "Team not found",
                statusCode.BAD_REQUEST,
            )
        }

        return toTaskResponse(
            task,
            assignedMember,
            creator,
            team,
        );
    }
}