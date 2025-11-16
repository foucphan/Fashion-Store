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
  Grid,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
  Paper,
  IconButton,
  Typography,
  Chip,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Star,
  StarBorder,
  Image as ImageIcon,
} from '@mui/icons-material';
import { Product, ProductCreateRequest, ProductUpdateRequest } from '../../types/product';
import { adminService } from '../../services/adminService';

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  product?: Product | null;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  open,
  onClose,
  onSave,
  product,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState<ProductCreateRequest>({
    name: '',
    slug: '',
    description: '',
    short_description: '',
    sku: '',
    price: 0,
    sale_price: undefined,
    category_id: 0,
    brand_id: undefined,
    gender: 'unisex',
    featured: false,
    meta_title: '',
    meta_description: '',
  });

  useEffect(() => {
    if (open) {
      loadCategories();
      loadBrands();
      if (product) {
        setFormData({
          name: product.name,
          slug: product.slug,
          description: product.description || '',
          short_description: product.short_description || '',
          sku: product.sku,
          price: product.price,
          sale_price: product.sale_price,
          category_id: product.category_id,
          brand_id: product.brand_id,
          gender: product.gender,
          featured: product.featured,
          meta_title: product.meta_title || '',
          meta_description: product.meta_description || '',
        });
        loadProductImages(product.id);
      } else {
        setFormData({
          name: '',
          slug: '',
          description: '',
          short_description: '',
          sku: '',
          price: 0,
          sale_price: undefined,
          category_id: 0,
          brand_id: undefined,
          gender: 'unisex',
          featured: false,
          meta_title: '',
          meta_description: '',
        });
        setImages([]);
      }
      setError('');
    }
  }, [open, product]);

  const loadCategories = async () => {
    try {
      const data = await adminService.getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const loadBrands = async () => {
    try {
      const data = await adminService.getAllBrands();
      setBrands(data);
    } catch (err) {
      console.error('Error loading brands:', err);
    }
  };

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

  const loadProductImages = async (productId: number) => {
    try {
      const data = await adminService.getProductImages(productId);
      setImages(data || []);
    } catch (err) {
      console.error('Error loading product images:', err);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Nếu chưa có sản phẩm, cần tạo sản phẩm trước
    if (!product) {
      setError('Vui lòng lưu thông tin sản phẩm trước khi upload ảnh');
      event.target.value = '';
      return;
    }

    try {
      setUploadingImage(true);
      await adminService.uploadProductImage(product.id, file, {
        is_primary: images.length === 0, // Đặt làm ảnh chính nếu chưa có ảnh nào
      });
      await loadProductImages(product.id);
    } catch (err: any) {
      console.error('Error uploading image:', err);
      setError(err.response?.data?.message || 'Không thể upload ảnh');
    } finally {
      setUploadingImage(false);
      // Reset input
      event.target.value = '';
    }
  };

  const handleSetPrimaryImage = async (imageId: number) => {
    if (!product) return;

    try {
      await adminService.updateProductImage(product.id, imageId, { is_primary: true });
      await loadProductImages(product.id);
    } catch (err: any) {
      console.error('Error setting primary image:', err);
      setError(err.response?.data?.message || 'Không thể đặt ảnh chính');
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!product || !window.confirm('Bạn có chắc chắn muốn xóa ảnh này?')) return;

    try {
      await adminService.deleteProductImage(product.id, imageId);
      await loadProductImages(product.id);
    } catch (err: any) {
      console.error('Error deleting image:', err);
      setError(err.response?.data?.message || 'Không thể xóa ảnh');
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      if (!formData.name || !formData.sku || !formData.category_id || formData.price <= 0) {
        setError('Vui lòng điền đầy đủ thông tin bắt buộc');
        setLoading(false);
        return;
      }

      if (product) {
        await adminService.updateProduct(product.id, formData as ProductUpdateRequest);
        // Reload images after update
        await loadProductImages(product.id);
      } else {
        await adminService.createProduct(formData);
      }

      onSave();
      onClose();
    } catch (err: any) {
      console.error('Error saving product:', err);
      setError(err.response?.data?.message || 'Không thể lưu sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Tên sản phẩm *"
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
            label="SKU *"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            fullWidth
            required
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Giá *"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              fullWidth
              required
              InputProps={{
                endAdornment: '₫',
              }}
            />

            <TextField
              label="Giá khuyến mãi"
              type="number"
              value={formData.sale_price || ''}
              onChange={(e) => setFormData({ ...formData, sale_price: e.target.value ? parseFloat(e.target.value) : undefined })}
              fullWidth
              InputProps={{
                endAdornment: '₫',
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth required>
              <InputLabel>Danh mục *</InputLabel>
              <Select
                value={formData.category_id}
                label="Danh mục *"
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value as number })}
              >
                <MenuItem value={0}>Chọn danh mục</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Thương hiệu</InputLabel>
              <Select
                value={formData.brand_id || ''}
                label="Thương hiệu"
                onChange={(e) => setFormData({ ...formData, brand_id: e.target.value || undefined })}
              >
                <MenuItem value="">Không có</MenuItem>
                {brands.map((brand) => (
                  <MenuItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <FormControl fullWidth>
            <InputLabel>Giới tính</InputLabel>
            <Select
              value={formData.gender}
              label="Giới tính"
              onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'nam' | 'nu' | 'unisex' })}
            >
              <MenuItem value="nam">Nam</MenuItem>
              <MenuItem value="nu">Nữ</MenuItem>
              <MenuItem value="unisex">Unisex</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Mô tả ngắn"
            value={formData.short_description || ''}
            onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
            fullWidth
            multiline
            rows={2}
          />

          <TextField
            label="Mô tả"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            fullWidth
            multiline
            rows={4}
          />

          <TextField
            label="Meta Title"
            value={formData.meta_title || ''}
            onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
            fullWidth
          />

          <TextField
            label="Meta Description"
            value={formData.meta_description || ''}
            onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
            fullWidth
            multiline
            rows={2}
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              />
            }
            label="Sản phẩm nổi bật"
          />

          {/* Quản lý ảnh sản phẩm */}
          {product && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Quản lý ảnh sản phẩm
              </Typography>
              
              {/* Upload button */}
              <Box sx={{ mb: 2 }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="upload-image"
                  type="file"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
                <label htmlFor="upload-image">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUpload />}
                    disabled={uploadingImage}
                  >
                    {uploadingImage ? 'Đang upload...' : 'Upload ảnh'}
                  </Button>
                </label>
              </Box>

              {/* Image grid */}
              {images.length > 0 ? (
                <Grid container spacing={2}>
                  {images.map((image) => (
                    <Grid item xs={6} sm={4} md={3} key={image.id}>
                      <Paper
                        sx={{
                          position: 'relative',
                          p: 1,
                          border: image.is_primary ? '2px solid' : '1px solid',
                          borderColor: image.is_primary ? 'primary.main' : 'divider',
                        }}
                      >
                        <Box
                          sx={{
                            position: 'relative',
                            width: '100%',
                            paddingTop: '100%',
                            overflow: 'hidden',
                            borderRadius: 1,
                            bgcolor: 'grey.100',
                          }}
                        >
                          <img
                            src={image.image_url}
                            alt={image.alt_text || 'Product image'}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleSetPrimaryImage(image.id)}
                            color={image.is_primary ? 'primary' : 'default'}
                            title={image.is_primary ? 'Ảnh chính' : 'Đặt làm ảnh chính'}
                          >
                            {image.is_primary ? <Star /> : <StarBorder />}
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteImage(image.id)}
                            title="Xóa ảnh"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                        {image.is_primary && (
                          <Chip
                            label="Ảnh chính"
                            size="small"
                            color="primary"
                            sx={{ mt: 1, width: '100%' }}
                          />
                        )}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box
                  sx={{
                    border: '2px dashed',
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center',
                    bgcolor: 'grey.50',
                  }}
                >
                  <ImageIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography color="textSecondary">
                    Chưa có ảnh nào. Hãy upload ảnh đầu tiên.
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Hủy
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : product ? 'Cập nhật' : 'Tạo mới'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

