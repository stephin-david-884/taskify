import { DeleteTaskDTO } from "../../../dtos/task/deleteTask.dto";

export interface IDeleteTaskUseCase {
    execute(
        data: DeleteTaskDTO,
        userId: string,
    ): Promise<void>;
}