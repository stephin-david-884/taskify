export type GetTaskStatisticsDTO = Record<string, never>;

export interface TaskStatistics {
    total: number;

    byStatus: {
        todo: number;
        inProgress: number;
        completed: number;
    };

    byPriority: {
        low: number;
        medium: number;
        high: number;
    };

    overdue: number;
}