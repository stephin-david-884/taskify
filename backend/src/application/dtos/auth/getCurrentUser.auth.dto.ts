import { UserRole } from "../../../domain/entities/User.entity";

export interface GetCurrentUserOutputDTO {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    teamId?: string;
}