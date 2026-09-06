import { Task } from "../../../domain/entities/Task.entity";
import { AppError } from "../../../domain/errors/AppError";
import { ITeamRepository } from "../../../domain/repositories/ITeamRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { statusCode } from "../../../application/constants/enums/statusCode";
import { TaskResponseDTO } from "../../../application/dtos/task/taskResponse.dto";
import { ITaskResponseService } from "../../../application/interfaces/services/task/ITaskResponseService";
import { toTaskResponse } from "../../../application/mappers/TaskResponse.mapper";

export class TaskResponseService implements ITaskResponseService {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly teamRepository: ITeamRepository,
    ) {}

    async toResponse(task: Task): Promise<TaskResponseDTO> {
        const [assignedMember, creator, team] = await Promise.all([
            this.userRepository.findById(task.assignedTo),
            this.userRepository.findById(task.createdBy),
            this.teamRepository.findById(task.teamId),
        ]);

        if (!assignedMember) {
            throw new AppError(
                "Assigned user not found",
                statusCode.BAD_REQUEST,
            );
        }

        if (!creator) {
            throw new AppError(
                "Task creator not found",
                statusCode.BAD_REQUEST,
            );
        }

        if (!team) {
            throw new AppError(
                "Team not found",
                statusCode.BAD_REQUEST,
            );
        }

        return toTaskResponse(
            task,
            assignedMember,
            creator,
            team,
        );
    }

    async toResponses(tasks: Task[]): Promise<TaskResponseDTO[]> {
        return Promise.all(
            tasks.map((task) => this.toResponse(task)),
        );
    }
}