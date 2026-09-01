import { z } from "zod";
import { TaskPriority } from "../../../domain/entities/Task.entity";

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required"),

  description: z
    .string()
    .trim()
    .min(1, "Description is required"),

  priority: z.enum(TaskPriority, {
    error: "Priority must be LOW, MEDIUM or HIGH",
  }),

  assignedTo: z
    .string()
    .trim()
    .min(1, "Assigned member is required"),

  teamId: z
    .string()
    .trim()
    .min(1, "Team ID is required"),

  dueDate: z.coerce.date().optional(),
});

export type CreateTaskBody = z.infer<typeof createTaskSchema>;
