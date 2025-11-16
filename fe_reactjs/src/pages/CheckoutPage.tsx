import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider,
} from '@mui/material';
import { ShoppingCart, CheckCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { OrderSummary, ShippingForm, PaymentForm } from '../components/checkout';
import { orderService } from '../services/orderService';
import { vnpayService } from '../services/vnpayService';

const steps = ['Thông tin giao hàng', 'Thanh toán', 'Xác nhận đơn hàng'];

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, refreshCart } = useCart();
  const [activeStep, setActiveStep] = useState(0);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    note: ''
  });
  const [paymentInfo, setPaymentInfo] = useState({
    method: 'cod', // cod, vnpay, bank_transfer, credit_card
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    bankCode: '',
    phone: '',
    email: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleShippingSubmit = (data: any) => {
    setShippingInfo(data);
    handleNext();
  };

  const handlePaymentSubmit = (data: any) => {
    setPaymentInfo(data);
    handleNext();
  };

  const handlePlaceOrder = async () => {
    try {
      setIsProcessing(true);
      
      const orderData = {
        items: cart.items.map(item => ({
          product_id: item.product_id,
          product_attribute_id: item.product_attribute_id,
          quantity: item.quantity,
          product: {
            price: item.product?.price || 0,
            sale_price: item.product?.sale_price
          }
        })),
        shipping_info: shippingInfo,
        payment_info: paymentInfo,
        total_amount: cart.total_amount,
        shipping_fee: cart.shipping_fee,
        discount_amount: cart.discount_amount
      };

      const response = await orderService.createOrder(orderData);
      setOrderId(response.data.order_number);

      // Nếu thanh toán bằng VNPay, tạo URL thanh toán
      if (paymentInfo.method === 'vnpay') {
        const vnpayData = {
          orderId: response.data.id,
          amount: cart.final_amount,
          orderDescription: `Thanh toán đơn hàng ${response.data.order_number}`,
          bankCode: paymentInfo.bankCode || ''
        };

        const vnpayResponse = await vnpayService.createPaymentUrl(vnpayData);
        
        console.log('VNPay response:', vnpayResponse);
        
        if (vnpayResponse.success) {
          // Chuyển hướng đến VNPay
          console.log('Redirecting to VNPay URL:', vnpayResponse.data.paymentUrl);
          vnpayService.redirectToVNPay(vnpayResponse.data.paymentUrl);
          return;
        } else {
          throw new Error(vnpayResponse.message || 'Không thể tạo URL thanh toán VNPay');
        }
      }
      
    } catch (error: any) {
      console.error('Error placing order:', error);
      setError(error.message || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (cart.items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán.
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/products')}
          startIcon={<ShoppingCart />}
        >
          Tiếp tục mua sắm
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

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
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate('/cart')}
          sx={{ textDecoration: 'none' }}
        >
          Giỏ hàng
        </Link>
        <Typography variant="body2" color="text.primary">
          Thanh toán
        </Typography>
      </Breadcrumbs>

      <Typography variant="h4" gutterBottom>
        Thanh toán
      </Typography>

      {/* Stepper */}
      <Box sx={{ mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
        {/* Main Content */}
        <Box sx={{ flex: { xs: 1, lg: 2 } }}>
          {activeStep === 0 && (
            <ShippingForm
              initialData={shippingInfo}
              onSubmit={handleShippingSubmit}
              onBack={() => navigate('/cart')}
            />
          )}

          {activeStep === 1 && (
            <PaymentForm
              initialData={paymentInfo}
              onSubmit={handlePaymentSubmit}
              onBack={handleBack}
            />
          )}

          {activeStep === 2 && (
            <Paper sx={{ p: 3 }}>
              <Box sx={{ textAlign: 'center', py: 4 }}>
                {orderId ? (
                  <>
                    <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                    <Typography variant="h5" gutterBottom>
                      Đặt hàng thành công!
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                      Mã đơn hàng: {orderId}
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => navigate('/')}
                      sx={{ mr: 2 }}
                    >
                      Về trang chủ
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/orders')}
                    >
                      Xem đơn hàng
                    </Button>
                  </>
                ) : (
                  <>
                    <Typography variant="h6" gutterBottom>
                      Xác nhận đơn hàng
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Vui lòng kiểm tra lại thông tin trước khi đặt hàng
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      startIcon={isProcessing ? <CircularProgress size={20} /> : <CheckCircle />}
                    >
                      {isProcessing ? 'Đang xử lý...' : 'Đặt hàng'}
                    </Button>
                  </>
                )}
              </Box>
            </Paper>
          )}
        </Box>

        {/* Order Summary */}
        <Box sx={{ flex: { xs: 1, lg: 1 }, minWidth: { lg: 350 } }}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Đơn hàng của bạn
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            {/* Cart Items */}
            <Box sx={{ mb: 2 }}>
              {cart.items.map((item) => (
                <Box key={item.id} sx={{ display: 'flex', gap: 2, mb: 2, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Box
                    component="img"
                    src={item.product?.primary_image || '/placeholder.jpg'}
                    alt={item.product?.name}
                    sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1 }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" noWrap>
                      {item.product?.name}
                    </Typography>
                    {item.product_attribute && (
                      <Typography variant="caption" color="text.secondary">
                        {item.product_attribute.size} - {item.product_attribute.color}
                      </Typography>
                    )}
                    <Typography variant="body2" fontWeight="bold">
                      {item.quantity} × {(item.product?.sale_price || item.product?.price || 0).toLocaleString()}đ
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Order Summary */}
            <OrderSummary
              summary={{
                total_items: cart.total_items,
                total_amount: cart.total_amount,
                shipping_fee: cart.shipping_fee,
                discount_amount: cart.discount_amount,
                final_amount: cart.final_amount,
              }}
            />
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};
