import { Types } from "mongoose";
import { Team } from "../../domain/entities/Team.entity";
import { TeamLean } from "../../infrastructure/database/models/Team";

export const toDomainTeam = (dbTeam: TeamLean): Team => {
  return new Team({
    id: dbTeam._id.toString(),
    name: dbTeam.name,
    leadId: dbTeam.leadId.toString(),
  });
};

export const toPersistenceTeam = (team: Team) => {
  return {
    name: team.name,
    leadId: new Types.ObjectId(team.leadId),
  };
};