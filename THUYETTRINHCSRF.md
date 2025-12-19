# 📚 Dự Án Demo CSRF Attack & Protection

## Hướng Dẫn Bảo Vệ Website Khỏi Tấn Công CSRF

---

## 🎯 Mục Đích Dự Án

Dự án này là một **demo giáo dục** giúp học sinh/sinh viên hiểu rõ:

- ❌ **CSRF Attack là gì?** Cách hoạt động như thế nào?
- ✅ **Cách phòng chống CSRF** trong web application
- 🔒 **Best practices** bảo mật web

---

## 🏗️ Kiến Trúc Dự Án

```
App chính (localhost:5173)
    ↓ (Click popup thưởng)
Attacker Server (localhost:8080)
    ↓ (Gửi CSRF attack)
Backend Server (localhost:3000)
    ↓
Attack Success Page (localhost:3000/attack-success.html)
```

### 3 Máy Chủ:

1. **App React** (5173) - Ứng dụng chính
2. **Attacker Server** (8080) - Trang web giả mạo
3. **Backend API** (3000) - Server xử lý

---

## 🔴 CSRF Attack - Lỗ Hổng Bảo Mật

### ❓ CSRF Là Gì?

**CSRF (Cross-Site Request Forgery)** = Tấn công giả mạo yêu cầu cross-site

```
Kịch Bản Tấn Công:

1. Bạn đăng nhập vào Facebook
   └─ Session cookie được lưu trong browser

2. Bạn mở tab khác → Truy cập attacker.html
   └─ Attacker.html có code ẩn

3. Code ẩn gửi request tới Facebook
   └─ Browser tự động gửi session cookie

4. Kết quả: Hacker thay đổi mật khẩu/email của bạn
   └─ Tài khoản bị hack! 😱
```

---

## 🔗 Cách Hoạt Động CSRF Attack

### **Phương Pháp 1: IMG Tag (GET Request)**

```html
<!-- Hacker nhúng dòng này vào attacker.html -->
<img src="http://localhost:3000/api/profile/update-bio?bio=【HACKED】" />

<!-- Kết quả:
    1. Browser tải ảnh từ URL
    2. Tự động gửi GET request
    3. Session cookie được gửi cùng
    4. Server thay đổi bio của user
    5. User không hay biết gì cả!
-->
```

**Tại sao nguy hiểm?**

- ✅ Không cần CSRF token
- ✅ Đơn giản, chỉ 1 dòng code
- ✅ Browser tự động gửi cookie

---

### **Phương Pháp 2: Form Auto-Submit (POST Request)**

```html
<form
  id="csrfForm"
  action="http://localhost:3000/api/profile/update-bio-secure"
  method="POST"
  style="display: none"
>
  <input name="bio" value="【HACKED】" />
</form>

<script>
  // Tự động submit form khi trang load
  document.getElementById("csrfForm").submit();
</script>

<!-- Kết quả:
    1. Form ẩn được submit tự động
    2. Browser gửi POST request + session cookie
    3. Server không kiểm tra CSRF token (nếu không bảo vệ)
    4. Bio bị thay đổi
    5. Attacker win! 🎉
-->
```

---

### **Phương Pháp 3: AJAX/Fetch (Bị CORS Chặn)**

```javascript
fetch("http://localhost:3000/api/profile/update-bio-secure", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ bio: "【HACKED】" }),
  credentials: "include",
});

/* Kết quả:
   ❌ Bị CORS policy chặn
   ❌ Browser không cho phép
   ✅ Đây là một lớp bảo vệ tốt
*/
```

---

## 🟢 Cách Bảo Vệ CSRF - 4 Phương Pháp

### **1️⃣ CSRF Token (Phương Pháp Chính)**

#### ✅ Cách Hoạt Động:

```
Server tạo token random
     ↓
Client nhận token khi load app
     ↓
Client gửi token trong mỗi request quan trọng
     ↓
Server xác minh: Token từ request === Token trong session?
     ↓
✅ Token khớp → Xử lý request
❌ Token không khớp → Chặn request (CSRF attack detected!)
```

#### 📝 Cách Implement:

**Server - [server.js](server.js#L115-L124):**

```javascript
// Endpoint tạo token
apiRouter.get("/csrf-token", (req, res) => {
  if (!req.session.csrfToken) {
    req.session.csrfToken =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
  }
  res.json({ csrfToken: req.session.csrfToken });
});
```

**Client - [api.js](client/src/services/api.js):**

```javascript
// Fetch token khi app load
const fetchCsrfToken = async () => {
  const response = await axios.get("http://localhost:3000/api/csrf-token", {
    withCredentials: true, // ← Gửi session cookie
  });
  csrfToken = response.data.csrfToken; // ← Nhận token
};

// Thêm token vào headers mỗi request
api.interceptors.request.use((config) => {
  if (csrfToken) {
    config.headers["X-CSRF-Token"] = csrfToken; // ← Gửi token
  }
  return config;
});
```

**Server - [profile.js](routes/api/profile.js#L86-L94):**

```javascript
router.post("/update-bio-secure", async (req, res) => {
  const token = req.headers["x-csrf-token"];

  // ← Xác minh token
  if (!token || token !== req.session.csrfToken) {
    return res.redirect("/security-alert.html"); // ❌ Chặn
  }

  // ✅ Token hợp lệ → Xử lý request
  const user = await User.findByIdAndUpdate(req.session.userId, { bio });
  res.json({ success: true, user });
});
```

---

### **2️⃣ SameSite Cookie Attribute**

#### ✅ Cách Hoạt Động:

```javascript
// Khi CSRF_PROTECTION=true
cookie: {
  sameSite: "strict"; // ← Cookie KHÔNG được gửi từ cross-site
}

// Ví dụ:
// Attacker.html (localhost:8080) gửi request tới localhost:3000
// ❌ Browser sẽ KHÔNG gửi session cookie
// ✅ Server không biết user là ai → Request bị chặn
```

#### 🎯 3 Mức Độ SameSite:

| Mức Độ     | Gửi Cookie Từ                     | An Toàn          |
| ---------- | --------------------------------- | ---------------- |
| **Strict** | Chỉ same-site                     | 🟢 Cao nhất      |
| **Lax**    | Same-site + top-level navigations | 🟡 Trung bình    |
| **None**   | Everywhere (phải HTTPS + Secure)  | 🔴 Rất nguy hiểm |

---

### **3️⃣ Origin/Referer Header Check**

```javascript
// Server kiểm tra request đến từ domain nào
const origin = req.headers.origin;
const referer = req.headers.referer;

if (origin !== "http://localhost:5173") {
  return res.status(403).json({ error: "CSRF Attack Detected!" });
}
```

---

### **4️⃣ Double Submit Cookie Pattern**

```javascript
// Server gửi token trong cookie AND body
res.cookie("csrf-token", token); // ← Trong cookie
res.json({ csrfToken: token }); // ← Trong body

// Client verify: cookie === body token?
// Nếu khác nhau → Là CSRF attack
```

---

## 🧪 Cách Test Dự Án

### **Test Case 1: Demo Lỗ Hổng CSRF**

```bash
# 1. Set environment variable
CSRF_PROTECTION=false

# 2. Start servers
npm start              # Backend (3000)
npm run dev            # React app (5173)
npm run start-attacker # Attacker server (8080)

# 3. Đăng nhập vào app
# http://localhost:5173

# 4. Popup thưởng hiển thị → Click nó

# 5. Attacker.html mở
# → Click "Nhận Thưởng Ngay"

# 6. Kiểm tra Profile
# Bio đã bị thay đổi! 😱 CSRF attack thành công
```

### **Test Case 2: Demo Bảo Vệ CSRF**

```bash
# 1. Set environment variable
CSRF_PROTECTION=true

# 2. Start servers (giống như trên)

# 3. Đăng nhập vào app

# 4. Click popup thưởng

# 5. Attacker.html mở
# → Click "Nhận Thưởng Ngay"

# 6. Kiểm tra Profile
# Bio KHÔNG thay đổi! ✅ CSRF attack bị chặn
# Token invalid → Redirect tới security-alert.html
```

---

## 📊 So Sánh: Vulnerable vs Protected

### **GET /update-bio (Dễ bị tấn công)**

```javascript
router.get("/update-bio", async (req, res) => {
  // ❌ Không kiểm tra CSRF token
  // ❌ Dữ liệu trong URL (công khai)
  // ❌ Browser tự động gửi

  const newBio = req.query.bio;
  await User.findByIdAndUpdate(req.session.userId, { bio: newBio });
  res.redirect("/attack-success.html");
});
```

**Tấn công:**

```html
<img src="http://localhost:3000/api/profile/update-bio?bio=HACKED" />
<!-- ✅ Đơn giản, hiệu quả! -->
```

---

### **POST /update-bio-secure (Bảo vệ)**

```javascript
router.post("/update-bio-secure", async (req, res) => {
  // ✅ Kiểm tra CSRF token
  const token = req.headers["x-csrf-token"];
  if (!token || token !== req.session.csrfToken) {
    return res.redirect("/security-alert.html"); // ❌ Chặn
  }

  // ✅ Token hợp lệ → Xử lý
  const { bio } = req.body;
  await User.findByIdAndUpdate(req.session.userId, { bio });
  res.json({ success: true });
});
```

**Tấn công:**

```html
<!-- ❌ Cần token từ app chính (localhost:5173) -->
<!-- ❌ Attacker không thể lấy được token -->
<!-- ❌ POST + CSRF token = rất khó tấn công -->
```

---

## 🛡️ Best Practices Bảo Vệ CSRF

### **✅ LÀM:**

1. **Sử dụng CSRF Token**

   ```javascript
   // Tất cả form/POST request cần token
   config.headers["X-CSRF-Token"] = csrfToken;
   ```

2. **Sử dụng SameSite Cookie**

   ```javascript
   cookie: {
     sameSite: "strict";
   }
   ```

3. **Sử dụng POST, PUT, DELETE cho state-changing**

   - Không dùng GET để thay đổi data

4. **Validate Origin Header**

   ```javascript
   if (req.headers.origin !== ALLOWED_ORIGIN) {
     return res.status(403).json({ error: "CSRF" });
   }
   ```

5. **Implement CORS đúng cách**
   ```javascript
   cors({
     origin: ["http://localhost:5173"],
     credentials: true,
     methods: ["GET", "POST", "PUT", "DELETE"],
   });
   ```

---

### **❌ KHÔNG LÀM:**

1. ❌ Không tin tưởng vào SameSite cookie alone
2. ❌ Không dùng GET cho thay đổi data
3. ❌ Không để lộ CSRF token trong URL
4. ❌ Không bỏ qua CORS validation
5. ❌ Không store token trong localStorage (XSS risk)

---

## 📈 Thống Kê Bảo Mật

| Loại Attack     | Có Bảo Vệ                 | Không Bảo Vệ   |
| --------------- | ------------------------- | -------------- |
| **IMG Tag GET** | 🟢 Chặn (SameSite=strict) | 🔴 Bị hack     |
| **Form POST**   | 🟢 Chặn (Token invalid)   | 🔴 Bị hack     |
| **AJAX/Fetch**  | 🟢 Chặn (CORS)            | 🔴 Có thể hack |
| **Direct URL**  | 🟢 Chặn (Origin check)    | 🔴 Bị hack     |

---

## 🎓 Kết Luận

### **CSRF Attack Là:**

- ✅ **Thật sự nguy hiểm** - Ảnh hưởng tới hàng triệu user
- ✅ **Khó phát hiện** - User không biết gì cả
- ✅ **Dễ exploit** - Chỉ cần vài dòng code

### **Cách Bảo Vệ:**

- ✅ **CSRF Token** - Phương pháp chính, hiệu quả
- ✅ **SameSite Cookie** - Lớp bảo vệ thứ 2
- ✅ **Origin Check** - Validation bổ sung
- ✅ **CORS Policy** - Ngăn chặn cross-origin

### **Quy Tắc Vàng:**

> 🔒 **Mỗi state-changing request phải có CSRF token + SameSite cookie**

---

## 🔗 Tài Liệu Tham Khảo

- [OWASP - CSRF Prevention](https://owasp.org/www-community/attacks/csrf)
- [MDN - Cross-Site Request Forgery (CSRF)](https://developer.mozilla.org/en-US/docs/Glossary/CSRF)
- [OWASP - SameSite Cookie](https://owasp.org/www-community/attacks/Same_Site_Cookie)

---

## 📞 Liên Hệ & Câu Hỏi

Nếu có câu hỏi về CSRF attack hay bảo vệ web, vui lòng tham khảo:

- Console logs trong attacker.html (F12)
- Network tab để xem requests
- attack-success.html để hiểu chi tiết

---

**Created:** December 2025  
**Purpose:** Educational Demo for Web Security  
**Language:** Vietnamese

✅ Happy Learning! 🚀
