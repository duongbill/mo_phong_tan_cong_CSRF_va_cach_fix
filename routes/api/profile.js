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
  const isProtected = String(process.env.CSRF_PROTECTION).trim().toLowerCase() === "true";
  console.log(`[DEBUG] GET /api/profile/update-bio | User: ${req.session.userId} | Protected: ${isProtected}`);

  if (isProtected) {
    console.log("[DEBUG] Blocked GET attack due to CSRF_PROTECTION=true");
    return res.redirect("/security-alert.html");
  }

  console.log("[DEBUG] Protection is OFF. Proceeding with vulnerable update.");

  try {
    const newBio = req.query.bio || "Đã bị hack!";
    console.log(`[DEBUG] Executing vulnerable DB update for user ${req.session.userId} | Bio: ${newBio}`);
    await User.findByIdAndUpdate(req.session.userId, { bio: newBio });
    
    console.log("[DEBUG] Vulnerable update success. Redirecting to Red Page.");
    return res.redirect("/attack-success.html");
  } catch (err) {
    res.status(500).send("Lỗi server");
  }
});
// === KẾT THÚC LỖ HỔNG ===

// === ENDPOINT BẢO VỆ BẰNG CSRF TOKEN (POST method) ===
router.post("/update-bio-secure", async (req, res) => {
  try {
    const isProtected = String(process.env.CSRF_PROTECTION).trim().toLowerCase() === "true";
    const token = req.headers["x-csrf-token"] || req.headers["x-xsrf-token"] || req.body.csrf_token;
    
    console.log(`[DEBUG] POST /update-bio-secure | Protected: ${isProtected} | Token: ${token ? "Present" : "Missing"}`);

    if (isProtected) {
      if (!token || token !== req.session.csrfToken) {
        console.log("[DEBUG] Token invalid in PROTECTED mode. Redirecting to Green Page.");
        return res.redirect("/security-alert.html");
      }
      console.log("[DEBUG] Token VALID in PROTECTED mode.");
    } else {
      console.log("[DEBUG] System in VULNERABLE mode. Skipping CSRF check.");
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

    // Nếu không có token gửi lên (đang demo bị hack) thì redirect sang trang Red Page
    if (!isProtected && (!token || token !== req.session.csrfToken)) {
       console.log("[DEBUG] Secure endpoint exploited in vulnerable mode. Redirecting to Red Page.");
       return res.redirect("/attack-success.html");
    }

    res.json({
      success: true,
      message: "Cập nhật bio thành công!",
      user,
    });
  } catch (err) {
    console.error("Error updating bio:", err);
    res.status(500).json({ error: "Server error" });
  }
});
// === KẾT THÚC ENDPOINT BẢO VỆ ===

module.exports = router;
