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
  IconButton,
  CircularProgress,
  Pagination,
  Snackbar,
  Alert as MuiAlert,
  Chip,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Edit,
  Refresh,
  Warning,
} from '@mui/icons-material';
import { adminService } from '../../services/adminService';

interface InventoryItem {
  id: number;
  product_id: number;
  product_name: string;
  product_sku: string;
  size: string;
  color: string;
  stock_quantity: number;
  sku_variant: string;
  price: number;
  sale_price: number | null;
}

export const AdminInventory: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lowStockFilter, setLowStockFilter] = useState<string>('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [newStockQuantity, setNewStockQuantity] = useState<number>(0);

  useEffect(() => {
    loadInventory();
  }, [page, lowStockFilter]);

  const loadInventory = async () => {
    try {
      setLoading(true);
      setError('');
      const params: any = { page, limit: 50 };
      if (lowStockFilter === 'true') {
        params.low_stock = 'true';
      }
      const response = await adminService.getAllInventory(params);
      setInventory(response.data.inventory);
      setTotalPages(response.data.pagination.pages);
    } catch (err: any) {
      console.error('Error loading inventory:', err);
      setError(err.response?.data?.message || 'Không thể tải danh sách kho hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditDialog = (item: InventoryItem) => {
    setSelectedItem(item);
    setNewStockQuantity(item.stock_quantity);
    setEditDialogOpen(true);
  };

  const handleUpdateStock = async () => {
    if (!selectedItem) return;

    try {
      setLoading(true);
      await adminService.updateStockQuantity(selectedItem.id, newStockQuantity);
      setSuccess('Cập nhật số lượng tồn kho thành công');
      setEditDialogOpen(false);
      setSelectedItem(null);
      loadInventory();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể cập nhật số lượng tồn kho');
    } finally {
      setLoading(false);
    }
  };

  const getStockColor = (quantity: number) => {
    if (quantity === 0) return 'error';
    if (quantity <= 10) return 'warning';
    return 'success';
  };

  const getStockLabel = (quantity: number) => {
    if (quantity === 0) return 'Hết hàng';
    if (quantity <= 10) return 'Sắp hết';
    return 'Còn hàng';
  };

  if (loading && inventory.length === 0) {
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
          Quản lý kho hàng
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Lọc</InputLabel>
            <Select
              value={lowStockFilter}
              label="Lọc"
              onChange={(e) => {
                setLowStockFilter(e.target.value);
                setPage(1);
              }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="true">Sắp hết hàng (≤10)</MenuItem>
            </Select>
          </FormControl>
          <Button
            startIcon={<Refresh />}
            onClick={loadInventory}
            variant="outlined"
            disabled={loading}
          >
            Làm mới
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

      <Paper sx={{ borderRadius: 2, boxShadow: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell><strong>Sản phẩm</strong></TableCell>
                <TableCell><strong>SKU</strong></TableCell>
                <TableCell><strong>Size</strong></TableCell>
                <TableCell><strong>Màu</strong></TableCell>
                <TableCell><strong>Số lượng tồn</strong></TableCell>
                <TableCell><strong>Trạng thái</strong></TableCell>
                <TableCell><strong>Giá</strong></TableCell>
                <TableCell><strong>Thao tác</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="textSecondary">Không có dữ liệu kho hàng</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                inventory.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {item.product_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {item.product_id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{item.sku_variant || item.product_sku}</Typography>
                    </TableCell>
                    <TableCell>{item.size || '-'}</TableCell>
                    <TableCell>{item.color || '-'}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight="bold">
                          {item.stock_quantity}
                        </Typography>
                        {item.stock_quantity <= 10 && (
                          <Warning color="warning" fontSize="small" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStockLabel(item.stock_quantity)}
                        color={getStockColor(item.stock_quantity) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {item.sale_price ? (
                          <>
                            <Typography component="span" sx={{ textDecoration: 'line-through', color: 'text.secondary', mr: 1 }}>
                              {item.price.toLocaleString('vi-VN')} ₫
                            </Typography>
                            <Typography component="span" color="error" fontWeight="bold">
                              {item.sale_price.toLocaleString('vi-VN')} ₫
                            </Typography>
                          </>
                        ) : (
                          <>{item.price.toLocaleString('vi-VN')} ₫</>
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleOpenEditDialog(item)}
                        title="Chỉnh sửa số lượng"
                      >
                        <Edit fontSize="small" />
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

      {/* Edit Stock Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Cập nhật số lượng tồn kho</DialogTitle>
        <DialogContent>
          {selectedItem && (
            <Box sx={{ minWidth: 400, mt: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Sản phẩm</Typography>
                <Typography variant="body1" fontWeight="medium">{selectedItem.product_name}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Size / Màu</Typography>
                <Typography variant="body1">
                  {selectedItem.size || '-'} / {selectedItem.color || '-'}
                </Typography>
              </Box>
              <TextField
                label="Số lượng tồn kho"
                type="number"
                value={newStockQuantity}
                onChange={(e) => setNewStockQuantity(parseInt(e.target.value) || 0)}
                fullWidth
                required
                inputProps={{ min: 0 }}
                helperText="Nhập số lượng tồn kho mới"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} disabled={loading}>
            Hủy
          </Button>
          <Button onClick={handleUpdateStock} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Cập nhật'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
