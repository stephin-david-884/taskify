import { z } from "zod";
import { TaskPriority } from "../../../domain/entities/Task.entity";

export const updateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title cannot be empty")
    .optional(),

  description: z
    .string()
    .trim()
    .min(1, "Description cannot be empty")
    .optional(),

  priority: z
    .enum(TaskPriority, {
      error: "Priority must be LOW, MEDIUM or HIGH",
    })
    .optional(),

  assignedTo: z
    .string()
    .trim()
    .min(1, "Assigned member cannot be empty")
    .optional(),

  dueDate: z.coerce.date().optional(),
});

export type UpdateTaskBody = z.infer<typeof updateTaskSchema>;
