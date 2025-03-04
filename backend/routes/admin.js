import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from 'mongoose';
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";

const router = express.Router();
const SECRET_KEY = "your_secret_key";

router.post("/admin/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await User.findOne({ username, role: "admin" });
        if (!admin) return res.status(404).json({ error: "Admin không tồn tại" });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ error: "Mật khẩu không đúng" });

        const token = jwt.sign({ id: admin._id, username: admin.username }, SECRET_KEY, { expiresIn: "1h" });
        res.json({ token });
    } catch (err) {
        console.error("Error during admin login:", err);
        res.status(500).json({ error: "Lỗi server" });
    }
});

// Middleware để xác thực admin
const authenticateAdmin = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) return res.status(401).json({ error: "Không có quyền truy cập" });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.admin = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: "Token không hợp lệ" });
    }
};

router.get("/admin/profile", authenticateAdmin, async (req, res) => {
    try {
        const admin = await User.findById(req.admin.id).select("-password");
        res.json(admin);
    } catch (err) {
        console.error("Error fetching admin profile:", err);
        res.status(500).json({ error: "Lỗi server" });
    }
});

// Lấy danh sách người dùng
router.get("/users", async (req, res) => {
    try {
        const { search = "", status, page = 1, limit = 10 } = req.query;

        let query = {};

        if (search.trim()) {
            query.$or = [
                { username: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];

            if (mongoose.Types.ObjectId.isValid(search)) {
                query.$or.push({ _id: search });
            }
        }

        if (status) {
            query.isOnline = status.toLowerCase() === "online";
        }

        const users = await User.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalUsers = await User.countDocuments(query);

        res.json({ users, totalPages: Math.ceil(totalUsers / limit) });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: `Lỗi server: ${err.message}` });
    }
});

// Xóa người dùng
router.delete("/users/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "Người dùng không tồn tại" });
        }
        res.json({ message: "Người dùng đã bị xóa" });
    } catch (err) {
        res.status(500).json({ error: "Lỗi server" });
    }
});

// Lấy danh sách bài viết với tìm kiếm
router.get("/posts", async (req, res) => {
    try {
        const { search = "" } = req.query;

        let query = {};

        if (search.trim()) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } },
                { caption: { $regex: search, $options: "i" } }
            ];
        }

        const posts = await Post.find(query).populate("author", "username");
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: "Lỗi server" });
    }
});


// Xóa bài viết
router.delete("/posts/:id", async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: "Bài viết đã bị xóa" });
    } catch (err) {
        res.status(500).json({ error: "Lỗi server" });
    }
});

router.get("/dashboard", async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalPosts = await Post.countDocuments();
        const onlineUsers = await User.countDocuments({ isOnline: true });
        res.json({
            totalUsers,
            totalPosts,
            onlineUsers,
        });
    } catch (err) {
        console.error("Error fetching dashboard data:", err);
        res.status(500).json({ error: "Lỗi server" });
    }
});

export default router;