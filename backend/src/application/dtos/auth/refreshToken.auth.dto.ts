export interface RefreshTokenInputDTO {
  token: string;
}

export interface RefreshTokenOutputDTO {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    teamId?: string;
  };
}