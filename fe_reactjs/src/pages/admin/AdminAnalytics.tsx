import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Chip,
  TextField,
} from '@mui/material';
import {
  Download,
  Inventory,
  AttachMoney,
} from '@mui/icons-material';
import { adminService } from '../../services/adminService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`report-tabpanel-${index}`}
      aria-labelledby={`report-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export const AdminAnalytics: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [dateType, setDateType] = useState<'day' | 'month' | 'year'>('day');
  const [dateValue, setDateValue] = useState<string>('');
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (dateValue) {
      loadReports();
    }
  }, [tabValue, dateValue]);

  const loadReports = async () => {
    if (!dateValue) return;

    try {
      setLoading(true);
      if (tabValue === 0) {
        const data = await adminService.getInventoryReport(dateValue);
        setInventoryData(data);
      } else {
        const data = await adminService.getRevenueReport(dateValue);
        setRevenueData(data);
      }
    } catch (err: any) {
      console.error('Error loading reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!dateValue) {
      alert('Vui lòng chọn ngày/tháng/năm');
      return;
    }

    try {
      setExporting(true);
      let blob: Blob;
      let fileName: string;

      if (tabValue === 0) {
        blob = await adminService.exportInventoryExcel(dateValue);
        fileName = `bao_cao_ton_kho_${dateValue}.xlsx`;
      } else {
        blob = await adminService.exportRevenueExcel(dateValue);
        fileName = `bao_cao_doanh_thu_${dateValue}.xlsx`;
      }

      // Tạo link download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Error exporting:', err);
      alert('Không thể xuất file Excel');
    } finally {
      setExporting(false);
    }
  };

  const getDateInputType = () => {
    switch (dateType) {
      case 'day':
        return 'date';
      case 'month':
        return 'month';
      case 'year':
        return 'number';
      default:
        return 'date';
    }
  };

  const getDateInputValue = () => {
    if (!dateValue) return '';
    if (dateType === 'year') {
      return dateValue;
    }
    return dateValue;
  };

  const handleDateChange = (value: string) => {
    if (dateType === 'year') {
      if (value.length <= 4) {
        setDateValue(value);
      }
    } else {
      setDateValue(value);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Báo cáo thống kê
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Loại</InputLabel>
            <Select
              value={dateType}
              label="Loại"
              onChange={(e) => {
                setDateType(e.target.value as any);
                setDateValue('');
              }}
            >
              <MenuItem value="day">Theo ngày</MenuItem>
              <MenuItem value="month">Theo tháng</MenuItem>
              <MenuItem value="year">Theo năm</MenuItem>
            </Select>
          </FormControl>
          {dateType === 'year' ? (
            <TextField
              size="small"
              label="Năm"
              type="number"
              value={dateValue}
              onChange={(e) => handleDateChange(e.target.value)}
              inputProps={{ min: 2000, max: 2100 }}
              sx={{ width: 120 }}
            />
          ) : (
            <TextField
              size="small"
              label={dateType === 'day' ? 'Ngày' : 'Tháng'}
              type={dateType === 'day' ? 'date' : 'month'}
              value={dateValue}
              onChange={(e) => handleDateChange(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          )}
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={handleExport}
            disabled={!dateValue || exporting}
          >
            {exporting ? <CircularProgress size={20} /> : 'Xuất Excel'}
          </Button>
        </Box>
      </Box>

      <Paper sx={{ borderRadius: 2, boxShadow: 2 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab icon={<Inventory />} iconPosition="start" label="Báo cáo tồn kho" />
          <Tab icon={<AttachMoney />} iconPosition="start" label="Báo cáo doanh thu" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 2 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : !dateValue ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="textSecondary">Vui lòng chọn ngày/tháng/năm để xem báo cáo</Typography>
              </Box>
            ) : inventoryData.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="textSecondary">Không có dữ liệu tồn kho</Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.100' }}>
                      <TableCell><strong>Tên sản phẩm</strong></TableCell>
                      <TableCell><strong>SKU</strong></TableCell>
                      <TableCell><strong>Size</strong></TableCell>
                      <TableCell><strong>Màu</strong></TableCell>
                      <TableCell><strong>Số lượng tồn</strong></TableCell>
                      <TableCell><strong>SKU biến thể</strong></TableCell>
                      <TableCell><strong>Giá</strong></TableCell>
                      <TableCell><strong>Giá khuyến mãi</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {inventoryData.map((item, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{item.product_name}</TableCell>
                        <TableCell>{item.product_sku}</TableCell>
                        <TableCell>{item.size}</TableCell>
                        <TableCell>{item.color}</TableCell>
                        <TableCell>
                          <Chip
                            label={item.stock_quantity}
                            color={item.stock_quantity === 0 ? 'error' : item.stock_quantity <= 10 ? 'warning' : 'success'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{item.sku_variant}</TableCell>
                        <TableCell>{item.price.toLocaleString('vi-VN')} ₫</TableCell>
                        <TableCell>
                          {item.sale_price ? `${item.sale_price.toLocaleString('vi-VN')} ₫` : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 2 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : !dateValue ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="textSecondary">Vui lòng chọn ngày/tháng/năm để xem báo cáo</Typography>
              </Box>
            ) : revenueData.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="textSecondary">Không có dữ liệu doanh thu</Typography>
              </Box>
            ) : (
              <>
                <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Tổng kết
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    <Box>
                      <Typography variant="caption" color="textSecondary">Tổng số đơn hàng</Typography>
                      <Typography variant="h6" fontWeight="bold">
                        {revenueData.reduce((sum, item) => sum + item.order_count, 0)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="textSecondary">Tổng doanh thu</Typography>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        {revenueData.reduce((sum, item) => sum + item.total_revenue, 0).toLocaleString('vi-VN')} ₫
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="textSecondary">Tổng giảm giá</Typography>
                      <Typography variant="h6" fontWeight="bold" color="secondary">
                        {revenueData.reduce((sum, item) => sum + item.total_discount, 0).toLocaleString('vi-VN')} ₫
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'grey.100' }}>
                        <TableCell><strong>{dateType === 'year' ? 'Tháng' : dateType === 'month' ? 'Ngày' : 'Giờ'}</strong></TableCell>
                        <TableCell><strong>Số đơn hàng</strong></TableCell>
                        <TableCell><strong>Tổng doanh thu</strong></TableCell>
                        <TableCell><strong>Tổng giá trị</strong></TableCell>
                        <TableCell><strong>Tổng giảm giá</strong></TableCell>
                        <TableCell><strong>Phí vận chuyển</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {revenueData.map((item, index) => (
                        <TableRow key={index} hover>
                          <TableCell>{item.period_label}</TableCell>
                          <TableCell>{item.order_count}</TableCell>
                          <TableCell>
                            <Typography fontWeight="bold" color="primary">
                              {item.total_revenue.toLocaleString('vi-VN')} ₫
      </Typography>
                          </TableCell>
                          <TableCell>{item.total_amount.toLocaleString('vi-VN')} ₫</TableCell>
                          <TableCell>{item.total_discount.toLocaleString('vi-VN')} ₫</TableCell>
                          <TableCell>{item.total_shipping.toLocaleString('vi-VN')} ₫</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
};
