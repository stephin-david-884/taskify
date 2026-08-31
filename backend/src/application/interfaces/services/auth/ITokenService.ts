import { UserRole } from "../../../../domain/entities/User.entity";

export interface AccessTokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  teamId?: string;
}

export interface RefreshTokenPayload {
  userId: string;
}

export interface ITokenService {
  generateAccessToken(payload: AccessTokenPayload): string;
  generateRefreshToken(payload: RefreshTokenPayload): string;

  verifyAccessToken(token: string): AccessTokenPayload;
  verifyRefreshToken(token: string): RefreshTokenPayload;
}