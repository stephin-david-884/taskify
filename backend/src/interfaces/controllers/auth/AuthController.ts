import { Request, Response } from "express";
import { statusCode } from "../../../application/constants/enums/statusCode";
import { IRegisterUserUsecase } from "../../../application/interfaces/usecases/auth/IRegisterUserUsecase";
import { mapRegisterRequest } from "../../../application/mappers/auth/RegisterRequestMapper";
import { asyncHandler } from "../../http/asyncHandler";
import { sendSuccess } from "../../http/response";
import { authCookieConfig } from "../../../infrastructure/config/cookie.config";

export class AuthController {
    constructor(
        private readonly _registerUseCase: IRegisterUserUsecase,
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
}