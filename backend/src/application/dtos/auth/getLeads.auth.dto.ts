export interface GetLeadsOutputDTO {
  leads: {
    id: string;
    name: string;
    email: string;
  }[];
}