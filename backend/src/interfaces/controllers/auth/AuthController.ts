import { Request, Response } from "express";
import { statusCode } from "../../../application/constants/enums/statusCode";
import { IRegisterUserUsecase } from "../../../application/interfaces/usecases/auth/IRegisterUserUsecase";
import { mapRegisterRequest } from "../../../application/mappers/auth/RegisterRequestMapper";
import { asyncHandler } from "../../http/asyncHandler";
import { sendSuccess } from "../../http/response";
import { authCookieConfig } from "../../../infrastructure/config/cookie.config";
import { ILoginUsecase } from "../../../application/interfaces/usecases/auth/ILoginUsecase";
import { mapLoginRequest } from "../../../application/mappers/auth/LoginRequestMapper";

export class AuthController {
    constructor(
        private readonly _registerUseCase: IRegisterUserUsecase,
        private readonly _loginUseCase: ILoginUsecase,
    ) { }

    register = asyncHandler(async (req: Request, res: Response) => {
        const dto = mapRegisterRequest(req.body);

        const result = await this._registerUseCase.execute(dto);

        res.cookie(
            "accessToken",
            result.accessToken,
            authCookieConfig.accessToken,
        );

        res.cookie(
            "refreshToken",
            result.refreshToken,
            authCookieConfig.refreshToken,
        );

        return sendSuccess(
            res,
            statusCode.CREATED,
            "Registration successful",
            {
                user: result.user,
            },
        );
    });

    login = asyncHandler(async (req: Request, res: Response) => {
        const dto = mapLoginRequest(req.body);

        const result = await this._loginUseCase.execute(dto);

        res.cookie(
            "accessToken",
            result.accessToken,
            authCookieConfig.accessToken,
        );

        res.cookie(
            "refreshToken",
            result.refreshToken,
            authCookieConfig.refreshToken,
        );

        return sendSuccess(
            res,
            statusCode.OK,
            "Login successful",
            {
                user: result.user,
            },
        );
    });
}