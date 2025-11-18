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
  Grid,
} from '@mui/material';
import { adminService } from '../../services/adminService';

interface Coupon {
  id: number;
  code: string;
  name: string;
  description?: string;
  type: 'percentage';
  value: number;
  min_order_amount: number;
  max_discount_amount?: number;
  usage_limit?: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

interface CouponFormProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  coupon?: Coupon | null;
}

export const CouponForm: React.FC<CouponFormProps> = ({
  open,
  onClose,
  onSave,
  coupon,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    type: 'percentage' as 'percentage',
    value: 0,
    min_order_amount: 0,
    max_discount_amount: '',
    usage_limit: '',
    start_date: '',
    end_date: '',
    is_active: true,
  });

  useEffect(() => {
    if (open) {
      if (coupon) {
        setFormData({
          code: coupon.code,
          name: coupon.name,
          description: coupon.description || '',
          type: coupon.type,
          value: coupon.value,
          min_order_amount: coupon.min_order_amount,
          max_discount_amount: coupon.max_discount_amount?.toString() || '',
          usage_limit: coupon.usage_limit?.toString() || '',
          start_date: coupon.start_date.split('T')[0],
          end_date: coupon.end_date.split('T')[0],
          is_active: coupon.is_active,
        });
      } else {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        
        setFormData({
          code: '',
          name: '',
          description: '',
          type: 'percentage',
          value: 0,
          min_order_amount: 0,
          max_discount_amount: '',
          usage_limit: '',
          start_date: tomorrow.toISOString().split('T')[0],
          end_date: nextMonth.toISOString().split('T')[0],
          is_active: true,
        });
      }
      setError('');
    }
  }, [open, coupon]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      if (!formData.code || !formData.name || !formData.type || !formData.start_date || !formData.end_date) {
        setError('Vui lòng điền đầy đủ thông tin bắt buộc');
        setLoading(false);
        return;
      }

      if (formData.value <= 0 || formData.value > 100) {
        setError('Phần trăm giảm giá phải từ 1% đến 100%');
        setLoading(false);
        return;
      }

      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      if (endDate <= startDate) {
        setError('Ngày kết thúc phải sau ngày bắt đầu');
        setLoading(false);
        return;
      }

      const couponData: any = {
        code: formData.code.toUpperCase(),
        name: formData.name,
        description: formData.description || null,
        type: 'percentage',
        value: formData.value,
        min_order_amount: formData.min_order_amount || 0,
        max_discount_amount: formData.max_discount_amount ? parseFloat(formData.max_discount_amount) : null,
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
        start_date: formData.start_date,
        end_date: formData.end_date,
        is_active: formData.is_active,
      };

      if (coupon) {
        await adminService.updateCoupon(coupon.id, couponData);
      } else {
        await adminService.createCoupon(couponData);
      }

      onSave();
      onClose();
    } catch (err: any) {
      console.error('Error saving coupon:', err);
      setError(err.response?.data?.message || 'Không thể lưu mã giảm giá');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {coupon ? 'Chỉnh sửa mã giảm giá' : 'Tạo mã giảm giá mới'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Mã giảm giá *"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  fullWidth
                  required
                  helperText="Mã sẽ được chuyển thành chữ hoa"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phần trăm giảm giá (%) *"
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                  fullWidth
                  required
                  inputProps={{ min: 1, max: 100 }}
                  helperText="Nhập phần trăm giảm giá (1-100%)"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Tên mã giảm giá *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Mô tả"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  fullWidth
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Giảm tối đa (₫)"
                  type="number"
                  value={formData.max_discount_amount}
                  onChange={(e) => setFormData({ ...formData, max_discount_amount: e.target.value })}
                  fullWidth
                  inputProps={{ min: 0 }}
                  helperText="Giới hạn số tiền giảm tối đa (tùy chọn)"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Đơn hàng tối thiểu (₫)"
                  type="number"
                  value={formData.min_order_amount}
                  onChange={(e) => setFormData({ ...formData, min_order_amount: parseFloat(e.target.value) || 0 })}
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Giới hạn sử dụng"
                  type="number"
                  value={formData.usage_limit}
                  onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                  fullWidth
                  inputProps={{ min: 1 }}
                  helperText="Để trống = không giới hạn"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Ngày bắt đầu *"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Ngày kết thúc *"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    />
                  }
                  label="Kích hoạt"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : coupon ? 'Cập nhật' : 'Tạo mới'}
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

