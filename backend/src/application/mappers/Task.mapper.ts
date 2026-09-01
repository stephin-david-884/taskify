import { Types } from "mongoose";

import { Task } from "../../domain/entities/Task.entity";
import { TaskLean } from "../../infrastructure/database/models/Task";

export const toDomainTask = (dbTask: TaskLean): Task => {
    return new Task({
        id: dbTask._id.toString(),

        title: dbTask.title,
        description: dbTask.description,

        status: dbTask.status,
        priority: dbTask.priority,

        teamId: dbTask.teamId.toString(),
        createdBy: dbTask.createdBy.toString(),
        assignedTo: dbTask.assignedTo.toString(),

        dueDate: dbTask.dueDate ?? undefined,
        completedAt: dbTask.completedAt ?? undefined,
    });
};

export const toPersistenceTask = (task: Task) => {
    return {
        title: task.title,
        description: task.description,

        status: task.status,
        priority: task.priority,

        teamId: new Types.ObjectId(task.teamId),
        createdBy: new Types.ObjectId(task.createdBy),
        assignedTo: new Types.ObjectId(task.assignedTo),

        dueDate: task.dueDate ?? null,
        completedAt: task.completedAt ?? null,
    };
};