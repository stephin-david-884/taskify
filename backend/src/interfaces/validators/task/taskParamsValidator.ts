import { z } from "zod";

export const taskIdParamSchema = z.object({
  taskId: z
    .string()
    .trim()
    .min(1, "Task ID is required"),
});

export type TaskIdParams = z.infer<typeof taskIdParamSchema>;
