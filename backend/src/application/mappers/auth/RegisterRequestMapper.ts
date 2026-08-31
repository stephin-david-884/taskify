import { RegisterUserInputDTO } from "../../dtos/auth/register.auth.dto";
import { UserRole } from "../../../domain/entities/User.entity";

export const mapRegisterRequest = (
  body: Record<string, unknown>,
): RegisterUserInputDTO => {
  return {
    name: String(body.name ?? ""),
    email: String(body.email ?? ""),
    password: String(body.password ?? ""),
    confirmPassword: String(body.confirmPassword ?? ""),
    role: body.role as UserRole,
    teamName: body.teamName
      ? String(body.teamName)
      : undefined,
    leadId: body.leadId
      ? String(body.leadId)
      : undefined,
  };
};