export interface GetCurrentUserOutputDTO {
    id: string;
    name: string;
    email: string;
    role: string;
    teamId?: string;
}