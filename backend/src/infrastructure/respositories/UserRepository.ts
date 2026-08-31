import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User, UserRole } from "../../domain/entities/User.entity";
import { UserLean, UserModel } from "../database/models/User";
import { BaseRepository } from "./BaseRepository";
import { toDomainUser, toPersistenceUser } from "../../application/mappers/UserMapper";

export class UserRepository
  extends BaseRepository<User, UserLean>
  implements IUserRepository {
  constructor() {
    super(
      UserModel,
      toDomainUser,
      toPersistenceUser,
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this._model
      .findOne({ email })
      .select("+password")
      .lean();

    if (!user) {
      return null;
    }

    return toDomainUser(user);
  }

  async findByIdWithPassword(id: string): Promise<User | null> {
    const user = await this._model
      .findById(id)
      .select("+password")
      .lean();

    if (!user) {
      return null;
    }

    return toDomainUser(user);
  }

  async findLeads(): Promise<User[]> {
    const users = await this._model
      .find({ role: UserRole.LEAD })
      .sort({ name: 1 })
      .lean();

    return users.map(toDomainUser);
  }
}