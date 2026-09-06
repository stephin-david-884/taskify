import { TaskResponseDTO } from "../../../dtos/task/taskResponse.dto";
import { UpdateTaskDTO } from "../../../dtos/task/updateTask.dto";

export interface IUpdateTaskUseCase {
    execute(
        data: UpdateTaskDTO,
        userId: string,
    ): Promise<TaskResponseDTO>;
}