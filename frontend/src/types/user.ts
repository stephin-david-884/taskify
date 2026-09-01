export type UserRole = "LEAD" | "MEMBER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  teamId?: string;
}


export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  teamName?: string;
  leadId?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterResponse {
  user: User;
}

export interface LoginResponse {
  user: User;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface CurrentUserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  teamId?: string;
}


export interface Lead {
  id: string;
  name: string;
  email: string;
}

export interface GetLeadsResponse {
  leads: Lead[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  leads: Lead[];
}