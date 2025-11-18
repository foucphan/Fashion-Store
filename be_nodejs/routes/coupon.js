const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Admin routes only
router.get('/', authenticateToken, requireAdmin, couponController.getAllCoupons);
router.get('/:id', authenticateToken, requireAdmin, couponController.getCouponById);
router.post('/', authenticateToken, requireAdmin, couponController.createCoupon);
router.put('/:id', authenticateToken, requireAdmin, couponController.updateCoupon);
router.delete('/:id', authenticateToken, requireAdmin, couponController.deleteCoupon);

module.exports = router;

