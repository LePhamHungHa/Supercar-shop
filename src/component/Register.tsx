import React, { useState } from "react";
import axios from "axios";
import "../style/auth.css";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
    avatar_url:"",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/register", form);
      alert("Đăng ký thành công!");
      navigate("/login");
    } catch (err: any) {
      alert(err.response?.data?.error || "Lỗi đăng ký");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-box" onSubmit={handleSubmit}>
        <h2>Đăng ký</h2>
        <input
          type="text"
          placeholder="Họ tên"
          required
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Tài khoản"
          required
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <input
          type="avatar_url"
          placeholder="Ảnh đại diện"
          required
          value={form.avatar_url}
          onChange={(e) => setForm({ ...form, avatar_url: e.target.value })}
        />
        <button type="submit">Đăng ký</button>
        <p>Đã có tài khoản? <a href="/login" style={{ color: "#ffb6c1" }}>Đăng nhập</a></p>
      </form>
    </div>
  );
}
