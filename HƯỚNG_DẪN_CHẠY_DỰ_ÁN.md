# 🛡️ Hướng Dẫn Chạy Dự Án CSRF Protection Demo

## 📋 Mục Lục

1. [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
2. [Cài Đặt](#cài-đặt)
3. [Cấu Trúc Dự Án](#cấu-trúc-dự-án)
4. [Chạy Dự Án](#chạy-dự-án)
5. [Test Case 1: Demo Lỗ Hổng CSRF](#test-case-1-demo-lỗ-hổng-csrf)
6. [Test Case 2: Demo Phòng Chống CSRF](#test-case-2-demo-phòng-chống-csrf)
7. [Khắc Phục Sự Cố](#khắc-phục-sự-cố)

---

## ✅ Yêu Cầu Hệ Thống

- **Node.js**: v16+ (kiểm tra: `node --version`)
- **npm**: v8+ (kiểm tra: `npm --version`)
- **MongoDB**: Đang chạy (local hoặc cloud)
- **Browser**: Chrome, Firefox, Edge, Safari (bất kỳ)

---

## 🚀 Cài Đặt

### Bước 1: Clone hoặc tải project

```bash
cd projecttancong
```

### Bước 2: Cài đặt dependencies

```bash
# Main server
npm install

# React client
cd client
npm install
cd ..
```

### Bước 3: Cấu hình biến môi trường

File `.env` đã được tạo sẵn. Kiểm tra:

```bash
# File: .env
CSRF_PROTECTION=false  # hoặc true (dùng để switch mode)
NODE_ENV=development
```

---

## 📁 Cấu Trúc Dự Án

```
projecttancong/
├── server.js                          # Main server (port 3000)
├── attacker-server.js                 # Attacker server (port 8080)
├── .env                               # Biến môi trường
├── middleware/
│   ├── auth.js                        # CSRF token middleware
│   └── apiAuth.js                     # API authentication
├── routes/api/
│   ├── profile.js                     # Profile endpoints (vulnerable + protected)
│   ├── auth.js                        # Auth endpoints
│   └── ...
├── client/                            # React app
│   ├── src/
│   │   └── services/api.js            # Axios config (auto-attach CSRF token)
│   └── ...
├── attacker.html                      # Trang tấn công CSRF
├── CSRF_PROTECTION_GUIDE.md           # Hướng dẫn chi tiết
├── CHANGELOG.md                       # Tóm tắt thay đổi
└── ...
```

---

## 🏃 Chạy Dự Án

### Terminal 1: Khởi động Main Server (Port 3000)

```bash
npm start
```

✅ Khi thấy: `The server is listening at http://localhost:3000`

### Terminal 2: Khởi động React Client (Port 5173)

```bash
cd client
npm run dev
```

✅ Khi thấy: `VITE v... ready in ... ms`

### Terminal 3: Khởi động Attacker Server (Port 8080)

```bash
npm run start-attacker
```

✅ Khi thấy: `🔥 CSRF ATTACK SERVER STARTED`

### Kiểm Tra Các Servers:

- **Main App**: http://localhost:5173
- **Attacker Page**: http://localhost:8080
- **API**: http://localhost:3000/api

---

## 🧪 TEST CASE 1: Demo Lỗ Hổng CSRF

**Mục Đích:** Chứng minh CSRF attack hoạt động khi không có protection

### Bước 1: Cấu Hình Mode Lỗ Hổng

Mở file `.env` và thay đổi:

```dotenv
CSRF_PROTECTION=false
```

### Bước 2: Restart Servers

**Terminal 1 (Main Server):**

```bash
# Nhấn Ctrl+C để dừng
# Sau đó chạy lại:
npm start
```

**Terminal 2 (React Client):**

```bash
# Nhấn Ctrl+C để dừng
# Sau đó chạy lại:
npm run dev
```

### Bước 3: Xóa Cookies Cũ

1. Mở http://localhost:5173
2. Nhấn **F12** (DevTools)
3. Tab **Application** → **Cookies** → http://localhost:3000
4. **Xóa tất cả cookies** (click chuột phải → "Clear All")
5. **Refresh page** (Ctrl+R)

### Bước 4: Đăng Nhập

1. Tại http://localhost:5173
2. Click **Register** hoặc **Login**
3. Tạo tài khoản hoặc đăng nhập
4. **Ghi nhớ bio hiện tại** của bạn (vd: "My bio is awesome")

### Bước 5: Xem Profile Trước Attack

1. Click **Profile** trên navbar
2. **Ghi chép bio hiện tại**
   - Ví dụ: "My awesome bio"

### Bước 6: Thực Hiện CSRF Attack

1. **Mở attacker page:** http://localhost:8080
2. Trang sẽ hiển thị popup "🎁 Nhận Thưởng"
3. **Quan sát console** (F12 → Console):
   ```
   🔴 IMG Tag Attack: SUCCESS ✓
   ```
4. **Click button "Nhận Thưởng Ngay"** để kích hoạt Form attack

### Bước 7: Kiểm Tra Kết Quả Attack

1. **Quay lại http://localhost:5173**
2. **Click Profile**
3. **Bio đã bị thay đổi!** ✅
   - Lúc trước: "My awesome bio"
   - Bây giờ: "【CSRF GET Attack】Tài khoản bị hack qua IMG tag 🔥"

### ✅ Demo Lỗ Hổng Thành Công!

**Giải thích:**

- ❌ Không có CSRF protection
- ❌ SameSite=lax cho phép cross-site requests
- ❌ Endpoint GET không validate token
- ✅ Attack thành công!

---

## 🛡️ TEST CASE 2: Demo Phòng Chống CSRF

**Mục Đích:** Chứng minh CSRF attack bị chặn khi có protection

### Bước 1: Cấu Hình Mode Bảo Vệ

Mở file `.env` và thay đổi:

```dotenv
CSRF_PROTECTION=true
```

### Bước 2: Restart Servers

**Terminal 1 (Main Server):**

```bash
# Nhấn Ctrl+C để dừng
# Chạy lại:
npm start
```

**Terminal 2 (React Client):**

```bash
# Nhấn Ctrl+C để dừng
# Chạy lại:
npm run dev
```

### Bước 3: Xóa Cookies Cũ (QUAN TRỌNG!)

⚠️ **BẮTBUỘC:** Cookies cũ có SameSite=lax, phải xóa để nhận cookie mới (SameSite=strict)

1. Mở http://localhost:5173
2. Nhấn **F12** (DevTools)
3. Tab **Application** → **Cookies** → http://localhost:3000
4. **Xóa tất cả** (click chuột phải → "Clear All")
5. **Đóng DevTools** (F12)
6. **Refresh page** (Ctrl+R)

### Bước 4: Đăng Nhập Lại

1. **Logout** nếu chưa logout
   - Click **Profile** → **Làm Mới** → **Logout**
2. **Đăng nhập lại** với tài khoản cũ
   - Login credentials giống như Test Case 1

### Bước 5: Xem Profile Trước Attack

1. Click **Profile** trên navbar
2. **Ghi chép bio hiện tại** (có thể được reset lại)
3. Ví dụ: "My bio..." (tuỳ vào dữ liệu database)

### Bước 6: Thực Hiện CSRF Attack

1. **Mở attacker page:** http://localhost:8080
2. Popup "🎁 Nhận Thưởng" vẫn hiển thị
3. **Quan sát console** (F12 → Console):

   ```
   🔴 IMG Tag Attack: FAILED ✗
   → Response: {"error":"Endpoint này đã bị vô hiệu hóa"}

   🔴 Form POST Attack: FAILED ✗
   → Response: {"error":"Invalid CSRF token"}
   ```

4. **Click button "Nhận Thưởng Ngay"** (sẽ không có tác dụng)

### Bước 7: Kiểm Tra Kết Quả Attack

1. **Quay lại http://localhost:5173**
2. **Click Profile**
3. **Bio VẪN GIỮ NGUYÊN!** ✅
   - Bio không bị đổi
   - Attack bị chặn thành công

### Bước 8: Kiểm Tra Update Profile Vẫn Hoạt động

1. Vẫn ở trang Profile
2. **Thay đổi bio** thành: "Update từ React app - Hoạt động bình thường"
3. **Click "Update Profile"**
4. ✅ **Bio được cập nhật** (vì React app gửi CSRF token)

### ✅ Demo Phòng Chống Thành Công!

**Giải thích:**

- ✅ Có CSRF protection
- ✅ SameSite=strict ngăn cross-site cookies
- ✅ Endpoint GET bị vô hiệu hóa
- ✅ Endpoint POST validate CSRF token
- ✅ React app vẫn hoạt động bình thường (có token)

---

## 📊 Bảng So Sánh 2 Mode

| Tính Năng            | CSRF_PROTECTION=false     | CSRF_PROTECTION=true |
| -------------------- | ------------------------- | -------------------- |
| **SameSite Cookie**  | `lax`                     | `strict`             |
| **Endpoint GET**     | ✅ Hoạt động              | ❌ Vô hiệu hóa (403) |
| **Endpoint POST**    | ⚠️ Không validate token   | ✅ Validate token    |
| **IMG Tag Attack**   | ✅ **THÀNH CÔNG**         | ❌ Bị chặn           |
| **Form POST Attack** | ⚠️ Gửi được (không token) | ❌ Bị chặn           |
| **React App**        | ✅ Hoạt động              | ✅ Hoạt động         |
| **Bio Bị Đổi**       | ✅ **CÓ**                 | ❌ **KHÔNG**         |

---

## 🐛 Khắc Phục Sự Cố

### Vấn đề 1: Port Đang Bị Sử Dụng

**Lỗi:** `Error: listen EADDRINUSE: address already in use :::3000`

**Giải pháp:**

```bash
# Tìm process đang sử dụng port
netstat -ano | findstr :3000

# Hoặc đơn giản, nhấn Ctrl+C nhiều lần trong terminal
```

### Vấn đề 2: CORS Error

**Lỗi:** `Access to XMLHttpRequest at '...' from origin '...' has been blocked by CORS`

**Giải pháp:**

- Kiểm tra các servers có chạy trên đúng port không
- Restart main server: `npm start`

### Vấn đề 3: Attack Không Bị Chặn (Khi CSRF_PROTECTION=true)

**Nguyên nhân:** Browser vẫn dùng cookie cũ (SameSite=lax)

**Giải pháp:**

1. Xóa tất cả cookies: DevTools → Application → Cookies → Clear All
2. Refresh page (Ctrl+R)
3. Logout → Login lại
4. Test lại attack

### Vấn đề 4: Database Connection Error

**Lỗi:** `Failed to connect to MongoDB`

**Giải pháp:**

- Kiểm tra MongoDB đang chạy
- Kiểm tra connection string trong `config/database.js`
- Nếu dùng MongoDB Atlas, kiểm tra network access

### Vấn đề 5: React App Blank Page

**Lỗi:** Trang trắng, không hiển thị gì

**Giải pháp:**

```bash
# Rebuild React app
cd client
npm run build
cd ..
npm start
```

---

## 📝 Các Endpoint Chính

### Endpoints Vulnerable (Dùng Để Demo)

| Endpoint                         | Method | Protection | Mục Đích                                    |
| -------------------------------- | ------ | ---------- | ------------------------------------------- |
| `/api/profile/update-bio`        | GET    | ❌ Không   | Demo lỗ hổng (tắt khi CSRF_PROTECTION=true) |
| `/api/profile/update-bio-secure` | POST   | ✅ Có      | Endpoint an toàn (validate CSRF token)      |

### Endpoints Utilities

| Endpoint             | Method | Description                |
| -------------------- | ------ | -------------------------- |
| `/api/csrf-token`    | GET    | Lấy CSRF token cho client  |
| `/api/auth/login`    | POST   | Đăng nhập                  |
| `/api/auth/register` | POST   | Đăng ký                    |
| `/api/auth/logout`   | POST   | Đăng xuất                  |
| `/api/profile`       | GET    | Lấy profile user           |
| `/api/profile`       | PUT    | Cập nhật profile (an toàn) |

---

## 📚 Tài Liệu Bổ Sung

- [CSRF_PROTECTION_GUIDE.md](CSRF_PROTECTION_GUIDE.md) - Hướng dẫn chi tiết về protection
- [CSRF_ATTACK_DEMO.md](CSRF_ATTACK_DEMO.md) - Demo lỗ hổng chi tiết
- [CHANGELOG.md](CHANGELOG.md) - Tóm tắt các thay đổi

---

## 🎓 Kịch Bản Presentation

### Cho Giảng Viên / Dự Án Nhóm

#### Phase 1: Giới Thiệu CSRF (5 phút)

1. Giải thích CSRF là gì
2. Hậu quả của CSRF attack
3. Các phương thức tấn công

#### Phase 2: Demo Lỗ Hổng (10 phút)

1. Cấu hình `CSRF_PROTECTION=false`
2. Restart servers
3. Đăng nhập vào app
4. Mở attacker page
5. Chỉ ra bio bị thay đổi
6. Xem console logs (Attack SUCCESS)

#### Phase 3: Demo Phòng Chống (10 phút)

1. Cấu hình `CSRF_PROTECTION=true`
2. Restart servers
3. Xóa cookies, đăng nhập lại
4. Mở attacker page
5. Chỉ ra bio KHÔNG bị thay đổi
6. Xem console logs (Attack FAILED)
7. Chứng minh React app vẫn hoạt động

#### Phase 4: Giải Thích Cơ Chế (10 phút)

1. So sánh SameSite cookie (lax vs strict)
2. CSRF token validation
3. POST method vs GET method
4. CORS configuration

**Tổng thời gian:** ~35 phút

---

## ✨ Các Tính Năng Đã Implement

✅ Demo tấn công CSRF (IMG tag, Form auto-submit, AJAX)
✅ CSRF token protection
✅ SameSite cookies (dynamic strict/lax)
✅ Endpoint GET vulnerable (dùng để demo)
✅ Endpoint POST protected (CSRF validation)
✅ Auto-attach token từ React app
✅ CORS configuration
✅ Mode switch qua .env
✅ Tài liệu chi tiết

---

## 🎉 Kết Luận

Dự án hoàn toàn phù hợp với đề tài:

- ✅ Demo tấn công CSRF (form auto-submit, img tag)
- ✅ Demo phòng chống (CSRF token + SameSite cookies)
- ✅ Dễ dàng switch giữa 2 modes
- ✅ Tài liệu chi tiết cho presentation

**Happy Testing! 🚀**
