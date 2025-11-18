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
  Snackbar,
  Alert as MuiAlert,
  Chip,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Refresh,
} from '@mui/icons-material';
import { adminService } from '../../services/adminService';
import { BrandForm } from '../../components/admin/BrandForm';

interface Brand {
  id: number;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  website?: string;
  is_active: boolean;
  product_count?: number;
}

export const AdminBrands: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [brandFormOpen, setBrandFormOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminService.getAllBrands();
      setBrands(data);
    } catch (err: any) {
      console.error('Error loading brands:', err);
      setError(err.response?.data?.message || 'Không thể tải danh sách thương hiệu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thương hiệu này?')) {
      return;
    }

    try {
      await adminService.deleteBrand(id);
      setSuccess('Xóa thương hiệu thành công');
      loadBrands();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể xóa thương hiệu');
    }
  };

  if (loading && brands.length === 0) {
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
          Quản lý thương hiệu
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            startIcon={<Refresh />}
            onClick={loadBrands}
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
              setSelectedBrand(null);
              setBrandFormOpen(true);
            }}
          >
          Thêm thương hiệu
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
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Tên thương hiệu</strong></TableCell>
                <TableCell><strong>Slug</strong></TableCell>
                <TableCell><strong>Số sản phẩm</strong></TableCell>
                <TableCell><strong>Website</strong></TableCell>
                <TableCell><strong>Trạng thái</strong></TableCell>
                <TableCell><strong>Thao tác</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {brands.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="textSecondary">Không có thương hiệu nào</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                brands.map((brand) => (
                  <TableRow key={brand.id} hover>
                    <TableCell>{brand.id}</TableCell>
                    <TableCell>{brand.name}</TableCell>
                    <TableCell>{brand.slug}</TableCell>
                    <TableCell>{brand.product_count || 0}</TableCell>
                    <TableCell>{brand.website || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={brand.is_active ? 'Hoạt động' : 'Ngừng hoạt động'}
                        color={brand.is_active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => {
                          setSelectedBrand(brand);
                          setBrandFormOpen(true);
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => handleDelete(brand.id)}
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
      </Paper>

      <BrandForm
        open={brandFormOpen}
        onClose={() => {
          setBrandFormOpen(false);
          setSelectedBrand(null);
        }}
        onSave={() => {
          setSuccess(selectedBrand ? 'Cập nhật thương hiệu thành công' : 'Tạo thương hiệu thành công');
          loadBrands();
        }}
        brand={selectedBrand}
      />
    </Box>
  );
};
