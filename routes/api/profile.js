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

// === LỖ HỔNG CSRF DEMO - Endpoint không bảo vệ (GET method) ===
// CHỈ BẬT KHI DEMO LỖ HỔNG (CSRF_PROTECTION=false)
// KHI CSRF_PROTECTION=true, endpoint này nên bị vô hiệu hóa
router.get("/update-bio", async (req, res) => {
  // Kiểm tra xem có đang ở chế độ demo lỗ hổng không
  if (process.env.CSRF_PROTECTION === "true") {
    return res.status(403).json({
      error: "Endpoint này đã bị vô hiệu hóa",
      message:
        "Endpoint GET không an toàn đã bị tắt khi CSRF protection được bật. Sử dụng POST /update-bio-secure thay thế.",
    });
  }

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

// === ENDPOINT BẢO VỆ BẰNG CSRF TOKEN (POST method) ===
router.post("/update-bio-secure", async (req, res) => {
  try {
    // 1. Kiểm tra CSRF token
    const token = req.headers["x-csrf-token"] || req.headers["x-xsrf-token"];

    if (!token || token !== req.session.csrfToken) {
      return res.status(403).json({
        error: "Invalid CSRF token",
        message:
          "Request bị từ chối vì thiếu hoặc sai CSRF token. Đây là cách phòng chống CSRF attack!",
      });
    }

    // 2. Validate input
    const { bio } = req.body;
    if (!bio || bio.trim().length === 0) {
      return res.status(400).json({ error: "Bio không được để trống" });
    }

    if (bio.length > 500) {
      return res
        .status(400)
        .json({ error: "Bio không được vượt quá 500 ký tự" });
    }

    // 3. Update bio
    const user = await User.findByIdAndUpdate(
      req.session.userId,
      { bio: bio.trim() },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      message: "Cập nhật bio thành công với CSRF protection!",
      user,
    });
  } catch (err) {
    console.error("Error updating bio:", err);
    res.status(500).json({ error: "Server error" });
  }
});
// === KẾT THÚC ENDPOINT BẢO VỆ ===

module.exports = router;
