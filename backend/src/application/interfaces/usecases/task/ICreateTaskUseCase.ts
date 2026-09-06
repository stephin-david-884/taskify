import { CreateTaskDTO } from "../../../dtos/task/createTask.dto";
import { TaskResponseDTO } from "../../../dtos/task/taskResponse.dto";

export interface ICreateTaskUseCase {
  execute(
    data: CreateTaskDTO,
    createdBy: string,
  ): Promise<TaskResponseDTO>;
}