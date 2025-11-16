const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id/related', productController.getRelatedProducts);
router.get('/:id/attributes', productController.getProductAttributes);
router.get('/:id/images', productController.getProductImages);
router.get('/:id', productController.getProductById);

// Admin routes
router.post('/', authenticateToken, requireAdmin, productController.createProduct);
router.put('/:id', authenticateToken, requireAdmin, productController.updateProduct);
router.delete('/:id', authenticateToken, requireAdmin, productController.deleteProduct);

// Admin image routes
router.post('/:id/images', authenticateToken, requireAdmin, upload.single('image'), productController.uploadProductImage);
router.put('/:id/images/:imageId', authenticateToken, requireAdmin, productController.updateProductImage);
router.delete('/:id/images/:imageId', authenticateToken, requireAdmin, productController.deleteProductImage);

// Admin inventory routes
router.get('/inventory/all', authenticateToken, requireAdmin, productController.getAllInventory);
router.put('/attributes/:id/stock', authenticateToken, requireAdmin, productController.updateStockQuantity);

module.exports = router;
