import {
    TaskPriority,
} from "../../../domain/entities/Task.entity";

export interface UpdateTaskDTO {
    taskId: string;

    title?: string;
    description?: string;
    priority?: TaskPriority;
    assignedTo?: string;
    dueDate?: Date;
}