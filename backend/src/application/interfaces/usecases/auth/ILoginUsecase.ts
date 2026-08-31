import { LoginInputDTO, LoginOutputDTO } from "../../../dtos/auth/login.auth.dto";

export interface ILoginUsecase {
    execute(data: LoginInputDTO): Promise<LoginOutputDTO>;
}