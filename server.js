// server.js (PHIÊN BẢN ĐÃ SỬA)

const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const moment = require("moment");
const path = require("path");
const cors = require("cors");

// Import middleware và routes
// Giả định 'auth' chứa csrfProtection, 'apiAuth' chứa apiAuth
const { csrfProtection } = require("./middleware/auth");
const authApiRoutes = require("./routes/api/auth");
const reviewApiRoutes = require("./routes/api/reviews");
const profileApiRoutes = require("./routes/api/profile");
const moviesRouter = require("./routes/api/movie");
const { apiAuth } = require("./middleware/apiAuth"); // Import apiAuth tại đây

const port = 3000;
const app = express();

const { connectDB } = require("./config/database");

// Import models
const User = require("./models/User");
const Review = require("./models/Review");
const Movie = require("./models/Movie");

// View engine setup
app.set("views", "./templates");
app.set("view engine", "ejs");

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
      ];
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
    exposedHeaders: ["set-cookie"],
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "client/dist")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);
app.use(flash());

// Skip CSRF cho API (Giữ nguyên)
app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return next();
  }
  csrfProtection(req, res, next);
});

// Global variables (Giữ nguyên)
app.use((req, res, next) => {
  res.locals.user = req.session.userId
    ? {
        id: req.session.userId,
        username: req.session.username,
      }
    : null;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.moment = moment;
  next();
});

// === SỬA LẠI API ROUTES ===
const apiRouter = express.Router();

// 1. Các route CÔNG KHAI (public) đặt TRƯỚC
apiRouter.use("/auth", authApiRoutes);

// 2. Các route RIÊNG TƯ (private) đặt SAU
//    Áp dụng middleware apiAuth TRỰC TIẾP
apiRouter.use("/profile", apiAuth, profileApiRoutes);
apiRouter.use("/reviews", apiAuth, reviewApiRoutes);
apiRouter.use("/movies", apiAuth, moviesRouter);

// Mount API router
app.use("/api", apiRouter);

// === KHÔNG CẦN 404 HANDLER TÙY CHỈNH NỮA ===
// (Xóa bỏ nó đi, nó đang che giấu lỗi 401)
// apiRouter.use((req, res) => {
//   res.status(404).json({ error: "API endpoint not found" });
// });

// Serve React App (Giữ nguyên)
// Handler này phải ở GẦN CUỐI, sau tất cả các routes khác
app.get("*", (req, res) => {
  // Đảm bảo không bắt các request API chưa được xử lý
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  res.sendFile(path.join(__dirname, "client/dist/index.html"));
});

// Sửa lại logic khởi động server
if (require.main === module) {
  // 1. Kết nối DB (sử dụng URL mặc định từ config/database.js)
  connectDB()
    .then(() => {
      // 2. Chỉ khởi động server SAU KHI kết nối thành công
      app.listen(port, () =>
        console.log(`The server is listening at http://localhost:${port}`)
      );
    })
    .catch((err) => {
      console.error("Failed to connect to MongoDB, server not started.", err);
      process.exit(1);
    });
}

module.exports = { app };
