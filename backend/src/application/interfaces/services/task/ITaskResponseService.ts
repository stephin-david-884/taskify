import { Task } from "../../../../domain/entities/Task.entity";
import { TaskResponseDTO } from "../../../dtos/task/taskResponse.dto";

export interface ITaskResponseService {
    toResponse(task: Task): Promise<TaskResponseDTO>;
    toResponses(tasks: Task[]): Promise<TaskResponseDTO[]>;
}