import { UserRole } from "../../../domain/entities/User.entity";

export interface RegisterUserInputDTO {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  teamName?: string;
  leadId?: string;
}

export interface RegisterUserOutputDTO {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    teamId?: string;
  };
}