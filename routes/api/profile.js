const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const { apiAuth } = require("../../middleware/apiAuth");

// Get user profile
router.get("/", async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update user profile
// Fix 3: Yêu cầu X-CSRF-Token cho các request thay đổi dữ liệu
function requireCsrfToken(req, res, next) {
  const token = req.headers["x-csrf-token"];
  if (!token || token !== req.session.csrfToken) {
    return res.status(403).json({ error: "Invalid or missing CSRF token" });
  }
  next();
}

// Fix 1: Chỉ cho phép PUT để cập nhật dữ liệu
router.put("/", requireCsrfToken, async (req, res) => {
  try {
    const { username, email, bio } = req.body;

    // Check if username or email is already taken
    const existingUser = await User.findOne({
      $and: [
        { _id: { $ne: req.session.userId } },
        { $or: [{ username }, { email }] },
      ],
    });

    if (existingUser) {
      return res.status(400).json({ error: "Username or email already taken" });
    }

    const user = await User.findByIdAndUpdate(
      req.session.userId,
      { username, email, bio },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update session
    req.session.username = user.username;

    res.json(user);
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// === LỖ HỔNG CSRF DEMO ===
// Đã loại bỏ GET thay đổi dữ liệu (Fix 1)
// === KẾT THÚC LỖ HỔNG ===

module.exports = router;
