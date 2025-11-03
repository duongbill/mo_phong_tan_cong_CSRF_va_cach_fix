const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const bcrypt = require("bcryptjs");

// Check authentication status
router.get("/me", async (req, res) => {
  if (req.session.userId) {
    // Trả về thông tin user đầy đủ
    const user = await User.findById(req.session.userId).select("-password");
    if (user) {
      return res.json({ user });
    }
  }
  res.json({ user: null });
});

// Fix 3: Yêu cầu X-CSRF-Token cho các request thay đổi dữ liệu
function requireCsrfToken(req, res, next) {
  const token = req.headers["x-csrf-token"];
  if (!token || token !== req.session.csrfToken) {
    return res.status(403).json({ error: "Invalid or missing CSRF token" });
  }
  next();
}

// Login
router.post("/login", requireCsrfToken, async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    req.session.userId = user._id;
    req.session.username = user.username;

    res.json({
      message: "Logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Register
router.post("/register", requireCsrfToken, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check for required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    req.session.userId = user._id;
    req.session.username = user.username;

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    // Handle validation errors
    if (err.name === "ValidationError") {
      return res.status(400).json({
        error: Object.values(err.errors)
          .map((e) => e.message)
          .join(", "),
      });
    }
    res.status(500).json({ error: "Server error" });
  }
});

// Logout
router.post("/logout", requireCsrfToken, (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
