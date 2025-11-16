const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Public routes
router.get('/', brandController.getAllBrands);
router.get('/:id', brandController.getBrandById);

// Admin routes
router.post('/', authenticateToken, requireAdmin, brandController.createBrand);
router.put('/:id', authenticateToken, requireAdmin, brandController.updateBrand);
router.delete('/:id', authenticateToken, requireAdmin, brandController.deleteBrand);

module.exports = router;
