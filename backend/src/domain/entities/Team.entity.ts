export class Team {
  public readonly id?: string;
  public name: string;
  public leadId: string;

  constructor(props: TeamProps) {
    this.id = props.id;
    this.name = props.name;
    this.leadId = props.leadId;
  }

  getId(): string {
    if (!this.id) {
      throw new Error("Team ID is not set");
    }

    return this.id;
  }

  updateName(name: string): void {
    this.name = name.trim();
  }

  getLeadId(): string {
    return this.leadId;
  }
}

type TeamProps = {
  id?: string;
  name: string;
  leadId: string;
};