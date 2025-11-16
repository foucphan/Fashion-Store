import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  TextField,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingCart,
} from '@mui/icons-material';
import { CartItem as CartItemType } from '../../types/cart';
import { useCart } from '../../contexts/CartContext';

interface CartItemProps {
  item: CartItemType;
  onQuantityChange?: (itemId: number, quantity: number) => void;
  onRemove?: (itemId: number) => void;
  onShowMessage?: (message: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({ 
  item, 
  onQuantityChange, 
  onRemove,
  onShowMessage
}) => {
  const { updateCartItem, removeFromCart } = useCart();
  const [localQuantity, setLocalQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateTimeout, setUpdateTimeout] = useState<number | null>(null);

  // Sync local quantity with item quantity when item changes
  useEffect(() => {
    setLocalQuantity(item.quantity);
  }, [item.quantity]);


  // Debounced API call
  const debouncedUpdate = useCallback((newQuantity: number) => {
    if (updateTimeout) {
      window.clearTimeout(updateTimeout);
    }

    const timeout = window.setTimeout(async () => {
      try {
        setIsUpdating(true);
        await updateCartItem(item.id, { quantity: newQuantity });
        onQuantityChange?.(item.id, newQuantity);
        onShowMessage?.(`Đã cập nhật số lượng thành ${newQuantity}`);
      } catch (error) {
        console.error('Error updating quantity:', error);
        // Revert on error
        setLocalQuantity(item.quantity);
        onShowMessage?.('Có lỗi xảy ra khi cập nhật số lượng');
      } finally {
        setIsUpdating(false);
      }
    }, 500); // 500ms delay

    setUpdateTimeout(timeout);
  }, [updateCartItem, item.id, onQuantityChange, updateTimeout]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeout) {
        window.clearTimeout(updateTimeout);
      }
    };
  }, [updateTimeout]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    
    // Optimistic update - update UI immediately
    setLocalQuantity(newQuantity);
    
    // Debounced API call
    debouncedUpdate(newQuantity);
  };

  const handleRemove = async () => {
    try {
      await removeFromCart(item.id);
      onRemove?.(item.id);
      onShowMessage?.('Đã xóa sản phẩm khỏi giỏ hàng');
    } catch (error) {
      console.error('Error removing item:', error);
      onShowMessage?.('Có lỗi xảy ra khi xóa sản phẩm');
    }
  };

  const getCurrentPrice = () => {
    return item.product?.sale_price || item.product?.price || 0;
  };

  const getOriginalPrice = () => {
    if (item.product?.sale_price && item.product?.price) {
      return item.product.price;
    }
    return null;
  };

  const getTotalPrice = () => {
    return getCurrentPrice() * localQuantity;
  };

  const isOnSale = () => {
    return item.product?.sale_price && item.product?.price && 
           item.product.sale_price < item.product.price;
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Product Image */}
          <Avatar
            src={item.product?.primary_image}
            variant="rounded"
            sx={{ width: 80, height: 80 }}
          >
            <ShoppingCart />
          </Avatar>

          {/* Product Info */}
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="h6" noWrap>
              {item.product?.name || 'Sản phẩm không xác định'}
            </Typography>
            
            {/* Product Attributes */}
            {item.product_attribute && (
              <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {item.product_attribute.size && (
                  <Chip 
                    label={`Size: ${item.product_attribute.size}`} 
                    size="small" 
                    variant="outlined"
                  />
                )}
                {item.product_attribute.color && (
                  <Chip 
                    label={`Màu: ${item.product_attribute.color}`} 
                    size="small" 
                    variant="outlined"
                  />
                )}
              </Box>
            )}

            {/* Stock Status */}
            {item.product_attribute && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Còn lại: {item.product_attribute.stock_quantity} sản phẩm
              </Typography>
            )}
          </Box>

          {/* Price and Quantity */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
            {/* Price */}
            <Box sx={{ textAlign: 'right' }}>
              {isOnSale() && (
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ textDecoration: 'line-through' }}
                >
                  {getOriginalPrice()?.toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  })}
                </Typography>
              )}
              <Typography variant="h6" color="primary">
                {getCurrentPrice().toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng: {getTotalPrice().toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </Typography>
            </Box>

            {/* Quantity Controls */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, position: 'relative' }}>
              <IconButton
                size="small"
                onClick={() => handleQuantityChange(localQuantity - 1)}
                disabled={localQuantity <= 1 || isUpdating}
              >
                <Remove />
              </IconButton>
              
              <Box sx={{ position: 'relative' }}>
                <TextField
                  value={localQuantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    handleQuantityChange(value);
                  }}
                  size="small"
                  sx={{ width: 60 }}
                  inputProps={{ 
                    min: 1, 
                    style: { textAlign: 'center' } 
                  }}
                  disabled={isUpdating}
                />
                {isUpdating && (
                  <CircularProgress
                    size={16}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-8px',
                      marginLeft: '-8px',
                    }}
                  />
                )}
              </Box>
              
              <IconButton
                size="small"
                onClick={() => handleQuantityChange(localQuantity + 1)}
                disabled={item.product_attribute && localQuantity >= item.product_attribute.stock_quantity || isUpdating}
              >
                <Add />
              </IconButton>
            </Box>

            {/* Remove Button */}
            <IconButton
              size="small"
              color="error"
              onClick={handleRemove}
              sx={{ mt: 1 }}
            >
              <Delete />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
