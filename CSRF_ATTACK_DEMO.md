# Demo Tấn Công CSRF (Cross-Site Request Forgery)

## 📋 Mục Đích

File này hướng dẫn cách demo lỗ hổng CSRF và cách phòng chống trong ứng dụng web.

## 🎯 Kịch Bản Tấn Công

### Bước 1: Chuẩn Bị

1. **Khởi động server**: `npm start` (cổng 3000)
2. **Khởi động client**: `cd client && npm run dev` (cổng 5173)
3. **Đăng nhập vào ứng dụng** tại `http://localhost:5173`

### Bước 2: Thực Hiện Tấn Công

1. **Mở file tấn công**: Mở file `attacker.html` trong trình duyệt

   - Cách 1: Double-click vào file `attacker.html`
   - Cách 2: Mở trực tiếp: `file:///path/to/attacker.html`

2. **Quan sát hành vi**:

   - Trang web giả mạo hiển thị thông báo "Trúng thưởng"
   - Thẻ `<img>` ẩn tự động gửi request đến server
   - Request tự động đính kèm cookie phiên của user

3. **Kiểm tra kết quả**:
   - Quay lại ứng dụng chính tại `http://localhost:5173`
   - Vào trang Profile
   - Bio đã bị thay đổi thành: "Tài khoản này đã bị tấn công CSRF 🔥 Hacked by Attacker"

## 🔍 Phân Tích Lỗ Hổng

### Endpoint Dễ Bị Tấn Công

```javascript
// routes/api/profile.js
router.get("/update-bio", async (req, res) => {
  try {
    const newBio = req.query.bio || "Đã bị hack!";
    const user = await User.findByIdAndUpdate(
      req.session.userId,
      { bio: newBio },
      { new: true }
    );
    res.send(`<h1>Cập nhật thành công!</h1><p>Bio mới: ${user.bio}</p>`);
  } catch (err) {
    res.status(500).send("Lỗi server");
  }
});
```

### Payload Tấn Công

```html
<img
  src="http://localhost:3000/api/profile/update-bio?bio=Tài+khoản+này+đã+bị+tấn+công+CSRF"
  style="display: none;"
  alt="tracking-pixel"
/>
```

### Tại Sao Lỗ Hổng Xảy Ra?

1. **Sử dụng GET request cho thay đổi dữ liệu**:

   - GET nên chỉ dùng cho đọc dữ liệu
   - Trình duyệt tự động gửi GET qua thẻ `<img>`, `<script>`, `<link>`

2. **Không có CSRF token validation**:

   - Server không kiểm tra request có đến từ ứng dụng chính hay không

3. **Tự động gửi cookie**:

   - Trình duyệt tự động đính kèm cookie phiên trong mọi request đến cùng domain

4. **Không kiểm tra Origin/Referer**:
   - Server không xác minh nguồn gốc của request

## 🛡️ Cách Phòng Chống

### 1. Sử dụng Đúng HTTP Method

```javascript
// ❌ SAI - Dùng GET cho thay đổi dữ liệu
router.get("/update-bio", async (req, res) => {
  const newBio = req.query.bio;
  await User.findByIdAndUpdate(userId, { bio: newBio });
});

// ✅ ĐÚNG - Dùng POST/PUT cho thay đổi dữ liệu
router.put("/update-bio", async (req, res) => {
  const newBio = req.body.bio;
  await User.findByIdAndUpdate(userId, { bio: newBio });
});
```

### 2. Implement CSRF Token

```javascript
// server.js - Thêm CSRF middleware
const csrf = require("csurf");
const csrfProtection = csrf({ cookie: true });

// Áp dụng CSRF cho các route cần bảo vệ
app.use("/api", csrfProtection);

// Client - Gửi token trong header
const csrfToken = getCsrfToken(); // Lấy từ cookie hoặc meta tag
axios.post(
  "/api/profile/update-bio",
  { bio },
  {
    headers: { "X-CSRF-Token": csrfToken },
  }
);
```

### 3. SameSite Cookie Attribute

```javascript
// server.js
app.use(
  session({
    secret: "my-secret-key",
    cookie: {
      sameSite: "strict", // hoặc 'lax'
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  })
);
```

### 4. Kiểm Tra Origin/Referer Header

```javascript
// middleware/csrfCheck.js
function checkOrigin(req, res, next) {
  const origin = req.headers.origin || req.headers.referer;
  const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];

  if (
    !origin ||
    !allowedOrigins.some((allowed) => origin.startsWith(allowed))
  ) {
    return res.status(403).json({ error: "Forbidden - Invalid origin" });
  }
  next();
}
```

### 5. Yêu Cầu Xác Nhận Lại Password

```javascript
router.put("/update-sensitive-data", async (req, res) => {
  const { password, newData } = req.body;

  // Xác minh password
  const user = await User.findById(req.session.userId);
  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return res.status(401).json({ error: "Invalid password" });
  }

  // Thực hiện cập nhật
  await User.findByIdAndUpdate(user._id, newData);
  res.json({ success: true });
});
```

## 🔧 Fix Lỗ Hổng Trong Code Hiện Tại

### Cách 1: Xóa Endpoint Dễ Bị Tấn Công (Khuyến nghị)

```javascript
// routes/api/profile.js
// XÓA hoặc comment đoạn này:
// router.get("/update-bio", async (req, res) => { ... });
```

### Cách 2: Chuyển Sang POST + Thêm CSRF Protection

```javascript
// routes/api/profile.js
const { csrfProtection } = require("../../middleware/auth");

router.post("/update-bio", csrfProtection, async (req, res) => {
  try {
    const newBio = req.body.bio; // Lấy từ body thay vì query

    if (!newBio || newBio.trim().length === 0) {
      return res.status(400).json({ error: "Bio không được để trống" });
    }

    const user = await User.findByIdAndUpdate(
      req.session.userId,
      { bio: newBio },
      { new: true }
    ).select("-password");

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
});
```

### Cách 3: Thêm Rate Limiting

```javascript
// middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

const profileUpdateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 5, // Tối đa 5 request
  message: 'Quá nhiều request, vui lòng thử lại sau'
});

// Áp dụng
router.put("/", profileUpdateLimiter, async (req, res) => { ... });
```

## 📊 So Sánh Trước và Sau Fix

| Tiêu Chí        | Trước Fix           | Sau Fix             |
| --------------- | ------------------- | ------------------- |
| HTTP Method     | GET (không an toàn) | POST/PUT (an toàn)  |
| CSRF Token      | Không có            | Có validation       |
| SameSite Cookie | lax/none            | strict              |
| Origin Check    | Không kiểm tra      | Kiểm tra strict     |
| Rate Limiting   | Không có            | Có giới hạn request |

## 🧪 Test Cases

### Test 1: Tấn Công CSRF Thất Bại (Sau khi fix)

```bash
# Thử gửi GET request từ domain khác
curl -X GET "http://localhost:3000/api/profile/update-bio?bio=Hacked" \
     -H "Cookie: session=abc123"
# Kỳ vọng: 403 Forbidden hoặc 404 Not Found
```

### Test 2: Update Hợp Lệ Từ Client

```javascript
// client/src/services/api.js
export const updateBio = async (bio) => {
  const csrfToken = getCsrfToken();
  const response = await api.put(
    "/profile",
    { bio },
    { headers: { "X-CSRF-Token": csrfToken } }
  );
  return response.data;
};
```

## 📚 Tài Liệu Tham Khảo

- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [MDN: SameSite Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
- [Express CSRF Protection](https://github.com/expressjs/csurf)

## ⚠️ Lưu Ý Quan Trọng

1. **Không deploy endpoint dễ bị tấn công lên production**
2. **Luôn validate input từ user**
3. **Implement logging để phát hiện tấn công**
4. **Giáo dục user về phishing và social engineering**
5. **Kiểm tra security regular với các tool như OWASP ZAP**

## 🎓 Bài Tập Thực Hành

1. Thử tấn công CSRF với các endpoint khác trong ứng dụng
2. Implement CSRF protection cho toàn bộ API
3. Tạo middleware tự động kiểm tra Origin header
4. Viết unit test cho CSRF protection
5. Thử bypass các biện pháp phòng chống (ethical hacking)

---

**Ghi chú**: Demo này chỉ dùng cho mục đích giáo dục. Không sử dụng kỹ thuật này để tấn công hệ thống thực tế.
