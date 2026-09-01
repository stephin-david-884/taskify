import {
    GetTaskStatisticsDTO,
    TaskStatistics,
} from "../../../dtos/task/getTaskStatistics.dto";

export interface IGetTaskStatisticsUseCase {
    execute(
        data: GetTaskStatisticsDTO,
        userId: string,
    ): Promise<TaskStatistics>;
}