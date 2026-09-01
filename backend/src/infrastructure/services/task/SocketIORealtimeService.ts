import { Server } from "socket.io";
import { IRealtimeService } from "../../../application/interfaces/services/task/IRealtimeService";

export class SocketIORealtimeService implements IRealtimeService {
  constructor(private readonly io: Server) {}

  emitToTeam(
    teamId: string,
    event: string,
    data: unknown,
  ): void {
    this.io.to(`team:${teamId}`).emit(event, data);
  }

  emitToUser(
    userId: string,
    event: string,
    data: unknown,
  ): void {
    this.io.to(`user:${userId}`).emit(event, data);
  }
}