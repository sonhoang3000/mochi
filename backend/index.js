import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import mongoose from "mongoose"
import { User } from "./models/user.model.js";
import userRoute from "./routes/user.route.js"
import postRoute from "./routes/post.route.js"
import messageRoute from "./routes/message.route.js";
import postRoute from "./routes/post.route.js";
import userRoute from "./routes/user.route.js";
import storyRoute from "./routes/story.route.js"
import adminRoute from "./routes/admin.js";
import { app, io, server } from "./socket/socket.js";
// import path from "path"

dotenv.config();

const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

// Middleware

// const __dirname = path.resolve()


app.use(express.json())
app.use(cookieParser())
app.use(urlencoded({ extended: true }))
const corsOptions = {
    origin: process.env.URL,
    credentials: true
};
app.use(cors(corsOptions));

// Kết nối MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log(" MongoDB connected successfully!");
    } catch (error) {
        console.error(" MongoDB connection error:", error);
        process.exit(1);
    }
};
app.use("/api/v1/user", userRoute)
app.use("/api/v1/post", postRoute)
app.use("/api/v1/message", messageRoute)
app.use("/api/v1/story", storyRoute)
app.use("/admin", adminRoute);

// app.use(express.static(path.join(__dirname, "/frontend/dist")))
// app.get("*", (req, res) => {
//       res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
// })

const onlineUsers = new Map();

io.on("connection", async (socket) => {
    console.log(` User connected: ${socket.id}`);

    socket.on("user-online", async (userId) => {
        onlineUsers.set(userId, socket.id);
        await User.findByIdAndUpdate(userId, { online: true });

        console.log(`User ${userId} is online`);
        io.emit("update-user-status", { userId, online: true });
    });

    // Khi user logout hoặc tắt tab
    socket.on("disconnect", async () => {
        const userId = [...onlineUsers.entries()].find(([_, id]) => id === socket.id)?.[0];

        if (userId) {
            await User.findByIdAndUpdate(userId, { online: false });
            onlineUsers.delete(userId);

            console.log(` User ${userId} is offline`);
            io.emit("update-user-status", { userId, online: false });
        }
    });
});


server.listen(PORT, () => {
    connectDB()
    console.log(`Server is running at port ${PORT}`)
})
