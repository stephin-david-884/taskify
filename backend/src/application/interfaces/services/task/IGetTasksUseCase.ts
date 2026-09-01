import { Task } from "../../../../domain/entities/Task.entity";
import { GetTasksDTO } from "../../../dtos/task/getTasks.dto";

export interface IGetTasksUseCase {
    execute(
        data: GetTasksDTO,
        userId: string,
    ): Promise<Task[]>;
}