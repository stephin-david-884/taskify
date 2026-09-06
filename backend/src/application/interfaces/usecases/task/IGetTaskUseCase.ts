import { GetTaskDTO } from "../../../dtos/task/getTask.dto";
import { TaskResponseDTO } from "../../../dtos/task/taskResponse.dto";

export interface IGetTaskUseCase {
    execute(
        data: GetTaskDTO,
        userId: string,
    ): Promise<TaskResponseDTO>;
}