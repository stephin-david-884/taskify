import { ITeamRepository } from "../../domain/repositories/ITeamRepository";
import { Team } from "../../domain/entities/Team.entity";
import {
  TeamLean,
  TeamModel,
} from "../database/models/Team";
import { BaseRepository } from "./BaseRepository";
import { toDomainTeam, toPersistenceTeam } from "../../application/mappers/TeamMapper";

export class TeamRepository
  extends BaseRepository<Team, TeamLean>
  implements ITeamRepository
{
  constructor() {
    super(
      TeamModel,
      toDomainTeam,
      toPersistenceTeam,
    );
  }

  async findByLeadId(leadId: string): Promise<Team | null> {
    const team = await this._model
      .findOne({ leadId })
      .lean();

    if (!team) {
      return null;
    }

    return toDomainTeam(team);
  }
}