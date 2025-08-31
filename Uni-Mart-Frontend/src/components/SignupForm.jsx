import { useState } from "react";
import '../styles/styles.css';


export default function SignupForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("http://localhost:8000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    alert(res.ok ? "Signup successful!" : data.detail || "Error");
  }

  return (
    <div className="auth-card-container">
      <div className="auth-card">
        <h2>Sign Up</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}
