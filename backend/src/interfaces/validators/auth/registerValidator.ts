import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .regex(
        /^[A-Za-z]+( [A-Za-z]+)*$/,
        "Name can contain only letters and spaces",
      ),

    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Invalid email address"),

    password: z
      .string()
      .min(6, "Password must contain at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/,
        "Password must contain uppercase, lowercase, number and special character",
      ),

    confirmPassword: z.string(),

    role: z.enum(["LEAD", "MEMBER"]),

    teamName: z.string().trim().optional(),

    leadId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }

    if (data.role === "LEAD" && !data.teamName?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Team name is required for a lead",
        path: ["teamName"],
      });
    }

    if (data.role === "MEMBER" && !data.leadId?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Lead is required for a member",
        path: ["leadId"],
      });
    }
  });

export type RegisterBody = z.infer<typeof registerSchema>;