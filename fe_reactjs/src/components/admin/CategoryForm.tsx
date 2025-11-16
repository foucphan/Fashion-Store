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

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent_id?: number;
  is_active: boolean;
  sort_order: number;
}

interface CategoryFormProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  category?: Category | null;
  categories: Category[];
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  open,
  onClose,
  onSave,
  category,
  categories,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    parent_id: '',
    sort_order: 0,
    is_active: true,
  });

  useEffect(() => {
    if (open) {
      if (category) {
        setFormData({
          name: category.name,
          slug: category.slug,
          description: category.description || '',
          image: category.image || '',
          parent_id: category.parent_id?.toString() || '',
          sort_order: category.sort_order,
          is_active: category.is_active,
        });
      } else {
        setFormData({
          name: '',
          slug: '',
          description: '',
          image: '',
          parent_id: '',
          sort_order: 0,
          is_active: true,
        });
      }
      setError('');
    }
  }, [open, category]);

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

      const categoryData: any = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description || null,
        image: formData.image || null,
        parent_id: formData.parent_id ? parseInt(formData.parent_id) : null,
        sort_order: formData.sort_order,
        is_active: formData.is_active,
      };

      if (category) {
        await adminService.updateCategory(category.id, categoryData);
      } else {
        await adminService.createCategory(categoryData);
      }

      onSave();
      onClose();
    } catch (err: any) {
      console.error('Error saving category:', err);
      setError(err.response?.data?.message || 'Không thể lưu danh mục');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {category ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Tên danh mục *"
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
              label="Mô tả"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />

            <TextField
              label="URL hình ảnh"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Danh mục cha</InputLabel>
              <Select
                value={formData.parent_id}
                label="Danh mục cha"
                onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
              >
                <MenuItem value="">Không có</MenuItem>
                {categories
                  .filter((c) => !category || c.id !== category.id)
                  .map((cat) => (
                    <MenuItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <TextField
              label="Thứ tự"
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
              fullWidth
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
            {loading ? <CircularProgress size={24} /> : category ? 'Cập nhật' : 'Tạo mới'}
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

