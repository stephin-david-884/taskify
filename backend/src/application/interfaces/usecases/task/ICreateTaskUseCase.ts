import { Task } from "../../../../domain/entities/Task.entity";
import { CreateTaskDTO } from "../../../dtos/task/createTask.dto";

export interface ICreateTaskUseCase {
  execute(
    data: CreateTaskDTO,
    createdBy: string,
  ): Promise<Task>;
}