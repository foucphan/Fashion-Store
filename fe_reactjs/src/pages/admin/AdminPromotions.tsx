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
import { CouponForm } from '../../components/admin/CouponForm';

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
  used_count: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const AdminPromotions: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeFilter, setActiveFilter] = useState<string>('');
  const [couponFormOpen, setCouponFormOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    loadCoupons();
  }, [page, activeFilter]);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      setError('');
      const params: any = { page, limit: 50 };
      if (activeFilter !== '') {
        params.is_active = activeFilter;
      }
      const response = await adminService.getAllCoupons(params);
      setCoupons(response.data.coupons);
      setTotalPages(response.data.pagination.pages);
    } catch (err: any) {
      console.error('Error loading coupons:', err);
      setError(err.response?.data?.message || 'Không thể tải danh sách mã giảm giá');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa mã giảm giá này?')) {
      return;
    }

    try {
      await adminService.deleteCoupon(id);
      setSuccess('Xóa mã giảm giá thành công');
      loadCoupons();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể xóa mã giảm giá');
    }
  };

  const formatDiscount = (coupon: Coupon) => {
    return `${coupon.value}%`;
  };

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const isActive = (coupon: Coupon) => {
    const now = new Date();
    return coupon.is_active && 
           new Date(coupon.start_date) <= now && 
           new Date(coupon.end_date) >= now;
  };

  if (loading && coupons.length === 0) {
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
          Quản lý khuyến mãi
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            startIcon={<Refresh />}
            onClick={loadCoupons}
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
              setSelectedCoupon(null);
              setCouponFormOpen(true);
            }}
          >
            Tạo mã giảm giá
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
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={activeFilter}
              label="Trạng thái"
              onChange={(e) => {
                setActiveFilter(e.target.value);
                setPage(1);
              }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="true">Đang hoạt động</MenuItem>
              <MenuItem value="false">Không hoạt động</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell><strong>Mã</strong></TableCell>
                <TableCell><strong>Tên</strong></TableCell>
                <TableCell><strong>Loại</strong></TableCell>
                <TableCell><strong>Giá trị</strong></TableCell>
                <TableCell><strong>Đơn tối thiểu</strong></TableCell>
                <TableCell><strong>Giới hạn</strong></TableCell>
                <TableCell><strong>Đã dùng</strong></TableCell>
                <TableCell><strong>Thời gian</strong></TableCell>
                <TableCell><strong>Trạng thái</strong></TableCell>
                <TableCell><strong>Thao tác</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {coupons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                    <Typography color="textSecondary">Không có mã giảm giá nào</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                coupons.map((coupon) => (
                  <TableRow key={coupon.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold" color="primary">
                        {coupon.code}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {coupon.name}
                      </Typography>
                      {coupon.description && (
                        <Typography variant="caption" color="text.secondary">
                          {coupon.description}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip label="Phần trăm" size="small" color="primary" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold" color="success.main">
                        {formatDiscount(coupon)}
                      </Typography>
                      {coupon.max_discount_amount && (
                        <Typography variant="caption" color="text.secondary">
                          Tối đa: {coupon.max_discount_amount.toLocaleString('vi-VN')} ₫
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {coupon.min_order_amount > 0 ? (
                        <Typography variant="body2">
                          {coupon.min_order_amount.toLocaleString('vi-VN')} ₫
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Không có
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {coupon.usage_limit ? (
                        <Typography variant="body2">{coupon.usage_limit}</Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Không giới hạn
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {coupon.used_count} / {coupon.usage_limit || '∞'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(coupon.start_date).toLocaleDateString('vi-VN')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        → {new Date(coupon.end_date).toLocaleDateString('vi-VN')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {isExpired(coupon.end_date) ? (
                        <Chip label="Hết hạn" color="error" size="small" />
                      ) : isActive(coupon) ? (
                        <Chip label="Đang hoạt động" color="success" size="small" />
                      ) : (
                        <Chip label="Chưa kích hoạt" color="default" size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => {
                          setSelectedCoupon(coupon);
                          setCouponFormOpen(true);
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => handleDelete(coupon.id)}
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

      <CouponForm
        open={couponFormOpen}
        onClose={() => {
          setCouponFormOpen(false);
          setSelectedCoupon(null);
        }}
        onSave={() => {
          setSuccess(selectedCoupon ? 'Cập nhật mã giảm giá thành công' : 'Tạo mã giảm giá thành công');
          loadCoupons();
        }}
        coupon={selectedCoupon}
      />
    </Box>
  );
};

