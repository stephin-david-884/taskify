export interface LoginInputDTO {
  email: string;
  password: string;
}

export interface LoginOutputDTO {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "LEAD" | "MEMBER";
    teamId?: string;
  };
}