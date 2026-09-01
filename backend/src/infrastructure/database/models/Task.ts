import mongoose, {
    Document,
    HydratedDocument,
    Model,
    Schema,
    Types,
} from "mongoose";

import {
    TaskPriority,
    TaskStatus,
} from "../../../domain/entities/Task.entity";

export interface ITask extends Document {
    title: string;
    description: string;

    status: TaskStatus;
    priority: TaskPriority;

    teamId: Types.ObjectId;
    createdBy: Types.ObjectId;
    assignedTo: Types.ObjectId;

    dueDate?: Date | null;
    completedAt?: Date | null;

    createdAt: Date;
    updatedAt: Date;
}

const taskSchema: Schema<ITask> = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        status: {
            type: String,
            enum: Object.values(TaskStatus),
            default: TaskStatus.TODO,
            required: true,
        },

        priority: {
            type: String,
            enum: Object.values(TaskPriority),
            default: TaskPriority.MEDIUM,
            required: true,
        },

        teamId: {
            type: Schema.Types.ObjectId,
            ref: "Team",
            required: true,
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        dueDate: {
            type: Date,
            default: null,
        },

        completedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    },
);

taskSchema.index({ teamId: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ createdBy: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ teamId: 1, status: 1 });
taskSchema.index({ assignedTo: 1, status: 1 });

export const TaskModel: Model<ITask> = mongoose.model<ITask>(
    "Task",
    taskSchema,
);

export type TaskDocument = HydratedDocument<ITask>;

export type TaskLean = ITask & {
    _id: Types.ObjectId;
};