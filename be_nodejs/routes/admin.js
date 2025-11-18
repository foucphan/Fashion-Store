const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Tất cả routes đều cần admin
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard stats
router.get('/stats', adminController.getStats);
router.get('/revenue-chart', adminController.getRevenueChart);

// Reports
router.get('/reports/inventory', adminController.getInventoryReport);
router.get('/reports/revenue', adminController.getRevenueReport);
router.get('/reports/inventory/export', adminController.exportInventoryExcel);
router.get('/reports/revenue/export', adminController.exportRevenueExcel);

// Orders
router.get('/orders', adminController.getAllOrders);
router.put('/orders/:id/status', adminController.updateOrderStatus);
router.put('/orders/:id/payment-status', adminController.updatePaymentStatus);

// Users
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;

