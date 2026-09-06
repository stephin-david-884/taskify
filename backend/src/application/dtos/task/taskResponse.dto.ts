import {
    TaskPriority,
    TaskStatus,
} from "../../../domain/entities/Task.entity";

export interface TaskResponseDTO {
    id: string;

    title: string;
    description: string;

    status: TaskStatus;
    priority: TaskPriority;

    teamId: string;
    teamName: string;

    createdBy: string;
    createdByName: string;

    assignedTo: string;
    assignedToName: string;

    dueDate?: Date;
    completedAt?: Date;
}