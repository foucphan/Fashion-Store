const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  createPaymentUrl,
  handlePaymentReturn,
  getSupportedBanks,
  checkPaymentStatus
} = require('../controllers/vnpayController');

// Tạo URL thanh toán VNPay
router.post('/create-payment-url', authenticateToken, createPaymentUrl);

// Xử lý kết quả thanh toán từ VNPay
router.get('/payment-return', handlePaymentReturn);

// Lấy danh sách ngân hàng hỗ trợ
router.get('/supported-banks', getSupportedBanks);

// Kiểm tra trạng thái thanh toán
router.get('/payment-status/:orderId', authenticateToken, checkPaymentStatus);

module.exports = router;
