# Fashion Store - Website Bán Quần Áo

Dự án website bán quần áo được xây dựng với ReactJS và Node.js, sử dụng Material-UI cho giao diện hiện đại.

## 🚀 Tính năng đã hoàn thành

### Frontend (ReactJS)
- ✅ **Giao diện hiện đại** với Material-UI
- ✅ **Đăng ký tài khoản** với validation đầy đủ
- ✅ **Đăng nhập/Đăng xuất** với JWT authentication
- ✅ **Quên mật khẩu** và đặt lại mật khẩu
- ✅ **Layout responsive** cho mobile và desktop
- ✅ **Navigation header** với menu động
- ✅ **Protected routes** cho các trang cần đăng nhập
- ✅ **Error boundary** để xử lý lỗi
- ✅ **Loading states** cho UX tốt hơn

### Backend (Node.js) - Cần phát triển
- 🔄 API endpoints cho authentication
- 🔄 Database integration với MySQL
- 🔄 JWT token management
- 🔄 Email service cho forgot password

## 🛠️ Công nghệ sử dụng

### Frontend
- **React 18** với TypeScript
- **Vite** - Build tool nhanh
- **Material-UI (MUI)** - UI framework
- **React Router** - Routing
- **React Hook Form** - Form management
- **Yup** - Form validation
- **Axios** - HTTP client

### Backend (Dự kiến)
- **Node.js** với Express.js
- **MySQL** database
- **JWT** authentication
- **bcrypt** password hashing
- **Nodemailer** email service

## 📁 Cấu trúc dự án

```
fe_reactjs/
├── src/
│   ├── components/
│   │   ├── auth/           # Components authentication
│   │   ├── layout/         # Layout components
│   │   └── common/         # Common components
│   ├── contexts/           # React contexts
│   ├── pages/              # Page components
│   ├── services/           # API services
│   ├── types/              # TypeScript types
│   ├── utils/              # Utility functions
│   └── config/             # App configuration
├── public/                 # Static files
└── package.json
```

## 🚀 Cách chạy dự án

### 1. Cài đặt dependencies
```bash
cd fe_reactjs
npm install
```

### 2. Chạy development server
```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:5173`

### 3. Build production
```bash
npm run build
```

## 📱 Giao diện

### Trang chủ
- Hero section với gradient background
- Sản phẩm nổi bật với card layout
- Features section với icons
- Responsive design cho mobile

### Authentication
- **Đăng nhập**: Form với email/password, validation
- **Đăng ký**: Form đầy đủ với confirm password
- **Quên mật khẩu**: Gửi email reset password
- **Đặt lại mật khẩu**: Form với token validation

### Navigation
- Header với logo và menu
- Mobile menu drawer
- User profile dropdown
- Shopping cart và wishlist icons

## 🔐 Authentication Flow

1. **Đăng ký**: User nhập thông tin → Validation → API call → Auto login
2. **Đăng nhập**: Email/password → JWT token → Store in localStorage
3. **Quên mật khẩu**: Email → Send reset link → Reset password form
4. **Protected routes**: Check token → Redirect to login if expired

## 🎨 UI/UX Features

- **Material Design** với Material-UI components
- **Responsive** design cho tất cả screen sizes
- **Loading states** với CircularProgress
- **Error handling** với Alert components
- **Form validation** với real-time feedback
- **Smooth animations** và transitions
- **Modern color scheme** với gradient backgrounds

## 📋 TODO - Tính năng tiếp theo

### Phase 1 (MVP)
- [ ] Backend API development
- [ ] Database integration
- [ ] Product listing page
- [ ] Shopping cart functionality
- [ ] Basic checkout process

### Phase 2
- [ ] Product search và filtering
- [ ] Product detail page
- [ ] User profile management
- [ ] Order history
- [ ] Payment integration

### Phase 3
- [ ] Admin panel
- [ ] Product reviews
- [ ] Wishlist functionality
- [ ] Advanced features

## 🤝 Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Dự án này được phân phối dưới MIT License. Xem file `LICENSE` để biết thêm chi tiết.

## 📞 Liên hệ

Nếu có câu hỏi hoặc cần hỗ trợ, vui lòng tạo issue trên GitHub repository.
