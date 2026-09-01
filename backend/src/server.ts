import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import authRoutes from "./interfaces/routes/authRoutes";
import taskRoutes from "./interfaces/routes/taskRoutes";
import { errorHandler } from "./interfaces/middlewares/errorHandler";
import { connectDB } from "./infrastructure/config/mongo.config";
import { createSocketServer } from "./infrastructure/config/socket.config";
import { attachRealtimeServer, tokenService } from "./infrastructure/di/container";

dotenv.config();

const app = express();

connectDB();

const allowedOrigins = process.env.FRONTEND_URL?.split(',').map(
    origin => origin.trim()
) || [];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS: Origin ${origin} not allowed`));
        }
    },
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.use(errorHandler);

const httpServer = createServer(app);

const io = createSocketServer(
    httpServer,
    allowedOrigins,
    tokenService,
);

attachRealtimeServer(io);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log('Server started...')
});