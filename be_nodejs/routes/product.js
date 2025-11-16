const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id/related', productController.getRelatedProducts);
router.get('/:id/attributes', productController.getProductAttributes);
router.get('/:id', productController.getProductById);

// Admin routes
router.post('/', authenticateToken, requireAdmin, productController.createProduct);
router.put('/:id', authenticateToken, requireAdmin, productController.updateProduct);
router.delete('/:id', authenticateToken, requireAdmin, productController.deleteProduct);

module.exports = router;
