export interface TeamMemberDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  teamId?: string;
}

export interface GetTeamMembersOutputDTO {
  members: TeamMemberDTO[];
}
