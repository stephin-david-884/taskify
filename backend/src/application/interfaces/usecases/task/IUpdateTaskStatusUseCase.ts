import { TaskResponseDTO } from "../../../dtos/task/taskResponse.dto";
import { UpdateTaskStatusDTO } from "../../../dtos/task/updateTaskStatus.dto";

export interface IUpdateTaskStatusUseCase {
    execute(
        data: UpdateTaskStatusDTO,
        userId: string,
    ): Promise<TaskResponseDTO>;
}