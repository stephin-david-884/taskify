import { Request, Response } from "express";
import { statusCode } from "../../../application/constants/enums/statusCode";
import { ICreateTaskUseCase } from "../../../application/interfaces/usecases/task/ICreateTaskUseCase";
import { IGetTaskUseCase } from "../../../application/interfaces/services/task/IGetTaskUseCase";
import { IGetTasksUseCase } from "../../../application/interfaces/services/task/IGetTasksUseCase";
import { IUpdateTaskUseCase } from "../../../application/interfaces/services/task/IUpdateTaskUseCase";
import { IUpdateTaskStatusUseCase } from "../../../application/interfaces/services/task/IUpdateTaskStatusUseCase";
import { IDeleteTaskUseCase } from "../../../application/interfaces/services/task/IDeleteTaskUseCase";
import { IGetTaskStatisticsUseCase } from "../../../application/interfaces/services/task/IGetTaskStatisticsUseCase";
import { asyncHandler } from "../../http/asyncHandler";
import { sendSuccess } from "../../http/response";
import { AppError } from "../../../domain/errors/AppError";
import { GetTasksDTO } from "../../../application/dtos/task/getTasks.dto";
import { GetTaskStatisticsDTO } from "../../../application/dtos/task/getTaskStatistics.dto";

export class TaskController {
    constructor(
        private readonly _createTask: ICreateTaskUseCase,
        private readonly _getTask: IGetTaskUseCase,
        private readonly _getTasks: IGetTasksUseCase,
        private readonly _updateTask: IUpdateTaskUseCase,
        private readonly _updateTaskStatus: IUpdateTaskStatusUseCase,
        private readonly _deleteTask: IDeleteTaskUseCase,
        private readonly _getTaskStatistics: IGetTaskStatisticsUseCase,
    ) { }

    private getAuthenticatedUserId(req: Request): string {
        if (!req.user) {
            throw new AppError("Unauthorized", statusCode.UNAUTHORIZED);
        }

        return req.user.userId;
    }

    private getTaskId(req: Request): string {
        const taskId = req.params.taskId;

        if (typeof taskId !== "string" || !taskId.trim()) {
            throw new AppError(
                "Task ID is required",
                statusCode.BAD_REQUEST,
            );
        }

        return taskId;
    }

    create = asyncHandler(async (req: Request, res: Response) => {
        const userId = this.getAuthenticatedUserId(req);

        const task = await this._createTask.execute(
            {
                title: req.body.title,
                description: req.body.description,
                assignedTo: req.body.assignedTo,
                teamId: req.body.teamId,
                priority: req.body.priority,
                dueDate: req.body.dueDate,
            },
            userId,
        );

        return sendSuccess(
            res,
            statusCode.CREATED,
            "Task created successfully",
            { task },
        );
    });

    getById = asyncHandler(async (req: Request, res: Response) => {
        const userId = this.getAuthenticatedUserId(req);

        const task = await this._getTask.execute(
            {
                taskId: this.getTaskId(req),
            },
            userId,
        );

        return sendSuccess(
            res,
            statusCode.OK,
            "Task fetched successfully",
            { task },
        );
    });

    getAll = asyncHandler(async (req: Request, res: Response) => {
        const userId = this.getAuthenticatedUserId(req);

        const tasks = await this._getTasks.execute(
            {} as GetTasksDTO,
            userId,
        );

        return sendSuccess(
            res,
            statusCode.OK,
            "Tasks fetched successfully",
            { tasks },
        );
    });

    update = asyncHandler(async (req: Request, res: Response) => {
        const userId = this.getAuthenticatedUserId(req);

        const task = await this._updateTask.execute(
            {
                taskId: this.getTaskId(req),
                title: req.body.title,
                description: req.body.description,
                priority: req.body.priority,
                assignedTo: req.body.assignedTo,
                dueDate: req.body.dueDate,
            },
            userId,
        );

        return sendSuccess(
            res,
            statusCode.OK,
            "Task updated successfully",
            { task },
        );
    });

    updateStatus = asyncHandler(async (req: Request, res: Response) => {
        const userId = this.getAuthenticatedUserId(req);

        const task = await this._updateTaskStatus.execute(
            {
                taskId: this.getTaskId(req),
                status: req.body.status,
            },
            userId,
        );

        return sendSuccess(
            res,
            statusCode.OK,
            "Task status updated successfully",
            { task },
        );
    });

    deleteTask = asyncHandler(async (req: Request, res: Response) => {
        const userId = this.getAuthenticatedUserId(req);

        await this._deleteTask.execute(
            {
                taskId: this.getTaskId(req),
            },
            userId,
        );

        return sendSuccess(
            res,
            statusCode.OK,
            "Task deleted successfully",
        );
    });

    getStatistics = asyncHandler(async (req: Request, res: Response) => {
        const userId = this.getAuthenticatedUserId(req);

        const statistics = await this._getTaskStatistics.execute(
            {} as GetTaskStatisticsDTO,
            userId,
        );

        return sendSuccess(
            res,
            statusCode.OK,
            "Task statistics fetched successfully",
            { statistics },
        );
    });
}
