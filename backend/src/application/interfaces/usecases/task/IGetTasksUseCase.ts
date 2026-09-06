import { GetTasksDTO } from "../../../dtos/task/getTasks.dto";
import { TaskResponseDTO } from "../../../dtos/task/taskResponse.dto";

export interface IGetTasksUseCase {
    execute(
        data: GetTasksDTO,
        userId: string,
    ): Promise<TaskResponseDTO[]>;
}