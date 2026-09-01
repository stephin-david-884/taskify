import express from "express";

import { taskController, tokenService } from "../../infrastructure/di/container";
import { ROUTES } from "../../shared/constants/routes";
import { validate } from "../middlewares/validate";
import { authMiddleware } from "../middlewares/authMiddleware";
import { createTaskSchema } from "../validators/task/createTaskValidator";
import { updateTaskSchema } from "../validators/task/updateTaskValidator";
import { updateTaskStatusSchema } from "../validators/task/updateTaskStatusValidator";
import { taskIdParamSchema } from "../validators/task/taskParamsValidator";

const router = express.Router();

router.use(authMiddleware(tokenService));

router.post(
  ROUTES.TASK.CREATE,
  validate(createTaskSchema, "body"),
  taskController.create,
);

router.get(
  ROUTES.TASK.GET_ALL,
  taskController.getAll,
);

router.get(
  ROUTES.TASK.STATISTICS,
  taskController.getStatistics,
);

router.patch(
  ROUTES.TASK.UPDATE_STATUS,
  validate(taskIdParamSchema, "params"),
  validate(updateTaskStatusSchema, "body"),
  taskController.updateStatus,
);

router.get(
  ROUTES.TASK.GET_BY_ID,
  validate(taskIdParamSchema, "params"),
  taskController.getById,
);

router.put(
  ROUTES.TASK.UPDATE,
  validate(taskIdParamSchema, "params"),
  validate(updateTaskSchema, "body"),
  taskController.update,
);

router.delete(
  ROUTES.TASK.DELETE,
  validate(taskIdParamSchema, "params"),
  taskController.deleteTask,
);

export default router;
