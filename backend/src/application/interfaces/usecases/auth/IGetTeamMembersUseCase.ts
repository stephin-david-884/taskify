import { GetTeamMembersOutputDTO } from "../../../dtos/auth/getTeamMembers.auth.dto";

export interface IGetTeamMembersUseCase {
  execute(userId: string): Promise<GetTeamMembersOutputDTO>;
}
