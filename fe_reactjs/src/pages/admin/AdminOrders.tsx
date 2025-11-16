import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert as MuiAlert,
} from '@mui/material';
import { Visibility, Refresh, Edit, Payment } from '@mui/icons-material';
import { adminService, AdminOrder } from '../../services/adminService';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [paymentStatusDialogOpen, setPaymentStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [newPaymentStatus, setNewPaymentStatus] = useState<string>('');

  useEffect(() => {
    loadOrders();
  }, [page, statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const params: any = { page, limit: 20 };
      if (statusFilter) {
        params.status = statusFilter;
      }
      const response = await adminService.getAllOrders(params);
      setOrders(response.data.orders);
      setTotalPages(response.data.pagination.pages);
    } catch (err: any) {
      console.error('Error loading orders:', err);
      setError(err.response?.data?.message || 'Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'completed':
        return 'success';
      case 'confirmed':
      case 'processing':
      case 'shipping':
        return 'info';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: 'Chờ xử lý',
      confirmed: 'Đã xác nhận',
      processing: 'Đang xử lý',
      shipping: 'Đang giao',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy',
    };
    return statusMap[status] || status;
  };

  const handleViewDetail = async (order: AdminOrder) => {
    try {
      const orderDetail = await adminService.getOrderById(order.id);
      setSelectedOrder(orderDetail as any);
      setDetailDialogOpen(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải chi tiết đơn hàng');
    }
  };

  const handleOpenStatusDialog = (order: AdminOrder) => {
    setSelectedOrder(order);
    setNewStatus(order.status || order.order_status || 'pending');
    setStatusDialogOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      setLoading(true);
      await adminService.updateOrderStatus(selectedOrder.id, newStatus);
      setSuccess('Cập nhật trạng thái đơn hàng thành công');
      setStatusDialogOpen(false);
      setSelectedOrder(null);
      loadOrders();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể cập nhật trạng thái');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPaymentStatusDialog = (order: AdminOrder) => {
    setSelectedOrder(order);
    setNewPaymentStatus(order.payment_status || 'pending');
    setPaymentStatusDialogOpen(true);
  };

  const handleUpdatePaymentStatus = async () => {
    if (!selectedOrder || !newPaymentStatus) return;

    try {
      setLoading(true);
      await adminService.updatePaymentStatus(selectedOrder.id, newPaymentStatus);
      setSuccess('Cập nhật trạng thái thanh toán thành công');
      setPaymentStatusDialogOpen(false);
      setSelectedOrder(null);
      loadOrders();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể cập nhật trạng thái thanh toán');
    } finally {
      setLoading(false);
    }
  };

  if (loading && orders.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Quản lý đơn hàng
        </Typography>
        <Button
          startIcon={<Refresh />}
          onClick={loadOrders}
          variant="outlined"
          disabled={loading}
        >
          Làm mới
        </Button>
      </Box>

      {/* Snackbar notifications */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiAlert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiAlert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
          {success}
        </MuiAlert>
      </Snackbar>

      <Paper sx={{ borderRadius: 2, boxShadow: 2, mb: 2 }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Lọc theo trạng thái</InputLabel>
            <Select
              value={statusFilter}
              label="Lọc theo trạng thái"
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="pending">Chờ xử lý</MenuItem>
              <MenuItem value="confirmed">Đã xác nhận</MenuItem>
              <MenuItem value="processing">Đang xử lý</MenuItem>
              <MenuItem value="shipping">Đang giao</MenuItem>
              <MenuItem value="completed">Hoàn thành</MenuItem>
              <MenuItem value="cancelled">Đã hủy</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell><strong>Mã đơn</strong></TableCell>
                <TableCell><strong>Khách hàng</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Tổng tiền</strong></TableCell>
                <TableCell><strong>Trạng thái</strong></TableCell>
                <TableCell><strong>Thanh toán</strong></TableCell>
                <TableCell><strong>Ngày đặt</strong></TableCell>
                <TableCell><strong>Thao tác</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="textSecondary">Không có đơn hàng nào</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>#{order.order_code}</TableCell>
                    <TableCell>{order.user_name || 'N/A'}</TableCell>
                    <TableCell>{order.user_email || 'N/A'}</TableCell>
                    <TableCell>{order.final_amount.toLocaleString('vi-VN')} ₫</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(order.status || order.order_status || 'pending')}
                        color={getStatusColor(order.status || order.order_status || 'pending') as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          order.payment_status === 'paid' ? 'Đã thanh toán' :
                          order.payment_status === 'failed' ? 'Thất bại' :
                          order.payment_status === 'refunded' ? 'Đã hoàn tiền' :
                          'Chờ thanh toán'
                        }
                        color={
                          order.payment_status === 'paid' ? 'success' :
                          order.payment_status === 'failed' ? 'error' :
                          order.payment_status === 'refunded' ? 'warning' :
                          'warning'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleViewDetail(order)}
                        title="Xem chi tiết"
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="secondary"
                        onClick={() => handleOpenStatusDialog(order)}
                        title="Cập nhật trạng thái đơn hàng"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleOpenPaymentStatusDialog(order)}
                        title="Cập nhật trạng thái thanh toán"
                      >
                        <Payment fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {totalPages > 1 && (
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, newPage) => setPage(newPage)}
              color="primary"
            />
          </Box>
        )}
      </Paper>

      {/* Order Detail Dialog */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Chi tiết đơn hàng #{selectedOrder?.order_code}</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Khách hàng</Typography>
                <Typography variant="body1">{selectedOrder.user_name} ({selectedOrder.user_email})</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Tổng tiền</Typography>
                <Typography variant="body1">{selectedOrder.final_amount.toLocaleString('vi-VN')} ₫</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Trạng thái</Typography>
                  <Chip
                    label={getStatusLabel(selectedOrder.status || selectedOrder.order_status || 'pending')}
                    color={getStatusColor(selectedOrder.status || selectedOrder.order_status || 'pending') as any}
                    size="small"
                  />
                </Box>
                <Button
                  size="small"
                  startIcon={<Edit />}
                  onClick={() => {
                    setDetailDialogOpen(false);
                    handleOpenStatusDialog(selectedOrder);
                  }}
                >
                  Chỉnh sửa
                </Button>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Thanh toán</Typography>
                  <Chip
                    label={
                      selectedOrder.payment_status === 'paid' ? 'Đã thanh toán' :
                      selectedOrder.payment_status === 'failed' ? 'Thanh toán thất bại' :
                      selectedOrder.payment_status === 'refunded' ? 'Đã hoàn tiền' :
                      'Chờ thanh toán'
                    }
                    color={
                      selectedOrder.payment_status === 'paid' ? 'success' :
                      selectedOrder.payment_status === 'failed' ? 'error' :
                      selectedOrder.payment_status === 'refunded' ? 'warning' :
                      'warning'
                    }
                    size="small"
                  />
                </Box>
                <Button
                  size="small"
                  startIcon={<Payment />}
                  onClick={() => {
                    setDetailDialogOpen(false);
                    handleOpenPaymentStatusDialog(selectedOrder);
                  }}
                >
                  Chỉnh sửa
                </Button>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Ngày đặt</Typography>
                <Typography variant="body1">{new Date(selectedOrder.created_at).toLocaleString('vi-VN')}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
        <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
        <DialogContent>
          <Box sx={{ minWidth: 300, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={newStatus}
                label="Trạng thái"
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <MenuItem value="pending">Chờ xử lý</MenuItem>
                <MenuItem value="confirmed">Đã xác nhận</MenuItem>
                <MenuItem value="processing">Đang xử lý</MenuItem>
                <MenuItem value="shipping">Đang giao</MenuItem>
                <MenuItem value="completed">Hoàn thành</MenuItem>
                <MenuItem value="cancelled">Đã hủy</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)} disabled={loading}>
            Hủy
          </Button>
          <Button onClick={handleUpdateStatus} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Cập nhật'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Payment Status Dialog */}
      <Dialog open={paymentStatusDialogOpen} onClose={() => setPaymentStatusDialogOpen(false)}>
        <DialogTitle>Cập nhật trạng thái thanh toán</DialogTitle>
        <DialogContent>
          <Box sx={{ minWidth: 300, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Trạng thái thanh toán</InputLabel>
              <Select
                value={newPaymentStatus}
                label="Trạng thái thanh toán"
                onChange={(e) => setNewPaymentStatus(e.target.value)}
              >
                <MenuItem value="pending">Chờ thanh toán</MenuItem>
                <MenuItem value="paid">Đã thanh toán</MenuItem>
                <MenuItem value="failed">Thanh toán thất bại</MenuItem>
                <MenuItem value="refunded">Đã hoàn tiền</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentStatusDialogOpen(false)} disabled={loading}>
            Hủy
          </Button>
          <Button onClick={handleUpdatePaymentStatus} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Cập nhật'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
