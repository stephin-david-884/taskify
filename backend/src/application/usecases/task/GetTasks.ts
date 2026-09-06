import { AppError } from "../../../domain/errors/AppError";
import { ITaskRepository } from "../../../domain/repositories/ITaskRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { statusCode } from "../../constants/enums/statusCode";
import { GetTasksDTO } from "../../dtos/task/getTasks.dto";
import { TaskResponseDTO } from "../../dtos/task/taskResponse.dto";
import { IGetTasksUseCase } from "../../interfaces/usecases/task/IGetTasksUseCase";
import { ITaskResponseService } from "../../interfaces/services/task/ITaskResponseService";

export class GetTasks implements IGetTasksUseCase {
    constructor(
        private readonly taskRepository: ITaskRepository,
        private readonly userRepository: IUserRepository,
        private readonly taskResponseService: ITaskResponseService,
    ) { }

    async execute(
        _data: GetTasksDTO,
        userId: string,
    ): Promise<TaskResponseDTO[]> {
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
            const tasks = await this.taskRepository.findByTeamId(user.teamId);

            return this.taskResponseService.toResponses(tasks);
        }

        if (user.isMember()) {
            const tasks = await this.taskRepository.findByAssigneeId(user.getId());

            return this.taskResponseService.toResponses(tasks);
        }

        throw new AppError(
            "Invalid user role",
            statusCode.FORBIDDEN,
        );
    }
}