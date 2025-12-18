// middleware/apiAuth.js (PHIÊN BẢN ĐÚNG)

function apiAuth(req, res, next) {
  // Dùng cú pháp an toàn ?. để kiểm tra req.session và req.session.userId
  if (req.session?.userId) {
    // 1. Đã đăng nhập: Cho phép đi tiếp
    return next();
  }

  // 2. CHƯA ĐĂNG NHẬP:
  // Chủ động trả về lỗi 401 mà test (dòng 146) đang mong đợi
  res.status(401).json({ error: "Unauthorized" });
}

// Export middleware
module.exports = { apiAuth };
