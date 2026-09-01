import { ITaskRepository } from "../../domain/repositories/ITaskRepository";
import { Task } from "../../domain/entities/Task.entity";
import { TaskLean, TaskModel } from "../database/models/Task";
import { BaseRepository } from "./BaseRepository";
import { toDomainTask, toPersistenceTask } from "../../application/mappers/Task.mapper";

export class TaskRepository
    extends BaseRepository<Task, TaskLean>
    implements ITaskRepository {

    constructor() {
        super(
            TaskModel,
            toDomainTask,
            toPersistenceTask,
        );
    }

    async findByTeamId(teamId: string): Promise<Task[]> {
        const tasks = await this._model
            .find({ teamId })
            .sort({ createdAt: -1 })
            .lean();

        return tasks.map(toDomainTask);
    }

    async findByAssigneeId(memberId: string): Promise<Task[]> {
        const tasks = await this._model
            .find({ assigneeId: memberId })
            .sort({ createdAt: -1 })
            .lean();

        return tasks.map(toDomainTask);
    }

    async findByCreatorId(leadId: string): Promise<Task[]> {
        const tasks = await this._model
            .find({ createdBy: leadId })
            .sort({ createdAt: -1 })
            .lean();

        return tasks.map(toDomainTask);
    }
}