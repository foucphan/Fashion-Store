const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Admin routes only
router.get('/', authenticateToken, requireAdmin, notificationController.getAllNotifications);
router.post('/', authenticateToken, requireAdmin, notificationController.createNotification);
router.put('/:id', authenticateToken, requireAdmin, notificationController.updateNotification);
router.delete('/:id', authenticateToken, requireAdmin, notificationController.deleteNotification);

module.exports = router;

