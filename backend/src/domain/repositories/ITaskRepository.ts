import { Task } from "../entities/Task.entity";
import { IBaseRepository } from "./IBaseRepository";

export interface ITaskRepository extends IBaseRepository<Task> {
    findByTeamId(teamId: string): Promise<Task[]>;
    findByAssigneeId(memberId: string): Promise<Task[]>;
    findByCreatorId(leadId: string): Promise<Task[]>;
}