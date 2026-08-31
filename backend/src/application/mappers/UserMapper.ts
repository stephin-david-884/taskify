import { User, UserRole } from "../../domain/entities/User.entity";
import { UserLean } from "../../infrastructure/database/models/User";

export const toDomainUser = (dbUser: UserLean): User => {
    return new User({
        id: dbUser._id.toString(),
        name: dbUser.name,
        email: dbUser.email,
        password: dbUser.password ?? undefined,

        role: dbUser.role,
        teamId: dbUser.teamId?.toString() ?? undefined,

        refreshTokens: dbUser.refreshTokens ?? [],
    });
};

export const toPersistenceUser = (user: User) => {
    return {
        name: user.name,
        email: user.email,
        password: user.getPassword(),
        role: user.role,
        teamId: user.teamId ?? null,
        refreshTokens: user.getRefreshTokens(),
    };
};