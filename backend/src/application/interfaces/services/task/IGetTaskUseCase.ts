import { Task } from "../../../../domain/entities/Task.entity";
import { GetTaskDTO } from "../../../dtos/task/getTask.dto";

export interface IGetTaskUseCase {
    execute(
        data: GetTaskDTO,
        userId: string,
    ): Promise<Task>;
}