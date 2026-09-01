export interface IRealtimeService {
    emitToTeam(
        teamId: string,
        event: string,
        data: unknown,
    ): void;

    emitToUser(
        userId: string,
        event: string,
        data: unknown,
    ): void;
}