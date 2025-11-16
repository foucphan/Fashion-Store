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
  Card,
  CardContent,
  Chip,
  Grid,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { ShoppingBag, Receipt, Cancel } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { orderService, Order } from '../services/orderService';

const statusColors = {
  pending: 'warning',
  confirmed: 'info',
  processing: 'info',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'error',
  returned: 'default'
} as const;

const statusLabels = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  processing: 'Đang xử lý',
  shipped: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
  returned: 'Đã trả hàng'
} as const;

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [cancelDialog, setCancelDialog] = useState<{
    open: boolean;
    orderId: number | null;
  }>({ open: false, orderId: null });
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    loadOrders();
  }, [pagination.page]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getUserOrders({
        page: pagination.page,
        limit: pagination.limit
      });
      setOrders(response.data.orders);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error loading orders:', error);
      setError('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelDialog.orderId) return;

    try {
      setCancelling(true);
      await orderService.cancelOrder(cancelDialog.orderId);
      setCancelDialog({ open: false, orderId: null });
      loadOrders(); // Reload orders
    } catch (error) {
      console.error('Error cancelling order:', error);
      setError('Không thể hủy đơn hàng');
    } finally {
      setCancelling(false);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
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
        <Typography variant="body2" color="text.primary">
          Đơn hàng của tôi
        </Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <ShoppingBag sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h4">
          Đơn hàng của tôi
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {orders.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" gutterBottom>
            Bạn chưa có đơn hàng nào
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Hãy bắt đầu mua sắm để tạo đơn hàng đầu tiên
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/products')}
            startIcon={<ShoppingBag />}
          >
            Bắt đầu mua sắm
          </Button>
        </Box>
      ) : (
        <>
          {/* Orders List */}
          <Box sx={{ mb: 4 }}>
            {orders.map((order) => (
              <Card key={order.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {order.order_number}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Đặt ngày: {formatDate(order.created_at)}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Chip
                        label={statusLabels[order.status as keyof typeof statusLabels] || order.status}
                        color={statusColors[order.status as keyof typeof statusColors] || 'default'}
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="h6" color="primary.main">
                        {formatPrice(order.final_amount)}
                      </Typography>
                    </Box>
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Giao đến:</strong> {order.shipping_info.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {order.shipping_info.phone}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {order.shipping_info.address}, {order.shipping_info.ward}, {order.shipping_info.district}, {order.shipping_info.city}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Phương thức thanh toán:</strong> {
                          order.payment_method === 'cod' ? 'Thanh toán khi nhận hàng' :
                          order.payment_method === 'bank_transfer' ? 'Chuyển khoản ngân hàng' :
                          order.payment_method === 'credit_card' ? 'Thẻ tín dụng' :
                          order.payment_method
                        }
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Số sản phẩm:</strong> {order.items.length} sản phẩm
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* Order Items */}
                  <Box sx={{ mb: 2 }}>
                    {order.items.slice(0, 3).map((item) => (
                      <Box key={item.id} sx={{ display: 'flex', gap: 2, mb: 1, pb: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                        <Box
                          component="img"
                          src={item.product.image || '/placeholder.jpg'}
                          alt={item.product.name}
                          sx={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 1 }}
                        />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="body2" noWrap>
                            {item.product.name}
                          </Typography>
                          {item.product_attribute && (
                            <Typography variant="caption" color="text.secondary">
                              {item.product_attribute.size} - {item.product_attribute.color}
                            </Typography>
                          )}
                          <Typography variant="body2">
                            {item.quantity} × {formatPrice(item.price)}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                    {order.items.length > 3 && (
                      <Typography variant="body2" color="text.secondary">
                        và {order.items.length - 3} sản phẩm khác...
                      </Typography>
                    )}
                  </Box>

                  {/* Actions */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate(`/orders/${order.id}`)}
                      startIcon={<Receipt />}
                    >
                      Xem chi tiết
                    </Button>
                    {order.status === 'pending' && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => setCancelDialog({ open: true, orderId: order.id })}
                        startIcon={<Cancel />}
                      >
                        Hủy đơn hàng
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={pagination.pages}
                page={pagination.page}
                onChange={(_, page) => setPagination(prev => ({ ...prev, page }))}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      {/* Cancel Order Dialog */}
      <Dialog open={cancelDialog.open} onClose={() => setCancelDialog({ open: false, orderId: null })}>
        <DialogTitle>Xác nhận hủy đơn hàng</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog({ open: false, orderId: null })}>
            Hủy
          </Button>
          <Button
            onClick={handleCancelOrder}
            color="error"
            disabled={cancelling}
            startIcon={cancelling ? <CircularProgress size={16} /> : <Cancel />}
          >
            {cancelling ? 'Đang hủy...' : 'Xác nhận hủy'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
