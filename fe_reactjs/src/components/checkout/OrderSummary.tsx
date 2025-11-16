import React from 'react';
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

interface OrderSummaryProps {
  summary: {
    total_items: number;
    total_amount: number;
    shipping_fee: number;
    discount_amount: number;
    final_amount: number;
  };
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ summary }) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND'
    });
  };

  return (
    <Box>
      <List dense>
        <ListItem sx={{ px: 0 }}>
          <ListItemText
            primary="Tạm tính"
            secondary={`${summary.total_items} sản phẩm`}
          />
          <Typography variant="body2">
            {formatPrice(summary.total_amount)}
          </Typography>
        </ListItem>

        <ListItem sx={{ px: 0 }}>
          <ListItemText
            primary="Phí vận chuyển"
            secondary="Giao hàng tiêu chuẩn"
          />
          <Typography variant="body2">
            {summary.shipping_fee > 0 ? formatPrice(summary.shipping_fee) : 'Miễn phí'}
          </Typography>
        </ListItem>

        {summary.discount_amount > 0 && (
          <ListItem sx={{ px: 0 }}>
            <ListItemText
              primary="Giảm giá"
              secondary="Áp dụng mã giảm giá"
            />
            <Typography variant="body2" color="success.main">
              -{formatPrice(summary.discount_amount)}
            </Typography>
          </ListItem>
        )}
      </List>

      <Divider sx={{ my: 2 }} />

      <ListItem sx={{ px: 0 }}>
        <ListItemText
          primary={
            <Typography variant="h6" fontWeight="bold">
              Tổng cộng
            </Typography>
          }
        />
        <Typography variant="h6" fontWeight="bold" color="primary.main">
          {formatPrice(summary.final_amount)}
        </Typography>
      </ListItem>
    </Box>
  );
};
