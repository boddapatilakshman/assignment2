// src/components/Login.jsx
// src/components/Login.jsx
import "./styles.css"; // Assuming styles.css is in src
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(""); // Clear previous error
  
    try {
      const response = await axios.post("https://reqres.in/api/login", {
        email,
        password,
      });
  
      console.log("Login Response:", response.data);
  
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/users");
      } else {
        setError("Login failed. No token received.");
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error || "Login failed");
      } else if (error.request) {
        setError("No response from server");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };
  
  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
