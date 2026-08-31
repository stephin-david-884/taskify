import { Request, Response } from "express";
import { statusCode } from "../../../application/constants/enums/statusCode";
import { IRegisterUserUsecase } from "../../../application/interfaces/usecases/auth/IRegisterUserUsecase";
import { mapRegisterRequest } from "../../../application/mappers/auth/RegisterRequestMapper";
import { asyncHandler } from "../../http/asyncHandler";
import { sendSuccess } from "../../http/response";
import { authCookieConfig } from "../../../infrastructure/config/cookie.config";
import { ILoginUsecase } from "../../../application/interfaces/usecases/auth/ILoginUsecase";
import { mapLoginRequest } from "../../../application/mappers/auth/LoginRequestMapper";
import { AppError } from "../../../domain/errors/AppError";
import { IRefreshTokenUseCase } from "../../../application/interfaces/usecases/auth/IRefreshTokenUseCase";
import { IGetCurrentUserUseCase } from "../../../application/interfaces/usecases/auth/IGetCurrentUserUseCase";

export class AuthController {
    constructor(
        private readonly _registerUseCase: IRegisterUserUsecase,
        private readonly _loginUseCase: ILoginUsecase,
        private readonly _refreshToken: IRefreshTokenUseCase,
        private readonly _getCurrentUser: IGetCurrentUserUseCase,
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

    refreshToken = asyncHandler(async (req: Request, res: Response) => {
        const refreshTokenFromCookie = req.cookies.refreshToken;

        if (!refreshTokenFromCookie) {
            throw new AppError(
                "Refresh token is required",
                statusCode.UNAUTHORIZED,
            );
        }

        const result = await this._refreshToken.execute({
            token: refreshTokenFromCookie,
        });

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
            "Tokens refreshed successfully",
        );
    });

    getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            throw new AppError("Unauthorized", statusCode.UNAUTHORIZED);
        }

        const user = await this._getCurrentUser.execute( req.user.userId );

        return sendSuccess(
            res,
            statusCode.OK,
            "User fetched successfully",
            { user },
        );
    });
}