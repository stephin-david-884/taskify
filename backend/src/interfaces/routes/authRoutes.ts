import express from "express";

import { authController } from "../../infrastructure/di/container";
import { ROUTES } from "../../shared/constants/routes";
import { registerSchema } from "../validators/auth/registerValidator";
import { validate } from "../middlewares/validate";

const router = express.Router();

router.post(
  ROUTES.AUTH.REGISTER,
  validate(registerSchema, "body"),
  authController.register,
);

export default router;