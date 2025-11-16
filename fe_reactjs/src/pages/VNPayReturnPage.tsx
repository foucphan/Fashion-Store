import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Payment,
  ShoppingCart,
} from '@mui/icons-material';

export const VNPayReturnPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentResult, setPaymentResult] = useState<{
    success: boolean;
    message: string;
    orderId?: string;
    amount?: number;
    transactionNo?: string;
  } | null>(null);

  useEffect(() => {
    handlePaymentReturn();
  }, []);

  const handlePaymentReturn = async () => {
    try {
      setLoading(true);
      
      // Lấy thông tin từ URL parameters
      const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
      const vnp_TxnRef = searchParams.get('vnp_TxnRef');
      const vnp_Amount = searchParams.get('vnp_Amount');
      const vnp_TransactionNo = searchParams.get('vnp_TransactionNo');

      console.log('🔐 VNPay Return - ResponseCode:', vnp_ResponseCode);
      console.log('🔐 VNPay Return - TxnRef:', vnp_TxnRef);
      console.log('🔐 VNPay Return - Amount:', vnp_Amount);
      console.log('🔐 VNPay Return - TransactionNo:', vnp_TransactionNo);

      if (!vnp_TxnRef) {
        setPaymentResult({
          success: false,
          message: 'Không tìm thấy thông tin đơn hàng'
        });
        return;
      }

      // Gọi backend để xử lý VNPay return
      const queryParams = new URLSearchParams(window.location.search);
      const backendUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/vnpay/payment-return?${queryParams.toString()}`;
      
      console.log('🔐 VNPay Return - Calling backend:', backendUrl);
      
      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      console.log('🔐 VNPay Return - Backend response:', result);

      if (result.success) {
        setPaymentResult({
          success: true,
          message: 'Thanh toán thành công! Đơn hàng đã được xác nhận.',
          orderId: result.data.orderId,
          amount: result.data.amount,
          transactionNo: result.data.transactionNo
        });
      } else {
        setPaymentResult({
          success: false,
          message: result.message || 'Thanh toán thất bại'
        });
      }
    } catch (error) {
      console.error('❌ Error handling payment return:', error);
      setPaymentResult({
        success: false,
        message: 'Có lỗi xảy ra khi xử lý kết quả thanh toán'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleViewOrders = () => {
    navigate('/orders');
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h6" color="text.secondary">
            Đang xử lý kết quả thanh toán...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        {paymentResult?.success ? (
          <>
            <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />
            <Typography variant="h4" gutterBottom color="success.main">
              Thanh toán thành công!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {paymentResult.message}
            </Typography>
            
            <Box sx={{ bgcolor: 'grey.50', p: 3, borderRadius: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Thông tin đơn hàng
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mã đơn hàng: <strong>{paymentResult.orderId}</strong>
              </Typography>
              {paymentResult.amount && (
                <Typography variant="body2" color="text.secondary">
                  Số tiền: <strong>{paymentResult.amount.toLocaleString('vi-VN')} VNĐ</strong>
                </Typography>
              )}
              {paymentResult.transactionNo && (
                <Typography variant="body2" color="text.secondary">
                  Mã giao dịch: <strong>{paymentResult.transactionNo}</strong>
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                onClick={handleContinueShopping}
              >
                Tiếp tục mua sắm
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<Payment />}
                onClick={handleViewOrders}
              >
                Xem đơn hàng
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Error sx={{ fontSize: 80, color: 'error.main', mb: 3 }} />
            <Typography variant="h4" gutterBottom color="error.main">
              Thanh toán thất bại
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {paymentResult?.message || 'Có lỗi xảy ra trong quá trình thanh toán'}
            </Typography>

            <Alert severity="error" sx={{ mb: 3 }}>
              Vui lòng thử lại hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp diễn.
            </Alert>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                onClick={handleContinueShopping}
              >
                Tiếp tục mua sắm
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/checkout')}
              >
                Thử lại thanh toán
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};
