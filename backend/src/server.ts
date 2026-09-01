import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./interfaces/routes/authRoutes";
import { errorHandler } from "./interfaces/middlewares/errorHandler";
import { connectDB } from "./infrastructure/config/mongo.config";

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

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('Server started...')
});