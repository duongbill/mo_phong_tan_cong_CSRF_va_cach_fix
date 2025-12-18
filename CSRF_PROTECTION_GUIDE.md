# 🛡️ Hướng Dẫn Demo CSRF Protection

## 🎯 Mục Đích

Demo lỗ hổng CSRF và các biện pháp phòng chống trong dự án.

## 📝 Các Tính Năng Đã Implement

### 1. **Biến Môi Trường (.env)**

- `CSRF_PROTECTION=false`: Tắt protection để demo lỗ hổng
- `CSRF_PROTECTION=true`: Bật protection để demo phòng chống

### 2. **Endpoints**

#### Endpoint Dễ Bị Tấn Công (Vulnerable)

```
GET /api/profile/update-bio?bio=<text>
```

- ❌ Không có CSRF protection
- ❌ Sử dụng GET method
- ❌ Nhận parameter từ query string
- ✅ Dùng để demo tấn công

#### Endpoint Được Bảo Vệ (Protected)

```
POST /api/profile/update-bio-secure
Body: { "bio": "<text>" }
Headers: { "X-CSRF-Token": "<token>" }
```

- ✅ Có CSRF token validation
- ✅ Sử dụng POST method
- ✅ Nhận data từ request body
- ✅ Validate CSRF token từ headers

#### Endpoint Lấy CSRF Token

```
GET /api/csrf-token
```

- Trả về CSRF token cho client
- Client tự động gọi khi app load

### 3. **Client Configuration**

- Axios tự động fetch CSRF token từ server
- Token được attach vào mọi API request
- Support cả `X-CSRF-Token` và `x-xsrf-token` headers

### 4. **Attacker Page - Multiple Attack Methods**

#### Phương Pháp 1: IMG Tag Attack (GET)

```html
<img src="http://localhost:3000/api/profile/update-bio?bio=HACKED" />
```

- ✅ Hoạt động với endpoint không bảo vệ
- ❌ Bị chặn với SameSite=strict cookies

#### Phương Pháp 2: Form Auto-Submit (POST)

```html
<form
  action="http://localhost:3000/api/profile/update-bio-secure"
  method="POST"
>
  <input type="hidden" name="bio" value="HACKED" />
</form>
```

- ❌ Bị chặn vì thiếu CSRF token
- ❌ Bị chặn với SameSite=strict cookies

#### Phương Pháp 3: Fetch/AJAX (POST)

```javascript
fetch("http://localhost:3000/api/profile/update-bio-secure", {
  method: "POST",
  body: JSON.stringify({ bio: "HACKED" }),
});
```

- ❌ Bị chặn bởi CORS policy
- ❌ Thiếu CSRF token

## 🧪 Cách Test

### Test 1: Demo Lỗ Hổng (CSRF_PROTECTION=false)

1. **Cấu hình:**

   ```bash
   # File .env
   CSRF_PROTECTION=false
   ```

2. **Khởi động servers:**

   ```bash
   npm start          # Terminal 1: Main server (port 3000)
   cd client && npm run dev  # Terminal 2: React app (port 5173)
   ```

3. **Đăng nhập vào app:**

   - Mở http://localhost:5173
   - Đăng nhập với tài khoản của bạn
   - Xem profile hiện tại

4. **Thực hiện tấn công:**

   - Mở file `attacker.html` trong browser
   - IMG tag sẽ tự động tấn công
   - Click button "Nhận Thưởng" để kích hoạt Form attack

5. **Kiểm tra kết quả:**
   - Quay lại http://localhost:5173/profile
   - Bio đã bị thay đổi! ✅ Attack thành công

### Test 2: Demo Phòng Chống (CSRF_PROTECTION=true)

1. **Cấu hình:**

   ```bash
   # File .env
   CSRF_PROTECTION=true
   ```

2. **Restart servers:**

   ```bash
   # Restart cả 2 terminals
   npm start
   cd client && npm run dev
   ```

3. **Đăng nhập và thử tấn công:**

   - Đăng nhập vào http://localhost:5173
   - Mở `attacker.html`
   - ❌ IMG tag attack bị chặn (SameSite=strict)
   - ❌ Form attack bị chặn (thiếu CSRF token)
   - ❌ AJAX attack bị chặn (CORS + no token)

4. **Test endpoint bảo vệ từ app:**
   - Cập nhật bio từ React app
   - ✅ Hoạt động bình thường (có CSRF token)

## 🔒 Các Biện Pháp Phòng Chống

### 1. CSRF Token

```javascript
// Server validate token
if (token !== req.session.csrfToken) {
  return res.status(403).json({ error: "Invalid CSRF token" });
}
```

### 2. SameSite Cookies

```javascript
cookie: {
  sameSite: 'strict',  // Chặn cross-site requests
  httpOnly: true,
  secure: true
}
```

### 3. HTTP Method Restrictions

- Chỉ dùng POST/PUT/DELETE cho state-changing operations
- Không dùng GET cho operations thay đổi data

### 4. CORS Configuration

```javascript
cors({
  origin: ["http://localhost:5173"],
  credentials: true,
  allowedHeaders: ["Content-Type", "X-CSRF-Token"],
});
```

## 📊 So Sánh

| Feature            | CSRF_PROTECTION=false | CSRF_PROTECTION=true    |
| ------------------ | --------------------- | ----------------------- |
| SameSite Cookie    | lax                   | strict                  |
| IMG Tag Attack     | ✅ Thành công         | ❌ Bị chặn              |
| Form POST Attack   | ⚠️ Thiếu token        | ❌ Bị chặn              |
| Protected Endpoint | ❌ Từ chối (no token) | ✅ Chấp nhận (có token) |
| Legitimate Request | ✅ Hoạt động          | ✅ Hoạt động            |

## 🎓 Các Điểm Cần Lưu Ý

1. **Endpoint `/update-bio` (GET)** - Cố ý để lỗ hổng để demo
2. **Endpoint `/update-bio-secure` (POST)** - Có full protection
3. **React app** tự động attach CSRF token vào mọi request
4. **SameSite=strict** ngăn cookie được gửi từ cross-site requests
5. **CORS** ngăn AJAX requests từ origins không được phép

## 🚀 Demo Cho Giảng Viên

### Kịch Bản 1: Trước Khi Fix (CSRF_PROTECTION=false)

1. Đăng nhập vào app
2. Mở attacker.html
3. Bio bị thay đổi ➡️ **Lỗ hổng CSRF**

### Kịch Bản 2: Sau Khi Fix (CSRF_PROTECTION=true)

1. Đăng nhập vào app
2. Mở attacker.html
3. Attacks bị chặn ➡️ **CSRF Protection hoạt động**

### Kịch Bản 3: Legitimate User

1. User đăng nhập vào React app
2. Cập nhật bio từ Profile page
3. ✅ Hoạt động bình thường (có CSRF token)

## 📚 Tài Liệu Tham Khảo

- OWASP CSRF Prevention Cheat Sheet
- MDN: SameSite Cookies
- Express Session Security Best Practices
