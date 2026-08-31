import mongoose, { Document, HydratedDocument, Model, Schema, Types } from "mongoose";

export interface ITeam extends Document {
    name: string;
    leadId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const teamSchema: Schema<ITeam> = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        leadId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
    },
    {
        timestamps: true,
    },
);

export const TeamModel: Model<ITeam> = mongoose.model<ITeam>(
    "Team",
    teamSchema,
);

export type TeamDocument = HydratedDocument<ITeam>;

export type TeamLean = ITeam & {
    _id: Types.ObjectId;
};