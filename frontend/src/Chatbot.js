import React, { useState } from "react";
import "./Chatbot.css";

export default function Chatbot({ user }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [file, setFile] = useState(null);

  const askAI = async () => {
    try {
      const formData = new FormData();
      formData.append("user_id", user.uid || "guest");
      formData.append("question", question);
      if (file) {
        formData.append("file", file);
      }

      const res = await fetch(
        "https://89506339-2611-4f47-b987-be6c77e38cec-00-epual7n79g7.pike.replit.dev/ask_ai",
        {
          method: "POST",
          body: formData,
        },
      );

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      console.log("AI Response Data:", data);

      if (data.error) {
        setAnswer(`Error from AI: ${data.error.message || "Unknown error"}`);
      } else {
        setAnswer(data.choices?.[0]?.message?.content || "No answer");
      }
    } catch (error) {
      console.error("AI request failed:", error);
      setAnswer(`Request failed: ${error.message}`);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="container">
      <div className="header">
        <div className="avatar">{user.displayName?.[0] || user.email?.[0]}</div>
        <div className="welcome">Welcome, {user.displayName || user.email}</div>
      </div>

      <div className="chat">
        {question && <div className="userMsg">{question}</div>}
        {answer && <div className="botMsg">{answer}</div>}
      </div>

      <div className="inputArea">
        <input
          id="hiddenFileInput"
          type="file"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <button
          type="button"
          className="button"
          onClick={() => document.getElementById("hiddenFileInput").click()}
        >
          📁 Choose File
        </button>

        {file && <span className="fileName">{file.name}</span>}

        <input
          className="input"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Your question"
        />

        <button
          className="button"
          onClick={askAI}
          disabled={!question && !file}
        >
          Ask
        </button>
      </div>
    </div>
  );
}
