import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControlLabel,
  Switch,
  Snackbar,
  Alert as MuiAlert,
  CircularProgress,
} from '@mui/material';
import { adminService } from '../../services/adminService';

interface Brand {
  id: number;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  website?: string;
  is_active: boolean;
}

interface BrandFormProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  brand?: Brand | null;
}

export const BrandForm: React.FC<BrandFormProps> = ({
  open,
  onClose,
  onSave,
  brand,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    logo: '',
    description: '',
    website: '',
    is_active: true,
  });

  useEffect(() => {
    if (open) {
      if (brand) {
        setFormData({
          name: brand.name,
          slug: brand.slug,
          logo: brand.logo || '',
          description: brand.description || '',
          website: brand.website || '',
          is_active: brand.is_active,
        });
      } else {
        setFormData({
          name: '',
          slug: '',
          logo: '',
          description: '',
          website: '',
          is_active: true,
        });
      }
      setError('');
    }
  }, [open, brand]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: formData.slug || generateSlug(name),
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      if (!formData.name || !formData.slug) {
        setError('Vui lòng điền đầy đủ thông tin bắt buộc');
        setLoading(false);
        return;
      }

      const brandData: any = {
        name: formData.name,
        slug: formData.slug,
        logo: formData.logo || null,
        description: formData.description || null,
        website: formData.website || null,
        is_active: formData.is_active,
      };

      if (brand) {
        await adminService.updateBrand(brand.id, brandData);
      } else {
        await adminService.createBrand(brandData);
      }

      onSave();
      onClose();
    } catch (err: any) {
      console.error('Error saving brand:', err);
      setError(err.response?.data?.message || 'Không thể lưu thương hiệu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {brand ? 'Chỉnh sửa thương hiệu' : 'Thêm thương hiệu mới'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Tên thương hiệu *"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              fullWidth
              required
            />

            <TextField
              label="Slug *"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              fullWidth
              required
              helperText="URL-friendly version of the name"
            />

            <TextField
              label="URL Logo"
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              fullWidth
            />

            <TextField
              label="Website"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              fullWidth
              placeholder="https://example.com"
            />

            <TextField
              label="Mô tả"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
              }
              label="Hoạt động"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : brand ? 'Cập nhật' : 'Tạo mới'}
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

