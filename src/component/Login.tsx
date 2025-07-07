import React, { useState } from "react";
import axios from "axios";
import "../style/auth.css";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/login", form);
      alert("Đăng nhập thành công!");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      window.dispatchEvent(new Event("storage"));
      navigate("/");
    } catch (err: any) {
      alert(err.response?.data?.error || "Lỗi đăng nhập");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-box" onSubmit={handleSubmit}>
        <h2>Sign in</h2>
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit">Login</button>
        <p>
          Don't have an account? <Link to="/register">Đăng ký</Link>
        </p>
      </form>
    </div>
  );
}
