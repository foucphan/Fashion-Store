import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  ShoppingBag,
  ShoppingCart,
  People,
  AttachMoney,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
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

interface RevenueData {
  date: string;
  dateLabel: string;
  revenue: number;
  orderCount: number;
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [period, setPeriod] = useState<number>(30);

  useEffect(() => {
    loadStats();
    loadRevenueChart();
  }, [period]);

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

  const loadRevenueChart = async () => {
    try {
      setChartLoading(true);
      const data = await adminService.getRevenueChart(period);
      setRevenueData(data);
    } catch (err: any) {
      console.error('Error loading revenue chart:', err);
    } finally {
      setChartLoading(false);
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                Biểu đồ doanh thu
              </Typography>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Khoảng thời gian</InputLabel>
                <Select
                  value={period}
                  label="Khoảng thời gian"
                  onChange={(e) => setPeriod(e.target.value as number)}
                >
                  <MenuItem value={7}>7 ngày gần nhất</MenuItem>
                  <MenuItem value={30}>30 ngày gần nhất</MenuItem>
                  <MenuItem value={90}>90 ngày gần nhất</MenuItem>
                  <MenuItem value={180}>180 ngày gần nhất</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {chartLoading ? (
              <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            ) : revenueData.length === 0 ? (
              <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="textSecondary">Không có dữ liệu doanh thu</Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="dateLabel" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => {
                      if (name === 'revenue') {
                        return [`${value.toLocaleString('vi-VN')} ₫`, 'Doanh thu'];
                      }
                      return [value, 'Số đơn hàng'];
                    }}
                    labelFormatter={(label) => `Ngày: ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#1976d2" 
                    strokeWidth={2}
                    name="Doanh thu"
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="orderCount" 
                    stroke="#dc004e" 
                    strokeWidth={2}
                    name="Số đơn hàng"
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
            {revenueData.length > 0 && (
              <Box sx={{ mt: 2, display: 'flex', gap: 3, justifyContent: 'center' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" color="textSecondary">
                    Tổng doanh thu ({period} ngày)
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    {revenueData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString('vi-VN')} ₫
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" color="textSecondary">
                    Tổng số đơn hàng
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="secondary">
                    {revenueData.reduce((sum, item) => sum + item.orderCount, 0)}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" color="textSecondary">
                    Trung bình/ngày
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {Math.round(revenueData.reduce((sum, item) => sum + item.revenue, 0) / revenueData.length).toLocaleString('vi-VN')} ₫
                  </Typography>
                </Box>
              </Box>
            )}
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

