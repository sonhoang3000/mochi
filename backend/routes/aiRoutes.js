// backend/routes/aiRoutes.js
import express from "express";
import { askAI } from "../controllers/aiController.js";

const router = express.Router();

router.post("/ask", askAI);


router.post("/check-fake-news", async (req, res) => {
  try {
    const { text } = req.body;
    console.log("📤 Gửi request đến AI:", text); // Log nội dung gửi đi

    const response = await axios.post("http://localhost:5000/predict", { text });

    console.log("📥 Kết quả nhận được từ AI:", response.data); // Log phản hồi từ AI

    res.json(response.data);
  } catch (error) {
    console.error("🚨 Lỗi kết nối đến AI:", error.message);
    res.status(500).json({ error: "Không thể kết nối đến dịch vụ AI" });
  }
});


export default router;
