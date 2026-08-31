import { Team } from "../entities/Team.entity";
import { IBaseRepository } from "./IBaseRepository";

export interface ITeamRepository extends IBaseRepository<Team> {
  findByLeadId(leadId: string): Promise<Team | null>;
}