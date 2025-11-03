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
router.put("/", async (req, res) => {
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
router.get("/update-bio", async (req, res) => {
  try {
    const newBio = req.query.bio || "Đã bị hack!";
    const user = await User.findByIdAndUpdate(
      req.session.userId,
      { bio: newBio },
      { new: true }
    );
    res.send(
      `<h1>Cập nhật thành công!</h1><p>Bio mới của bạn là: ${user.bio}</p>`
    );
  } catch (err) {
    res.status(500).send("Lỗi server");
  }
});
// === KẾT THÚC LỖ HỔNG ===

module.exports = router;
