import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  ShoppingBag,
  ShoppingCart,
  People,
  AttachMoney,
} from '@mui/icons-material';
import { adminService, AdminStats } from '../../services/adminService';

const StatCard = ({ title, value, icon }: any) => (
  <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 2 }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: 'primary.light',
            color: 'primary.contrastText',
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminService.getStats();
      setStats(data);
    } catch (err: any) {
      console.error('Error loading stats:', err);
      setError(err.response?.data?.message || 'Không thể tải thống kê');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold" mb={3}>
        Dashboard
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
          <StatCard
            title="Tổng sản phẩm"
            value={stats?.totalProducts.toLocaleString('vi-VN') || '0'}
            icon={<ShoppingBag />}
          />
          <StatCard
            title="Đơn hàng"
            value={stats?.totalOrders.toLocaleString('vi-VN') || '0'}
            icon={<ShoppingCart />}
          />
          <StatCard
            title="Người dùng"
            value={stats?.totalUsers.toLocaleString('vi-VN') || '0'}
            icon={<People />}
          />
          <StatCard
            title="Doanh thu"
            value={`${(stats?.totalRevenue || 0).toLocaleString('vi-VN')} ₫`}
            icon={<AttachMoney />}
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2, flex: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Biểu đồ doanh thu
            </Typography>
            <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="textSecondary">Biểu đồ sẽ được hiển thị ở đây</Typography>
            </Box>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2, flex: 1 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Thống kê tổng quan
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Tổng sản phẩm: <strong>{stats?.totalProducts || 0}</strong>
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Tổng đơn hàng: <strong>{stats?.totalOrders || 0}</strong>
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Tổng người dùng: <strong>{stats?.totalUsers || 0}</strong>
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Tổng doanh thu: <strong>{(stats?.totalRevenue || 0).toLocaleString('vi-VN')} ₫</strong>
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

