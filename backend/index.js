import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import storyRoute from "./routes/story.route.js";
import adminRoute from "./routes/admin.js";
import aiRoutes from "./routes/aiRoutes.js";
import { app, server } from "./socket/socket.js";
import { EventEmitter } from "events";

EventEmitter.defaultMaxListeners = 20;


dotenv.config();

const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: process.env.URL,
    credentials: true
}));

// MongoDB connn
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(" MongoDB connected successfully!");
    } catch (error) {
        console.error(" MongoDB connn error:", error);
        process.exit(1);
    }
};

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/story", storyRoute);
app.use("/admin", adminRoute);
app.use("/api/v1/ai", aiRoutes);

// Start server
server.listen(PORT, () => {
    connectDB();
    console.log(` Server is running on port ${PORT}`);
});
