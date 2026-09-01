import { z } from "zod";
import { TaskStatus } from "../../../domain/entities/Task.entity";

export const updateTaskStatusSchema = z.object({
  status: z.enum(TaskStatus, {
    error: "Status must be TODO, IN_PROGRESS or COMPLETED",
  }),
});

export type UpdateTaskStatusBody = z.infer<typeof updateTaskStatusSchema>;
