const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartSummary,
} = require('../controllers/cartController');

// Tất cả routes đều cần authentication
router.use(authenticateToken);

// GET /api/cart - Lấy giỏ hàng
router.get('/', getCart);

// POST /api/cart - Thêm sản phẩm vào giỏ hàng
router.post('/', addToCart);

// PUT /api/cart/:id - Cập nhật số lượng sản phẩm
router.put('/:id', updateCartItem);

// DELETE /api/cart/:id - Xóa sản phẩm khỏi giỏ hàng
router.delete('/:id', removeFromCart);

// DELETE /api/cart - Xóa tất cả sản phẩm khỏi giỏ hàng
router.delete('/', clearCart);

// GET /api/cart/summary - Lấy tổng kết giỏ hàng
router.get('/summary', getCartSummary);

module.exports = router;
