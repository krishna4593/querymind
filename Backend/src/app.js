import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import morgan from "morgan";
import chatRouter from "./routes/chat.route.js";

const app = express();

// Allow one or more frontend origins from env (comma-separated).
const allowedOrigins = process.env.CORS_ORIGIN
	? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
	: ["http://localhost:5173"];

// CORS policy for frontend <-> backend communication.
app.use(
	cors({
		origin: allowedOrigins,
		credentials: true,
	})
);

//MIDDLEWARES
app.use(morgan("dev")); // Log HTTP requests to console for debugging.

// Parse JSON request bodies (safe limit for API payloads).
app.use(express.json({ limit: "1mb" }));

// Parse URL-encoded form data.
app.use(express.urlencoded({ extended: true }));

// Parse cookies so auth/session data is available in req.cookies.
app.use(cookieParser());



// Authentication routes.
app.use("/api/auth", authRoutes);

// Chat routes.
app.use("/api/chats", chatRouter);

export default app;
