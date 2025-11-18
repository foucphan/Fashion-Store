import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  Pagination,
  Snackbar,
  Alert as MuiAlert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Refresh,
} from '@mui/icons-material';
import { adminService } from '../../services/adminService';
import { NotificationForm } from '../../components/admin/NotificationForm';

interface Notification {
  id: number;
  user_id?: number;
  user_email?: string;
  user_name?: string;
  title: string;
  message: string;
  type: 'order' | 'promotion' | 'product' | 'system';
  is_read: boolean;
  data?: any;
  created_at: string;
}

export const AdminNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [readFilter, setReadFilter] = useState<string>('');
  const [notificationFormOpen, setNotificationFormOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  useEffect(() => {
    loadNotifications();
  }, [page, typeFilter, readFilter]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      const params: any = { page, limit: 50 };
      if (typeFilter) {
        params.type = typeFilter;
      }
      if (readFilter !== '') {
        params.is_read = readFilter;
      }
      const response = await adminService.getAllNotifications(params);
      setNotifications(response.data.notifications);
      setTotalPages(response.data.pagination.pages);
    } catch (err: any) {
      console.error('Error loading notifications:', err);
      setError(err.response?.data?.message || 'Không thể tải danh sách thông báo');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thông báo này?')) {
      return;
    }

    try {
      await adminService.deleteNotification(id);
      setSuccess('Xóa thông báo thành công');
      loadNotifications();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể xóa thông báo');
    }
  };

  const getTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      order: 'Đơn hàng',
      promotion: 'Khuyến mãi',
      product: 'Sản phẩm',
      system: 'Hệ thống',
    };
    return typeMap[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colorMap: { [key: string]: any } = {
      order: 'primary',
      promotion: 'success',
      product: 'info',
      system: 'default',
    };
    return colorMap[type] || 'default';
  };

  if (loading && notifications.length === 0) {
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
          Quản lý thông báo
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            startIcon={<Refresh />}
            onClick={loadNotifications}
            variant="outlined"
            disabled={loading}
          >
            Làm mới
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{ borderRadius: 2 }}
            onClick={() => {
              setSelectedNotification(null);
              setNotificationFormOpen(true);
            }}
          >
            Tạo thông báo
          </Button>
        </Box>
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
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Loại thông báo</InputLabel>
            <Select
              value={typeFilter}
              label="Loại thông báo"
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="order">Đơn hàng</MenuItem>
              <MenuItem value="promotion">Khuyến mãi</MenuItem>
              <MenuItem value="product">Sản phẩm</MenuItem>
              <MenuItem value="system">Hệ thống</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Trạng thái đọc</InputLabel>
            <Select
              value={readFilter}
              label="Trạng thái đọc"
              onChange={(e) => {
                setReadFilter(e.target.value);
                setPage(1);
              }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="false">Chưa đọc</MenuItem>
              <MenuItem value="true">Đã đọc</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Tiêu đề</strong></TableCell>
                <TableCell><strong>Nội dung</strong></TableCell>
                <TableCell><strong>Người nhận</strong></TableCell>
                <TableCell><strong>Loại</strong></TableCell>
                <TableCell><strong>Trạng thái</strong></TableCell>
                <TableCell><strong>Ngày tạo</strong></TableCell>
                <TableCell><strong>Thao tác</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="textSecondary">Không có thông báo nào</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                notifications.map((notification) => (
                  <TableRow key={notification.id} hover>
                    <TableCell>{notification.id}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {notification.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {notification.message}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {notification.user_email ? (
                        <Typography variant="body2">
                          {notification.user_name || notification.user_email}
                        </Typography>
                      ) : (
                        <Chip label="Tất cả" size="small" color="default" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getTypeLabel(notification.type)}
                        color={getTypeColor(notification.type) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={notification.is_read ? 'Đã đọc' : 'Chưa đọc'}
                        color={notification.is_read ? 'default' : 'primary'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(notification.created_at).toLocaleString('vi-VN')}
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => {
                          setSelectedNotification(notification);
                          setNotificationFormOpen(true);
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => handleDelete(notification.id)}
                      >
                        <Delete fontSize="small" />
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

      <NotificationForm
        open={notificationFormOpen}
        onClose={() => {
          setNotificationFormOpen(false);
          setSelectedNotification(null);
        }}
        onSave={() => {
          setSuccess(selectedNotification ? 'Cập nhật thông báo thành công' : 'Tạo thông báo thành công');
          loadNotifications();
        }}
        notification={selectedNotification}
      />
    </Box>
  );
};

