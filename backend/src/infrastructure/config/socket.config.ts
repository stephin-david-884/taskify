import { Server as HttpServer } from "http";
import { Server } from "socket.io";

import {
  AccessTokenPayload,
  ITokenService,
} from "../../application/interfaces/services/auth/ITokenService";

const parseCookieHeader = (
  cookieHeader: string | undefined,
): Record<string, string> => {
  if (!cookieHeader) {
    return {};
  }

  const cookies: Record<string, string> = {};

  for (const part of cookieHeader.split(";")) {
    const separatorIndex = part.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = part.slice(0, separatorIndex).trim();
    const value = part.slice(separatorIndex + 1).trim();

    cookies[key] = decodeURIComponent(value);
  }

  return cookies;
};

export const createSocketServer = (
  httpServer: HttpServer,
  allowedOrigins: string[],
  tokenService: ITokenService,
): Server => {
  const io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`CORS: Origin ${origin} not allowed`));
        }
      },
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const cookies = parseCookieHeader(socket.handshake.headers.cookie);
      const accessToken = cookies.accessToken;

      if (!accessToken) {
        return next(new Error("Access token is required"));
      }

      const payload = tokenService.verifyAccessToken(accessToken);
      socket.data.user = payload;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.data.user as AccessTokenPayload | undefined;

    if (!user) {
      socket.disconnect(true);
      return;
    }

    socket.join(`user:${user.userId}`);

    if (user.teamId) {
      socket.join(`team:${user.teamId}`);
    }
  });

  return io;
};
