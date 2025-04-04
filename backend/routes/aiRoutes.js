import axios from "axios";
import express from "express";
import { askAI } from "../controllers/aiController.js";

const router = express.Router();

router.post("/ask", askAI);


router.post("/fakenew", async (req, res) => {
  try {
    const { text } = req.body;
    console.log(" Gửi request đến AI:", text); // Log nội dung gửi đi

    const response = await axios.post("http://localhost:5001/predict", { text });

    console.log("Kết quả nhận được từ AI:", response.data); // Log phản hồi từ AI

    res.json(response.data);
  } catch (error) {
    console.error(" Lỗi kết nối đến AI:", error.message);
    res.status(500).json({ error: "Không thể kết nối đến dịch vụ AI" });
  }
});


router.post("/predict-spam", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    // Gửi request đến FastAPI (Python)
    const response = await axios.post("http://127.0.0.1:5002/spam/", { text });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("🚨 Lỗi khi gọi API Spam:", error?.response?.data || error.message);
    res.status(500).json({ error: "Spam detection service error." });
  }
});

export default router;
