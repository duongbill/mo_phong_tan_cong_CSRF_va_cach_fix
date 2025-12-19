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

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Login attempt:", { username });
    const user = await User.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.isValid = true; // Thêm flag này

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
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("Registration attempt:", { username, email });

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
      const field = existingUser.username === username ? "Tên người dùng" : "Email";
      return res.status(400).json({ error: `${field} đã tồn tại` });
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.isValid = true;

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
      const messages = Object.values(err.errors).map((e) => e.message);
      console.log("Validation errors:", messages);
      return res.status(400).json({
        error: messages.join(", "),
      });
    }
    res.status(500).json({ error: "Server error" });
  }
});

// Logout
router.post("/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
