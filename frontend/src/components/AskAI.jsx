import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaRobot, FaUser } from "react-icons/fa";

const AskAI = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const handleAskAI = async () => {
    if (!prompt.trim()) return;

    const newUserMsg = { sender: "user", text: prompt };
    setMessages((prev) => [...prev, newUserMsg]);
    setPrompt("");

    try {
      const res = await axios.post("http://localhost:8000/api/v1/ai/ask", {
        prompt,
      });

      const newAiMsg = {
        sender: "ai",
        text: res.data.message || "AI không có phản hồi.",
      };
      setMessages((prev) => [...prev, newAiMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg = { sender: "ai", text: " Đã có lỗi khi kết nối AI òi" };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAskAI();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>🤖 Trợ Lý Mochi nèe</h2>

      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.messageContainer,
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
            }}
          >
            {msg.sender === "ai" && (
              <div style={styles.avatar}>
                <FaRobot color="#e91e63" />
              </div>
            )}

            <div
              style={{
                ...styles.bubble,
                backgroundColor: msg.sender === "user" ? "#e91e63" : "#f1f1f1",
                color: msg.sender === "user" ? "#fff" : "#333",
              }}
            >
              {msg.text}
            </div>

            {msg.sender === "user" && (
              <div style={styles.avatar}>
                <FaUser color="#e91e63" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <textarea
        placeholder="Bạn hỏi Mochi đáp..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={3}
        style={styles.textarea}
      />

      <button style={styles.button} onClick={handleAskAI}>
        Gửi câu hỏi
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: 24,
    width: "900px",          
    margin: "0 auto",
    marginTop: 30,
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 24,
    color: "#e91e63",
  },
  chatBox: {
    height: "500px",  
    // width: "500px",          
    overflowY: "auto",            
    marginBottom: 16,
    padding: 10,
    border: "1px solid #ddd",
    borderRadius: 10,
    background: "#fafafa",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    
  },  
  messageContainer: {
    display: "flex",
    alignItems: "flex-end",
    marginBottom: 10,
    gap: 8,
  },
  avatar: {
    fontSize: 20,
  },
  bubble: {
    maxWidth: "70%",
    padding: "10px 14px",
    borderRadius: 16,
    lineHeight: 1.5,
    whiteSpace: "pre-wrap",
  },
  textarea: {
    width: "100%",
    borderRadius: 10,
    padding: 12,
    border: "1px solid #ccc",
    fontSize: 16,
    marginBottom: 10,
    resize: "none",
  },
  button: {
    width: "100%",
    backgroundColor: "#e91e63",
    color: "#fff",
    border: "none",
    padding: "12px 16px",
    borderRadius: 10,
    fontSize: 16,
    cursor: "pointer",
  },
};

export default AskAI;
