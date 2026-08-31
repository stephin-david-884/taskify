import { GetLeadsOutputDTO } from "../../../dtos/auth/getLeads.auth.dto";

export interface IGetLeadsUsecase {
  execute(): Promise<GetLeadsOutputDTO>;
}