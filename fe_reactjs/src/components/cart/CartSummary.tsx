import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Button,
  Alert,
} from '@mui/material';
import {
  ShoppingCart,
  LocalShipping,
  Discount,
} from '@mui/icons-material';
import { CartSummary as CartSummaryType } from '../../types/cart';

interface CartSummaryProps {
  summary: CartSummaryType;
  onCheckout?: () => void;
  onContinueShopping?: () => void;
  isLoading?: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  summary,
  onCheckout,
  onContinueShopping,
  isLoading = false,
}) => {
  const {
    total_items,
    total_amount,
    shipping_fee,
    discount_amount,
    final_amount,
  } = summary;

  const hasDiscount = discount_amount > 0;
  const hasShipping = shipping_fee > 0;

  return (
    <Card sx={{ position: 'sticky', top: 20 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ShoppingCart sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6">
            Tóm tắt đơn hàng
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Số lượng sản phẩm:
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {total_items} sản phẩm
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Tạm tính:
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {total_amount.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND',
              })}
            </Typography>
          </Box>

          {hasShipping && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocalShipping sx={{ mr: 0.5, fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  Phí vận chuyển:
                </Typography>
              </Box>
              <Typography variant="body2" fontWeight="medium">
                {shipping_fee.toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </Typography>
            </Box>
          )}

          {hasDiscount && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Discount sx={{ mr: 0.5, fontSize: 16, color: 'success.main' }} />
                <Typography variant="body2" color="success.main">
                  Giảm giá:
                </Typography>
              </Box>
              <Typography variant="body2" fontWeight="medium" color="success.main">
                -{discount_amount.toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            Tổng cộng:
          </Typography>
          <Typography variant="h6" fontWeight="bold" color="primary">
            {final_amount.toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND',
            })}
          </Typography>
        </Box>

        {total_items === 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Giỏ hàng của bạn đang trống
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={onCheckout}
            disabled={total_items === 0 || isLoading}
            sx={{ mb: 1 }}
          >
            {isLoading ? 'Đang xử lý...' : 'Thanh toán'}
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            fullWidth
            onClick={onContinueShopping}
          >
            Tiếp tục mua sắm
          </Button>
        </Box>

        {/* Additional Info */}
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary" display="block">
            • Miễn phí vận chuyển cho đơn hàng từ 500.000đ
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            • Hỗ trợ đổi trả trong 30 ngày
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            • Thanh toán an toàn và bảo mật
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
