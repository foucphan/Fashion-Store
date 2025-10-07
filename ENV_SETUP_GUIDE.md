# 🔧 Hướng dẫn tạo file .env cho Frontend và Backend

## 📁 Frontend (.env)

Tạo file `.env` trong thư mục `fe_reactjs/`:

```bash
# Frontend Environment Variables
# ================================

# API Configuration
VITE_API_URL=http://localhost:3000/api

# App Configuration
VITE_APP_NAME=Fashion Store
VITE_APP_VERSION=1.0.0

# Environment
VITE_NODE_ENV=development

# Features
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
```

## 📁 Backend (.env)

Tạo file `.env` trong thư mục `be_nodejs/`:

```bash
# Backend Environment Variables
# ================================

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ban_quan_ao_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production_123456789
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Email Configuration (for forgot password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@fashionstore.com

# Security Configuration
BCRYPT_ROUNDS=10

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🚀 Cách tạo file .env

### Windows (PowerShell)
```powershell
# Frontend
cd fe_reactjs
New-Item -Path ".env" -ItemType File
# Copy nội dung .env cho frontend vào file

# Backend
cd ../be_nodejs
New-Item -Path ".env" -ItemType File
# Copy nội dung .env cho backend vào file
```

### Windows (Command Prompt)
```cmd
# Frontend
cd fe_reactjs
echo. > .env
# Copy nội dung .env cho frontend vào file

# Backend
cd ../be_nodejs
echo. > .env
# Copy nội dung .env cho backend vào file
```

### Linux/Mac
```bash
# Frontend
cd fe_reactjs
touch .env
# Copy nội dung .env cho frontend vào file

# Backend
cd ../be_nodejs
touch .env
# Copy nội dung .env cho backend vào file
```

## ⚙️ Cấu hình quan trọng

### Database Configuration
- **DB_HOST**: Địa chỉ MySQL server (thường là localhost)
- **DB_USER**: Username MySQL (thường là root)
- **DB_PASSWORD**: Password MySQL của bạn
- **DB_NAME**: Tên database (ban_quan_ao_db)
- **DB_PORT**: Port MySQL (thường là 3306)

### JWT Configuration
- **JWT_SECRET**: Key bí mật để tạo JWT token (nên thay đổi trong production)
- **JWT_EXPIRES_IN**: Thời gian hết hạn token (7d = 7 ngày)

### CORS Configuration
- **CORS_ORIGIN**: URL của frontend (http://localhost:5173)

### Email Configuration (Optional)
- **EMAIL_HOST**: SMTP server (Gmail: smtp.gmail.com)
- **EMAIL_USER**: Email để gửi reset password
- **EMAIL_PASS**: App password của Gmail

## 🔒 Bảo mật

### ⚠️ Quan trọng:
1. **KHÔNG** commit file `.env` vào Git
2. **THAY ĐỔI** JWT_SECRET trong production
3. **SỬ DỤNG** password mạnh cho database
4. **CẤU HÌNH** CORS đúng domain

### .gitignore
Đảm bảo file `.gitignore` có:
```
# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

## 🧪 Test Configuration

### Test Frontend
```bash
cd fe_reactjs
npm run dev
# Kiểm tra console không có lỗi environment
```

### Test Backend
```bash
cd be_nodejs
npm run dev
# Kiểm tra "Database connected successfully"
```

## 📝 Lưu ý

1. **Frontend**: Sử dụng `VITE_` prefix cho environment variables
2. **Backend**: Sử dụng `dotenv` để load environment variables
3. **Development**: Có thể sử dụng giá trị mặc định
4. **Production**: Bắt buộc phải cấu hình đúng environment variables

## 🎯 Sau khi tạo .env

1. **Frontend** sẽ tự động load từ `.env`
2. **Backend** sẽ load từ `.env` khi start server
3. **Database** sẽ kết nối với thông tin trong `.env`
4. **CORS** sẽ cho phép frontend kết nối

**Chúc bạn cấu hình thành công! 🚀**
