import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { GetLeadsOutputDTO } from "../../dtos/auth/getLeads.auth.dto";
import { IGetLeadsUsecase } from "../../interfaces/usecases/auth/IGetLeadsUsecase";

export class GetLeads implements IGetLeadsUsecase {
    constructor(
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(): Promise<GetLeadsOutputDTO> {
        const leads = await this.userRepository.findLeads();

        return {
            leads: leads.map((lead) => ({
                id: lead.getId(),
                name: lead.name,
                email: lead.email,
            })),
        };
    }
}