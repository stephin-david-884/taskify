import { TaskPriority } from "../../../domain/entities/Task.entity";

export interface CreateTaskDTO {
  title: string;
  description: string;
  assignedTo: string;
  teamId: string;
  priority?: TaskPriority;
  dueDate?: Date;
}