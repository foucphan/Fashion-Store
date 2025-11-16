import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Chip,
  Button,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  FilterList,
  Search,
  Sort,
  Clear,
} from '@mui/icons-material';
import { Product, ProductListParams } from '../../types/product';
import { Category } from '../../types/category';
import { Brand } from '../../types/brand';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { brandService } from '../../services/brandService';
import { ProductGrid } from './ProductGrid';

interface ProductListProps {
  initialParams?: ProductListParams;
  onProductClick?: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  initialParams = {},
  onProductClick,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<ProductListParams>({
    page: 1,
    limit: 12,
    ...initialParams,
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 12,
    total: 0,
    total_pages: 0,
  });

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load products when filters change
  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadInitialData = async () => {
    try {
      const [categoriesData, brandsData] = await Promise.all([
        categoryService.getAllCategories(),
        brandService.getAllBrands(),
      ]);
      setCategories(categoriesData);
      setBrands(brandsData);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts(filters);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof ProductListParams, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filter changes
    }));
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
    });
  };

  const handleProductClick = (product: Product) => {
    onProductClick?.(product);
  };

  const FilterSection = () => (
    <Card sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <FilterList sx={{ mr: 1 }} />
        <Typography variant="h6">Bộ lọc</Typography>
        <Button
          startIcon={<Clear />}
          onClick={handleClearFilters}
          sx={{ ml: 'auto' }}
          size="small"
        >
          Xóa bộ lọc
        </Button>
      </Box>

      <Grid container spacing={2}>
        {/* Search */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Tìm kiếm"
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Grid>

        {/* Category */}
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Danh mục</InputLabel>
            <Select
              value={filters.category_id || ''}
              onChange={(e) => handleFilterChange('category_id', e.target.value || undefined)}
              label="Danh mục"
            >
              <MenuItem value="">Tất cả danh mục</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Brand */}
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Thương hiệu</InputLabel>
            <Select
              value={filters.brand_id || ''}
              onChange={(e) => handleFilterChange('brand_id', e.target.value || undefined)}
              label="Thương hiệu"
            >
              <MenuItem value="">Tất cả thương hiệu</MenuItem>
              {brands.map((brand) => (
                <MenuItem key={brand.id} value={brand.id}>
                  {brand.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Gender */}
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Giới tính</InputLabel>
            <Select
              value={filters.gender || ''}
              onChange={(e) => handleFilterChange('gender', e.target.value || undefined)}
              label="Giới tính"
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="nam">Nam</MenuItem>
              <MenuItem value="nu">Nữ</MenuItem>
              <MenuItem value="unisex">Unisex</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Price Range */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Giá tối thiểu"
            type="number"
            value={filters.min_price || ''}
            onChange={(e) => handleFilterChange('min_price', e.target.value ? Number(e.target.value) : undefined)}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Giá tối đa"
            type="number"
            value={filters.max_price || ''}
            onChange={(e) => handleFilterChange('max_price', e.target.value ? Number(e.target.value) : undefined)}
          />
        </Grid>

        {/* Sort */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Sắp xếp theo</InputLabel>
            <Select
              value={`${filters.sort_by || 'created_at'}_${filters.sort_order || 'DESC'}`}
              onChange={(e) => {
                const [sort_by, sort_order] = e.target.value.split('_');
                handleFilterChange('sort_by', sort_by);
                handleFilterChange('sort_order', sort_order);
              }}
              label="Sắp xếp theo"
            >
              <MenuItem value="created_at_DESC">Mới nhất</MenuItem>
              <MenuItem value="created_at_ASC">Cũ nhất</MenuItem>
              <MenuItem value="price_ASC">Giá thấp đến cao</MenuItem>
              <MenuItem value="price_DESC">Giá cao đến thấp</MenuItem>
              <MenuItem value="name_ASC">Tên A-Z</MenuItem>
              <MenuItem value="name_DESC">Tên Z-A</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Featured */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label="Sản phẩm nổi bật"
              color={filters.featured ? 'primary' : 'default'}
              onClick={() => handleFilterChange('featured', filters.featured ? undefined : true)}
              clickable
            />
          </Box>
        </Grid>
      </Grid>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Sản phẩm
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Tìm kiếm và khám phá các sản phẩm thời trang đa dạng
        </Typography>
      </Box>

      {/* Filters */}
      {isMobile ? (
        <>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setFilterDrawerOpen(true)}
              fullWidth
            >
              Bộ lọc
            </Button>
            <Button
              variant="outlined"
              startIcon={<Sort />}
              fullWidth
            >
              Sắp xếp
            </Button>
          </Box>

          <Drawer
            anchor="right"
            open={filterDrawerOpen}
            onClose={() => setFilterDrawerOpen(false)}
            sx={{ '& .MuiDrawer-paper': { width: 300, p: 2 } }}
          >
            <FilterSection />
          </Drawer>
        </>
      ) : (
        <FilterSection />
      )}

      {/* Results Summary */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Hiển thị {products.length} trong {pagination.total} sản phẩm
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Trang {pagination.current_page} / {pagination.total_pages}
        </Typography>
      </Box>

      {/* Product Grid */}
      <ProductGrid
        products={products}
        loading={loading}
        onViewDetails={handleProductClick}
      />

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pagination.total_pages}
            page={pagination.current_page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Container>
  );
};
