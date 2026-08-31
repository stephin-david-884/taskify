export enum UserRole {
  LEAD = "LEAD",
  MEMBER = "MEMBER",
}

export class User {
  public readonly id?: string;
  public name: string;
  public email: string;
  private password?: string;
  public role: UserRole;
  public teamId?: string;

  private refreshTokens: string[];

  constructor(props: UserProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;

    this.role = props.role;
    this.teamId = props.teamId;

    this.refreshTokens = props.refreshTokens ?? [];
  }

  getPassword(): string | undefined {
    return this.password;
  }

  setPassword(hashedPassword: string): void {
    this.password = hashedPassword;
  }

  addRefreshToken(token: string): void {
    this.refreshTokens.push(token);
  }

  removeRefreshToken(token: string): void {
    this.refreshTokens = this.refreshTokens.filter(
      (refreshToken) => refreshToken !== token,
    );
  }

  getRefreshTokens(): string[] {
    return [...this.refreshTokens];
  }

  setRefreshTokens(tokens: string[]): void {
    this.refreshTokens = [...tokens];
  }

  getId(): string {
    if (!this.id) {
      throw new Error("User ID is not set");
    }

    return this.id;
  }

  setTeam(teamId: string): void {
    this.teamId = teamId;
  }

  isLead(): boolean {
    return this.role === UserRole.LEAD;
  }

  isMember(): boolean {
    return this.role === UserRole.MEMBER;
  }

  updateName(name: string): void {
    this.name = name.trim();
  }
}

type UserProps = {
  id?: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  teamId?: string;
  refreshTokens?: string[];
};

