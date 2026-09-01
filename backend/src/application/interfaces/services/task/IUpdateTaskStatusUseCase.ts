import { Task } from "../../../../domain/entities/Task.entity";
import { UpdateTaskStatusDTO } from "../../../dtos/task/updateTaskStatus.dto";

export interface IUpdateTaskStatusUseCase {
    execute(
        data: UpdateTaskStatusDTO,
        userId: string,
    ): Promise<Task>;
}