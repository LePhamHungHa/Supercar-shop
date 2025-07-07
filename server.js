const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const { result } = require("lodash");
const { error } = require("console");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Kết nối MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1132003",
  database: "supercar_db"
});

db.connect(err => {
  if (err) {
    console.error("Lỗi kết nối MySQL:", err.message);
  } else {
    console.log("Đã kết nối MySQL thành công");
  }
});
// {Đăng nhập và đăng ký}
// Đăng nhập
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.query("SELECT * FROM accounts WHERE username = ?", [username], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: "username không tồn tại" });
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Sai mật khẩu" });
    }

    // (Tùy chọn) tạo token
    const token = jwt.sign({ id: user.id, username: user.username }, "secret_key", { expiresIn: "1h" });

    res.json({ message: "Đăng nhập thành công", token, username: user.username });
  });
});
// Đăng ký
app.post("/register", async (req, res) => {
  const { full_name, username, email, password, avatar_url } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO accounts (full_name, username, email, password_hash, avatar_url)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(query, [full_name, username, email, hash, avatar_url || null], (err, result) => {
      if (err) {
        console.error("Lỗi đăng ký:", err);
        return res.status(500).json({ error: "Lỗi đăng ký tài khoản" });
      }
      res.status(201).json({ message: "Đăng ký thành công!" });
    });
  } catch (error) {
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
});


// {Lấy danh sách siêu xe} 

//API: Lamborghini
app.get("/supercars", (req, res) => {
  const query = "SELECT * FROM supercars";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn supercars:", err.message);
      return res.status(500).json({ error: "Lỗi truy vấn siêu xe" });
    }
    console.log("[API] /supercars trả về:", results.length, "xe");
    res.json(results);
  });
});

//API: Lấy danh sách xe Nissan
app.get("/nissan-models", (req, res) => {
  const query = "SELECT * FROM nissan_models";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn Nissan:", err.message);
      return res.status(500).json({ error: "Lỗi truy vấn Nissan" });
    }
    console.log("[API] /nissan-models trả về:", results.length, "xe");
    res.json(results);
  });
});

//API: Lấy danh sách xe Dodge
app.get("/dodge-models", (req, res) => {
  const query = "SELECT * FROM dodge_models";
  db.query(query, (err, result) => {
    if (err) {
      console.error("Lỗi truy vấn Dodge:", err.message);
      return res.status(500).json({ error: "Lỗi truy vấn Dodge" });
    }
    console.log("[API] /dodge-models trả về:", result.length, "xe");
    res.json(result);
  });
});

//API: Lấy danh sách xe Mustaang
app.get("/mustang-models", (req, res) => {
  const query = "SELECT * FROM mustang_models";
  db.query(query, (err, result) => {
    if (err) {
      console.error("Lỗi truy vấn Mustang:", err.message);
      return res.status(500).json({ error: "Lỗi truy vấn Mustang" });
    }
    console.log("[API] /mustang-models trả về:", result.length, "xe");
    res.json(result);
  });
});

// ✅ Khởi động server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server backend đang chạy tại http://localhost:${PORT}`);
});
