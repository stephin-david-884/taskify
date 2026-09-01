import { Task } from "../../../../domain/entities/Task.entity";
import { UpdateTaskDTO } from "../../../dtos/task/updateTask.dto";

export interface IUpdateTaskUseCase {
    execute(
        data: UpdateTaskDTO,
        userId: string,
    ): Promise<Task>;
}