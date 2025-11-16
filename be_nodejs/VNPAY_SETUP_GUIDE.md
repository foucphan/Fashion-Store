# VNPay Setup Guide

## 1. Tạo file .env trong thư mục be_nodejs

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=fashion_store

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@fashionstore.com

# VNPay Configuration
VNPAY_TMN_CODE=2QXUI4J4
VNPAY_SECRET_KEY=RAOEXHYVSDDIIENYWSLDIIENYWSLEE
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:5173/payment/vnpay/return
VNPAY_EXPIRE_MINUTES=30
```

## 2. VNPay Sandbox Configuration

- **TMN Code**: `2QXUI4J4` (Sandbox)
- **Secret Key**: `RAOEXHYVSDDIIENYWSLDIIENYWSLEE` (Sandbox)
- **URL**: `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html`
- **Return URL**: `http://localhost:5173/payment/vnpay/return`
- **Expire Time**: `30` phút (có thể điều chỉnh)

## 3. Test VNPay Sandbox

1. **Số tiền test**: Tối đa 1,000,000 VND
2. **Thẻ test**: Sử dụng thẻ test từ VNPay
3. **Kết quả**: Chỉ hiển thị thành công khi VNPay trả về ResponseCode = '00'

## 4. Debug VNPay

Kiểm tra console log để debug:
- VNPay Config
- Amount calculation
- Date format (Create Date, Expire Date)
- Expire Minutes
- Time difference
- Signature generation
- Final URL

## 5. Production Setup

Khi deploy production, thay đổi:
- VNPAY_TMN_CODE: Mã TMN thật
- VNPAY_SECRET_KEY: Secret key thật
- VNPAY_URL: URL production
- VNPAY_RETURN_URL: URL production
