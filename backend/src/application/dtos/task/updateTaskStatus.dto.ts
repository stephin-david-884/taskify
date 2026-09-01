import { TaskStatus } from "../../../domain/entities/Task.entity";

export interface UpdateTaskStatusDTO {
    taskId: string;
    status: TaskStatus;
}