import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  FormControlLabel,
  Switch,
  Snackbar,
  Alert as MuiAlert,
  CircularProgress,
} from '@mui/material';
import { adminService } from '../../services/adminService';

interface Notification {
  id: number;
  user_id?: number;
  title: string;
  message: string;
  type: 'order' | 'promotion' | 'product' | 'system';
  is_read: boolean;
  data?: any;
}

interface NotificationFormProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  notification?: Notification | null;
}

export const NotificationForm: React.FC<NotificationFormProps> = ({
  open,
  onClose,
  onSave,
  notification,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    user_id: '',
    title: '',
    message: '',
    type: 'system' as 'order' | 'promotion' | 'product' | 'system',
    is_read: false,
  });

  useEffect(() => {
    if (open) {
      if (notification) {
        setFormData({
          user_id: notification.user_id?.toString() || '',
          title: notification.title,
          message: notification.message,
          type: notification.type,
          is_read: notification.is_read,
        });
      } else {
        setFormData({
          user_id: '',
          title: '',
          message: '',
          type: 'system',
          is_read: false,
        });
      }
      setError('');
    }
  }, [open, notification]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      if (!formData.title || !formData.message || !formData.type) {
        setError('Vui lòng điền đầy đủ thông tin bắt buộc');
        setLoading(false);
        return;
      }

      const notificationData: any = {
        title: formData.title,
        message: formData.message,
        type: formData.type,
        is_read: formData.is_read,
      };

      if (formData.user_id) {
        notificationData.user_id = parseInt(formData.user_id);
      }

      if (notification) {
        await adminService.updateNotification(notification.id, notificationData);
      } else {
        await adminService.createNotification(notificationData);
      }

      onSave();
      onClose();
    } catch (err: any) {
      console.error('Error saving notification:', err);
      setError(err.response?.data?.message || 'Không thể lưu thông báo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {notification ? 'Chỉnh sửa thông báo' : 'Tạo thông báo mới'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Tiêu đề *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              fullWidth
              required
            />

            <TextField
              label="Nội dung *"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              fullWidth
              required
              multiline
              rows={4}
            />

            <FormControl fullWidth required>
              <InputLabel>Loại thông báo *</InputLabel>
              <Select
                value={formData.type}
                label="Loại thông báo *"
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              >
                <MenuItem value="order">Đơn hàng</MenuItem>
                <MenuItem value="promotion">Khuyến mãi</MenuItem>
                <MenuItem value="product">Sản phẩm</MenuItem>
                <MenuItem value="system">Hệ thống</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="User ID (để trống = gửi tất cả)"
              type="number"
              value={formData.user_id}
              onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
              fullWidth
              helperText="Để trống để gửi thông báo cho tất cả người dùng"
            />

            {notification && (
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_read}
                    onChange={(e) => setFormData({ ...formData, is_read: e.target.checked })}
                  />
                }
                label="Đã đọc"
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : notification ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </DialogActions>
      </Dialog>

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
    </>
  );
};

