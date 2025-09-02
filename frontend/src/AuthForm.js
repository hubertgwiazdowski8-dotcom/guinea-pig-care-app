import React, { useState } from "react";
import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import './AuthForm.css';

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Zalogowano!");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Zarejestrowano!");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      alert("Zalogowano przez Google!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="inputs">
      <h2>Log in to your accont!</h2>
      <form>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <div className="log-field">
        <button className="log-button" onClick={handleLogin}>Login</button>
        <button className="log-button" onClick={handleRegister}>Register</button>
        </div>
      </form>
      <div className="log-field"><button onClick={handleGoogle}>Register by Google</button></div>
    </div>
  );
}