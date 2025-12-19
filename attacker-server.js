// attacker-server.js - Simple HTTP server để host trang attacker
const express = require("express");
const path = require("path");
const app = express();
const PORT = 8080;

// Serve static files
app.use(express.static(__dirname));

// Route chính - trang attacker
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "attacker.html"));
});

// Route cho dashboard
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "csrf-demo-dashboard.html"));
});

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.listen(PORT, () => {
  console.log("═══════════════════════════════════════════════════");
  console.log("🔥 CSRF ATTACK SERVER STARTED");
  console.log("═══════════════════════════════════════════════════");
  console.log(`📡 Attacker Page: http://localhost:${PORT}`);
  console.log(`📊 Dashboard:     http://localhost:${PORT}/dashboard`);
  console.log("═══════════════════════════════════════════════════");
  console.log("");
  console.log("1. Đảm bảo app chính đang chạy: http://localhost:3000");
  console.log("2. Đăng nhập vào app: http://localhost:5173");
  console.log(`3. Mở trang attacker: http://localhost:${PORT}`);
  console.log("4. Bio sẽ tự động bị thay đổi!");
  console.log("═══════════════════════════════════════════════════");
});
