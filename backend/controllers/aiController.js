// backend/controllers/aiController.js
import axios from "axios";

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
          Authorization: `Bearer earer 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`,
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

    const response = await axios.post("http://localhost:5001/predict", { text });
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error connecting to Fake News AI:", error.message);
    res.status(500).json({ error: "Fake News detection service error." });
  }
};
