import React, { useState, useEffect } from 'react';
import {
  Button,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
} from '@mui/material';
import {
  ShoppingCart,
  Add,
  Remove,
} from '@mui/icons-material';
import { Product } from '../../types/product';
import { useCart } from '../../contexts/CartContext';
import { productService } from '../../services/productService';

interface AddToCartButtonProps {
  product: Product;
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  showQuantity?: boolean;
  onAddToCart?: (product: Product, quantity: number) => void;
}

interface ProductVariant {
  id: number;
  size?: string;
  color?: string;
  stock_quantity: number;
  sku_variant?: string;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  variant = 'contained',
  size = 'medium',
  fullWidth = false,
  showQuantity = false,
  onAddToCart,
}) => {
  const { addToCart } = useCart();
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
  const [loadingVariants, setLoadingVariants] = useState(false);

  // Load product attributes from API
  useEffect(() => {
    const loadProductAttributes = async () => {
      try {
        setLoadingVariants(true);
        const response = await productService.getProductAttributes(product.id);
        setProductVariants(response.data || []);
      } catch (error) {
        console.error('Error loading product attributes:', error);
        setError('Không thể tải thông tin sản phẩm');
      } finally {
        setLoadingVariants(false);
      }
    };

    if (product.id) {
      loadProductAttributes();
    }
  }, [product.id]);

  const handleAddToCart = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    // Nếu có variants và chưa chọn variant, mở dialog
    if (productVariants.length > 0 && !selectedVariant) {
      setOpen(true);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await addToCart({
        product_id: product.id,
        product_attribute_id: selectedVariant?.id,
        quantity: quantity,
      });

      onAddToCart?.(product, quantity);
      
      if (showQuantity) {
        setQuantity(1);
      }
    } catch (error) {
      setError('Không thể thêm sản phẩm vào giỏ hàng');
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAddToCart = async () => {
    if (!selectedVariant) {
      setError('Vui lòng chọn biến thể sản phẩm');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await addToCart({
        product_id: product.id,
        product_attribute_id: selectedVariant.id,
        quantity: quantity,
      });

      onAddToCart?.(product, quantity);
      setOpen(false);
      setQuantity(1);
      setSelectedVariant(null);
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      
      if (error.response?.status === 401) {
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        // Don't redirect here, let the interceptor handle it
      } else if (error.response?.status === 403) {
        setError('Không có quyền thực hiện thao tác này');
      } else if (error.response?.status >= 500) {
        setError('Lỗi server. Vui lòng thử lại sau');
      } else {
        setError(error.response?.data?.message || 'Không thể thêm sản phẩm vào giỏ hàng');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (selectedVariant && newQuantity > selectedVariant.stock_quantity) return;
    setQuantity(newQuantity);
  };

  const getAvailableSizes = () => {
    const sizes = [...new Set(productVariants.map(v => v.size))];
    return sizes;
  };

  const getAvailableColors = () => {
    const colors = [...new Set(productVariants.map(v => v.color))];
    return colors;
  };

  const getFilteredVariants = () => {
    return productVariants.filter(variant => {
      if (selectedVariant?.size && variant.size !== selectedVariant.size) return false;
      if (selectedVariant?.color && variant.color !== selectedVariant.color) return false;
      return true;
    });
  };

  const isOutOfStock = () => {
    return productVariants.every(variant => variant.stock_quantity === 0);
  };

  // Loading state
  if (loadingVariants) {
    return (
      <Button
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        disabled
        startIcon={<ShoppingCart />}
      >
        Đang tải...
      </Button>
    );
  }

  if (isOutOfStock()) {
    return (
      <Button
        variant="outlined"
        size={size}
        fullWidth={fullWidth}
        disabled
        startIcon={<ShoppingCart />}
      >
        Hết hàng
      </Button>
    );
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        onClick={handleAddToCart}
        disabled={loading}
        startIcon={<ShoppingCart />}
      >
        {loading ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
      </Button>

      {/* Variant Selection Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Chọn biến thể sản phẩm
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            {/* Size Selection */}
            <FormControl fullWidth>
              <InputLabel>Kích thước</InputLabel>
              <Select
                value={selectedVariant?.size || ''}
                onChange={(e) => {
                  const size = e.target.value;
                  const variant = productVariants.find(v => v.size === size);
                  setSelectedVariant(variant || null);
                }}
              >
                {getAvailableSizes().map(size => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Color Selection */}
            <FormControl fullWidth>
              <InputLabel>Màu sắc</InputLabel>
              <Select
                value={selectedVariant?.color || ''}
                onChange={(e) => {
                  const color = e.target.value;
                  const variant = productVariants.find(v => v.color === color);
                  setSelectedVariant(variant || null);
                }}
              >
                {getAvailableColors().map(color => (
                  <MenuItem key={color} value={color}>
                    {color}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Selected Variant Info */}
            {selectedVariant && (
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Thông tin biến thể:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip label={`Size: ${selectedVariant.size}`} size="small" />
                  <Chip label={`Màu: ${selectedVariant.color}`} size="small" />
                  <Chip 
                    label={`Còn lại: ${selectedVariant.stock_quantity}`} 
                    size="small" 
                    color={selectedVariant.stock_quantity > 0 ? 'success' : 'error'}
                  />
                </Box>
              </Box>
            )}

            {/* Quantity Selection */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body1">Số lượng:</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  size="small"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Remove />
                </Button>
                <TextField
                  value={quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    handleQuantityChange(value);
                  }}
                  size="small"
                  sx={{ width: 80 }}
                  inputProps={{ 
                    min: 1, 
                    max: selectedVariant?.stock_quantity || 1,
                    style: { textAlign: 'center' } 
                  }}
                />
                <Button
                  size="small"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={selectedVariant ? quantity >= selectedVariant.stock_quantity : false}
                >
                  <Add />
                </Button>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleConfirmAddToCart}
            variant="contained"
            disabled={!selectedVariant || loading}
          >
            {loading ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
