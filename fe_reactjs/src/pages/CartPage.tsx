import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link,
  Snackbar,
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, refreshCart, clearCart, resetCart, forceRefreshCart } = useCart();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    // Force refresh cart when navigating to cart page
    const timer = setTimeout(() => {
      forceRefreshCart();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []); // Remove forceRefreshCart from dependencies

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      setSnackbarMessage('Đã xóa tất cả sản phẩm khỏi giỏ hàng');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error clearing cart:', error);
      setSnackbarMessage('Có lỗi xảy ra khi xóa giỏ hàng');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleQuantityChange = (itemId: number, quantity: number) => {
    // This will be handled by the CartItem component
    console.log(`Item ${itemId} quantity changed to ${quantity}`);
  };

  const handleRemoveItem = (itemId: number) => {
    // This will be handled by the CartItem component
    console.log(`Item ${itemId} removed`);
  };

  const handleShowMessage = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleClearCache = async () => {
    try {
      // Clear all cache
      localStorage.clear();
      sessionStorage.clear();
      
      // Force refresh cart
      await forceRefreshCart();
      
      setSnackbarMessage('Đã xóa cache và refresh giỏ hàng');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error clearing cache:', error);
      setSnackbarMessage('Lỗi khi xóa cache');
      setSnackbarOpen(true);
    }
  };


  if (cart.isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Đang tải giỏ hàng...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (cart.error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {cart.error}
        </Alert>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Button
            variant="contained"
            onClick={() => refreshCart(true)}
            sx={{ mr: 2 }}
          >
            Thử lại
          </Button>
          <Button
            variant="outlined"
            onClick={() => resetCart()}
            sx={{ mr: 2 }}
          >
            Reset Cart
          </Button>
          <Button
            variant="outlined"
            onClick={handleClearCache}
            sx={{ mr: 2 }}
          >
            Clear Cache
          </Button>
          <Button
            variant="outlined"
            onClick={() => forceRefreshCart()}
            sx={{ mr: 2 }}
          >
            Force Refresh
          </Button>
          <Button
            variant="outlined"
            onClick={handleContinueShopping}
            startIcon={<ShoppingCart />}
          >
            Tiếp tục mua sắm
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate('/')}
          sx={{ textDecoration: 'none' }}
        >
          Trang chủ
        </Link>
        <Typography color="text.primary">Giỏ hàng</Typography>
      </Breadcrumbs>

      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Giỏ hàng của bạn
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {cart.total_items} sản phẩm trong giỏ hàng
        </Typography>
      </Box>

      {cart.items.length === 0 ? (
        /* Empty Cart */
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" gutterBottom>
            Giỏ hàng trống
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Bạn chưa có sản phẩm nào trong giỏ hàng
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleContinueShopping}
          >
            Bắt đầu mua sắm
          </Button>
        </Box>
      ) : (
        /* Cart Content */
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Cart Items */}
          <Box sx={{ flex: { xs: 1, md: 2 } }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                Sản phẩm trong giỏ hàng
              </Typography>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={handleClearCart}
              >
                Xóa tất cả
              </Button>
            </Box>

            {cart.items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveItem}
                onShowMessage={handleShowMessage}
              />
            ))}
          </Box>

          {/* Cart Summary */}
          <Box sx={{ flex: { xs: 1, md: 1 }, minWidth: { md: 300 } }}>
            <CartSummary
              summary={{
                total_items: cart.total_items,
                total_amount: cart.total_amount,
                shipping_fee: cart.shipping_fee,
                discount_amount: cart.discount_amount,
                final_amount: cart.final_amount,
              }}
              onCheckout={handleCheckout}
              onContinueShopping={handleContinueShopping}
              isLoading={cart.isLoading}
            />
          </Box>
        </Box>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Container>
  );
};
