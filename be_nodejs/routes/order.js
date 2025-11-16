const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/auth');

// Tất cả routes đều cần authentication
router.use(authenticateToken);

// Tạo đơn hàng mới
router.post('/', orderController.createOrder);

// Lấy danh sách đơn hàng của user
router.get('/', orderController.getUserOrders);

// Lấy chi tiết đơn hàng
router.get('/:id', orderController.getOrderById);

// Hủy đơn hàng
router.put('/:id/cancel', orderController.cancelOrder);

module.exports = router;
