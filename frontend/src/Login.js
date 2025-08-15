import React, { useState } from "react";
import {
  auth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from "./firebase";
import "./Login.css";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginWithEmail = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      onLogin(result.user);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const registerWithEmail = async () => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      onLogin(result.user);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
    onLogin(null);
  };

  return (
    <div className="container">
      <div className="formBox">
        <div className="logo">🔑</div>
        <h2 className="title">Login to DocAI By Francleena </h2>
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="button" onClick={loginWithEmail}>
          Login
        </button>
        <button
          className="button"
          onClick={registerWithEmail}
          style={{ marginTop: "10px" }}
        >
          Register
        </button>
        <button
          className="button"
          onClick={logout}
          style={{ marginTop: "10px", background: "#dc2626" }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
