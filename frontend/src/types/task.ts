export const TaskStatus = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export const TaskPriority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
} as const;

export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority];

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  teamId: string;
  createdBy: string;
  assignedTo: string;
  dueDate?: string;
  completedAt?: string;
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  assignedTo: string;
  teamId: string;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface UpdateTaskPayload {
  taskId: string;
  title?: string;
  description?: string;
  priority?: TaskPriority;
  assignedTo?: string;
  dueDate?: string;
}

export interface UpdateTaskStatusPayload {
  taskId: string;
  status: TaskStatus;
}

export interface GetTaskResponse {
  task: Task;
}

export interface GetTasksResponse {
  tasks: Task[];
}

export interface CreateTaskResponse {
  task: Task;
}

export interface UpdateTaskResponse {
  task: Task;
}

export interface UpdateTaskStatusResponse {
  task: Task;
}

export interface TaskStatistics {
  total: number;
  byStatus: {
    todo: number;
    inProgress: number;
    completed: number;
  };
  byPriority: {
    low: number;
    medium: number;
    high: number;
  };
  overdue: number;
}

export interface GetTaskStatisticsResponse {
  statistics: TaskStatistics;
}

export interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  statistics: TaskStatistics | null;
  loading: boolean;
  error: string | null;
}
