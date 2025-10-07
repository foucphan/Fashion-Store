# Backend API - Fashion Store

Backend API cho website bán quần áo được xây dựng với Node.js, Express.js và MySQL.

## 🚀 Tính năng đã hoàn thành

### Authentication API
- ✅ **POST /api/auth/register** - Đăng ký tài khoản
- ✅ **POST /api/auth/login** - Đăng nhập
- ✅ **GET /api/auth/me** - Lấy thông tin user hiện tại
- ✅ **POST /api/auth/forgot-password** - Quên mật khẩu
- ✅ **POST /api/auth/reset-password** - Đặt lại mật khẩu

### Security Features
- ✅ **JWT Authentication** - Token-based authentication
- ✅ **Password Hashing** - Bcrypt encryption
- ✅ **CORS Configuration** - Cross-origin requests
- ✅ **Input Validation** - Request validation
- ✅ **Error Handling** - Comprehensive error handling

## 🛠️ Công nghệ sử dụng

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📁 Cấu trúc dự án

```
be_nodejs/
├── config/
│   ├── database.js      # Database connection
│   └── config.js        # App configuration
├── controllers/
│   └── authController.js # Authentication logic
├── middleware/
│   └── auth.js          # JWT middleware
├── routes/
│   └── auth.js          # Authentication routes
├── utils/               # Utility functions
├── server.js            # Main server file
└── package.json
```

## 🚀 Cách chạy dự án

### 1. Cài đặt dependencies
```bash
cd be_nodejs
npm install
```

### 2. Cấu hình database
- Tạo database MySQL với tên `ban_quan_ao_db`
- Chạy file `database_schema.sql` để tạo tables
- Cập nhật thông tin database trong `config/config.js`

### 3. Chạy server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

## 📡 API Endpoints

### Authentication

#### Đăng ký
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "full_name": "Test User",
  "phone": "0123456789"
}
```

#### Đăng nhập
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

#### Lấy thông tin user
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Quên mật khẩu
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "test@example.com"
}
```

#### Đặt lại mật khẩu
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_here",
  "password": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

## 🔧 Cấu hình

### Database Configuration
```javascript
// config/config.js
DB_HOST: 'localhost'
DB_USER: 'root'
DB_PASSWORD: ''
DB_NAME: 'ban_quan_ao_db'
DB_PORT: 3306
```

### JWT Configuration
```javascript
JWT_SECRET: 'your_super_secret_jwt_key_here'
JWT_EXPIRES_IN: '7d'
```

## 🔐 Security Features

- **Password Hashing**: Sử dụng bcryptjs với salt rounds = 10
- **JWT Tokens**: Secure token-based authentication
- **CORS**: Chỉ cho phép requests từ frontend
- **Input Validation**: Validate tất cả input data
- **Error Handling**: Không expose sensitive information

## 📋 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message"
}
```

## 🧪 Testing

### Test Database Connection
```bash
curl http://localhost:3000/api/health
```

### Test Authentication
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"123456","confirmPassword":"123456","full_name":"Test User"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

## 🔄 Kết nối với Frontend

Backend đã được cấu hình để kết nối với frontend ReactJS tại `http://localhost:5173`.

Frontend sẽ gọi API tại: `http://localhost:3000/api`

## 📝 TODO - Tính năng tiếp theo

- [ ] Email service cho forgot password
- [ ] Product management API
- [ ] Order management API
- [ ] File upload cho images
- [ ] Rate limiting
- [ ] API documentation với Swagger
- [ ] Unit tests
- [ ] Integration tests
