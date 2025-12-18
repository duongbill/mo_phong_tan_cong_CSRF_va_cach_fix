# 🔥 CSRF Attack Demo - Quick Start Guide

## ⚠️ LƯU Ý QUAN TRỌNG

**Tại sao phải dùng HTTP server thay vì mở file trực tiếp?**

❌ **KHÔNG HOẠT ĐỘNG**: `file:///D:/path/to/attacker.html`

- Trình duyệt không gửi cookie khi request từ `file://` protocol
- Same-origin policy chặn cookie từ local file

✅ **HOẠT ĐỘNG**: `http://localhost:8080`

- Trình duyệt tự động gửi cookie khi request từ HTTP origin
- Tấn công CSRF thành công vì cookie được đính kèm

## 🚀 Hướng Dẫn Nhanh

### Cách 1: Tự Động (Khuyến Nghị)

```bash
# Windows: Double-click hoặc chạy
start-all-servers.bat
```

Script sẽ tự động mở 3 terminal:

1. **Backend Server** - `http://localhost:3000`
2. **Frontend Dev** - `http://localhost:5173`
3. **Attacker Server** - `http://localhost:8080`

### Cách 2: Thủ Công

**Terminal 1 - Backend:**

```bash
npm start
```

**Terminal 2 - Frontend:**

```bash
cd client
npm run dev
```

**Terminal 3 - Attacker Server:**

```bash
node attacker-server.js
```

## 📋 Demo Steps

### Bước 1: Đăng Nhập

1. Mở `http://localhost:5173`
2. Đăng nhập hoặc đăng ký tài khoản
3. Vào Profile để xem Bio hiện tại

### Bước 2: Mở Trang Attacker

1. **Mở tab mới** (giữ nguyên tab đã đăng nhập)
2. Truy cập `http://localhost:8080`
3. Trang attacker sẽ tự động thực hiện tấn công

### Bước 3: Kiểm Tra Kết Quả

1. Quay lại tab `http://localhost:5173`
2. Vào Profile
3. Bio đã bị thay đổi thành: **"Tài khoản này đã bị tấn công CSRF 🔥"**

## 🎯 Các URL Quan Trọng

| Service       | URL                               | Mô Tả                    |
| ------------- | --------------------------------- | ------------------------ |
| Frontend      | `http://localhost:5173`           | Ứng dụng chính (victim)  |
| Backend API   | `http://localhost:3000`           | Server API               |
| Attacker Page | `http://localhost:8080`           | Trang giả mạo (attacker) |
| Dashboard     | `http://localhost:8080/dashboard` | Dashboard quản lý attack |

## 🔍 Các Kiểu Tấn Công Demo

### 1. IMG Tag Attack (Tự động khi load trang)

```html
<img
  src="http://localhost:3000/api/profile/update-bio?bio=HACKED"
  style="display:none"
/>
```

### 2. Dashboard Controlled Attack

1. Truy cập `http://localhost:8080/dashboard`
2. Click nút "Tấn Công Bio" hoặc "Tấn Công Tùy Chỉnh"
3. Theo dõi log real-time

## ❓ Troubleshooting

### Lỗi: Cookie không được gửi

**Nguyên nhân**: Mở file bằng `file://` thay vì `http://`
**Giải pháp**: Chắc chắn dùng `http://localhost:8080`

### Lỗi: 401 Unauthorized

**Nguyên nhân**: Chưa đăng nhập vào app chính
**Giải pháp**: Đăng nhập tại `http://localhost:5173` trước

### Lỗi: Cannot GET /api/profile/update-bio

**Nguyên nhân**: Backend server chưa chạy
**Giải pháp**: Chạy `npm start` trong thư mục gốc

### Lỗi: Port 8080 already in use

**Giải pháp**:

```bash
# Tìm và kill process đang dùng port
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Hoặc đổi port trong attacker-server.js
const PORT = 8081; // Thay đổi port
```

## 🛡️ Sau Khi Demo

**Nên làm gì tiếp theo?**

1. **Hiểu lỗ hổng**: Đọc file `CSRF_ATTACK_DEMO.md` để hiểu chi tiết
2. **Fix lỗ hổng**: Xóa hoặc bảo vệ endpoint `/api/profile/update-bio`
3. **Test lại**: Verify rằng tấn công không còn hoạt động
4. **Apply best practices**: Implement CSRF protection cho toàn bộ API

## 📚 Files Liên Quan

- `attacker.html` - Trang tấn công giả mạo "Trúng thưởng"
- `csrf-demo-dashboard.html` - Dashboard quản lý các kiểu tấn công
- `attacker-server.js` - HTTP server để host attacker pages
- `CSRF_ATTACK_DEMO.md` - Tài liệu chi tiết về CSRF
- `start-csrf-demo.bat` - Script khởi động attacker server
- `start-all-servers.bat` - Script khởi động tất cả servers

## ⚠️ Disclaimer

Demo này chỉ dùng cho mục đích:

- ✅ Giáo dục và nghiên cứu bảo mật
- ✅ Kiểm tra bảo mật ứng dụng của bạn
- ❌ KHÔNG tấn công hệ thống thực tế
- ❌ KHÔNG sử dụng cho mục đích bất hợp pháp

---

**Happy Learning! 🎓**
