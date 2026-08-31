import express from "express";

import { authController } from "../../infrastructure/di/container";
import { ROUTES } from "../../shared/constants/routes";
import { registerSchema } from "../validators/auth/registerValidator";
import { validate } from "../middlewares/validate";
import { loginSchema } from "../validators/auth/loginValidator";

const router = express.Router();

router.post(
  ROUTES.AUTH.REGISTER,
  validate(registerSchema, "body"),
  authController.register,
);

router.post(
  ROUTES.AUTH.LOGIN,
  validate(loginSchema, "body"),
  authController.login,
);

router.post(
  ROUTES.AUTH.REFRESH_TOKEN,
  authController.refreshToken,
);

export default router;