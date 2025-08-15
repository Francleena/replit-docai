import React, { useState } from "react";
import { fetchAIResponse } from "./utils";
import "./Chatbot.css";

export default function Chat({ fileUrl }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const aiResponse = await fetchAIResponse(fileUrl, input);
      setMessages((prev) => [...prev, { sender: "ai", text: aiResponse }]);
    } catch (error) {
      console.error("AI request failed:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "❌ Error contacting AI." },
      ]);
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Chat with DocAI By Francleena</h3>
      <p style={{ fontSize: "12px", color: "#666" }}>
        File loaded from:{" "}
        <a href={fileUrl} target="_blank" rel="noreferrer">
          {fileUrl}
        </a>
      </p>

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "10px",
          height: "200px",
          overflowY: "auto",
          marginBottom: "10px",
          backgroundColor: "#f9f9f9",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {messages.map((msg, i) => (
          <p
            key={i}
            style={{
              margin: "5px 0",
              color: msg.sender === "user" ? "#333" : "#007BFF",
              fontWeight: msg.sender === "user" ? "normal" : "bold",
            }}
          >
            <b>{msg.sender}:</b> {msg.text}
          </p>
        ))}
      </div>

      <div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          style={{
            marginRight: "10px",
            width: "70%",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#007BFF")}
        >
          Send
        </button>
      </div>
    </div>
  );
}
