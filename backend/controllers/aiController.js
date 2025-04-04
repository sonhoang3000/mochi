<<<<<<< HEAD
import axios from "axios";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
=======
// backend/controllers/aiController.js
import axios from "axios";
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea

export const askAI = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
<<<<<<< HEAD
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
=======
          Authorization: `Bearer earer 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`,
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
          "Content-Type": "application/json",
          "HTTP-Referer": "https://mochi-ai.local",
          "X-Title": "mochi-ai",
        },
      }
    );

    const aiMessage = response.data.choices[0].message.content;
    res.status(200).json({ message: aiMessage });
  } catch (error) {
    console.error("AI Error:", error?.response?.data || error.message);
    res
      .status(500)
      .json({ error: error?.response?.data || "AI service error." });
  }
};

export const predictFakeNews = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

<<<<<<< HEAD
    const response = await axios.post("http://localhost:5001/predict", { text });
=======
    const response = await axios.post("http://localhost:5000/predict", { text });
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error connecting to Fake News AI:", error.message);
    res.status(500).json({ error: "Fake News detection service error." });
  }
};
<<<<<<< HEAD


export const predictSpam = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    // Gọi script Python
    const scriptPath = path.join(__dirname, "..", "spam_detection", "app.py");
    const pythonProcess = spawn("python", [scriptPath, text]);
        let result = "";

    pythonProcess.stdout.on("data", (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error("Spam Detection Error:", data.toString());
    });

    pythonProcess.on("close", () => {
      try {
        const parsedResult = JSON.parse(result);
        res.status(200).json({ result: parsedResult.result });
      } catch (err) {
        console.error("JSON Parsing Error:", err.message);
        res.status(500).json({ error: "Invalid response from Python script." });
      }
    });
    
  } catch (error) {
    console.error("Error running spam detection:", error.message);
    res.status(500).json({ error: "Spam detection service error." });
  }
};
=======
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
