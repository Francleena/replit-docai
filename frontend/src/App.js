import React, { useState } from "react";
import Login from "./Login";
import FileUpload from "./FileUpload";
import Chat from "./Chat";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);

  return (
    <div className="app-container">
      {!user ? (
        <Login onLogin={setUser} />
      ) : (
        <div className="content">
          <h1>AI File Chat</h1>
          <p>Welcome, {user.displayName || user.email}</p>
          {!fileUrl ? (
            <FileUpload onFileUploaded={setFileUrl} />
          ) : (
            <Chat fileUrl={fileUrl} />
          )}
        </div>
      )}
    </div>
  );
}
