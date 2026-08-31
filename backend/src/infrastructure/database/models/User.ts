import mongoose, { Document, HydratedDocument, Model, Schema, Types } from "mongoose";
import { UserRole } from "../../../domain/entities/User.entity";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  teamId?: Types.ObjectId | null;
  refreshTokens: string[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
    },

    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },

    refreshTokens: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const UserModel: Model<IUser> = mongoose.model<IUser>(
  "User",
  userSchema,
);

export type UserDocument = HydratedDocument<IUser>;

export type UserLean = IUser & {
  _id: Types.ObjectId;
};
