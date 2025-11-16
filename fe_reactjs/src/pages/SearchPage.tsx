import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Button,
  Breadcrumbs,
  Link,
  Alert,
} from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
// Temporary imports - will be fixed when TypeScript compilation is resolved
// import { Product, ProductListParams } from '../../types/product';
// import { Category } from '../../types/category';
// import { Brand } from '../../types/brand';
// import { productService } from '../../services/productService';
// import { categoryService } from '../../services/categoryService';
// import { brandService } from '../../services/brandService';
import { ProductGrid } from '../components/product/ProductGrid';
import { SearchBar } from '../components/search/SearchBar';
import { QuickSearch } from '../components/search/QuickSearch';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 12,
    total: 0,
    total_pages: 0,
  });

  const query = searchParams.get('q') || '';
  const category = searchParams.get('category');
  const brand = searchParams.get('brand');
  const gender = searchParams.get('gender');
  const minPrice = searchParams.get('min_price');
  const maxPrice = searchParams.get('max_price');
  const sortBy = searchParams.get('sort_by') || 'created_at';
  const sortOrder = searchParams.get('sort_order') || 'DESC';

  useEffect(() => {
    if (query) {
      loadSearchResults();
    }
  }, [query, category, brand, gender, minPrice, maxPrice, sortBy, sortOrder]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Mock data for now
      setCategories([]);
      setBrands([]);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const loadSearchResults = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      
      // Mock search results for now
      setProducts([]);
      setPagination({
        current_page: 1,
        per_page: 12,
        total: 0,
        total_pages: 0,
      });
    } catch (error) {
      console.error('Error loading search results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchQuery: string) => {
    const newSearchParams = new URLSearchParams();
    newSearchParams.set('q', searchQuery);
    setSearchParams(newSearchParams);
  };

  const handleFilterChange = (key: string, value: string | null) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (value) {
      newSearchParams.set(key, value);
    } else {
      newSearchParams.delete(key);
    }
    setSearchParams(newSearchParams);
  };

  const clearFilters = () => {
    const newSearchParams = new URLSearchParams();
    newSearchParams.set('q', query);
    setSearchParams(newSearchParams);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (category) count++;
    if (brand) count++;
    if (gender) count++;
    if (minPrice) count++;
    if (maxPrice) count++;
    return count;
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === parseInt(categoryId))?.name || 'Danh mục';
  };

  const getBrandName = (brandId: string) => {
    return brands.find(b => b.id === parseInt(brandId))?.name || 'Thương hiệu';
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate('/')}
          sx={{ textDecoration: 'none' }}
        >
          Trang chủ
        </Link>
        <Typography color="text.primary">Tìm kiếm</Typography>
      </Breadcrumbs>

      {/* Search Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {query ? `Kết quả tìm kiếm cho "${query}"` : 'Tìm kiếm sản phẩm'}
        </Typography>
        
        {/* Search Bar */}
        <Box sx={{ maxWidth: 600, mb: 3 }}>
          <SearchBar
            placeholder="Tìm kiếm sản phẩm, danh mục..."
            onSearch={handleSearch}
            fullWidth
          />
        </Box>

        {/* Active Filters */}
        {getActiveFiltersCount() > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Bộ lọc đang áp dụng:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {category && (
                <Chip
                  label={`Danh mục: ${getCategoryName(category)}`}
                  onDelete={() => handleFilterChange('category', null)}
                  color="primary"
                  variant="outlined"
                />
              )}
              {brand && (
                <Chip
                  label={`Thương hiệu: ${getBrandName(brand)}`}
                  onDelete={() => handleFilterChange('brand', null)}
                  color="primary"
                  variant="outlined"
                />
              )}
              {gender && (
                <Chip
                  label={`Giới tính: ${gender === 'nam' ? 'Nam' : gender === 'nu' ? 'Nữ' : 'Unisex'}`}
                  onDelete={() => handleFilterChange('gender', null)}
                  color="primary"
                  variant="outlined"
                />
              )}
              {(minPrice || maxPrice) && (
                <Chip
                  label={`Giá: ${minPrice ? `${parseInt(minPrice).toLocaleString()}đ` : '0đ'} - ${maxPrice ? `${parseInt(maxPrice).toLocaleString()}đ` : '∞'}`}
                  onDelete={() => {
                    handleFilterChange('min_price', null);
                    handleFilterChange('max_price', null);
                  }}
                  color="primary"
                  variant="outlined"
                />
              )}
              <Button
                size="small"
                onClick={clearFilters}
                sx={{ ml: 1 }}
              >
                Xóa tất cả
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      {/* Search Results */}
      {query ? (
        <>
          {/* Results Summary */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              {loading ? 'Đang tìm kiếm...' : `Tìm thấy ${pagination.total} kết quả`}
            </Typography>
            {pagination.total > 0 && (
              <Typography variant="body2" color="text.secondary">
                Trang {pagination.current_page} / {pagination.total_pages}
              </Typography>
            )}
          </Box>

          {/* No Results */}
          {!loading && products.length === 0 && (
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Không tìm thấy sản phẩm nào
              </Typography>
              <Typography variant="body2" gutterBottom>
                Hãy thử:
              </Typography>
              <ul>
                <li>Kiểm tra lại từ khóa tìm kiếm</li>
                <li>Sử dụng từ khóa khác</li>
                <li>Xóa bộ lọc để mở rộng kết quả</li>
                <li>Duyệt theo danh mục sản phẩm</li>
              </ul>
            </Alert>
          )}

          {/* Product Grid */}
          <ProductGrid
            products={products}
            loading={loading}
          />

          {/* Suggested Categories */}
          {!loading && products.length === 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Khám phá theo danh mục
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {categories.slice(0, 6).map((category) => (
                  <Box key={category.id} sx={{ width: { xs: 'calc(50% - 8px)', sm: 'calc(33.333% - 8px)', md: 'calc(16.666% - 8px)' } }}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 2,
                        },
                      }}
                      onClick={() => navigate(`/products?category=${category.id}`)}
                    >
                      <CardContent sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          {category.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {category.product_count} sản phẩm
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </>
      ) : (
        /* Quick Search Suggestions */
        <QuickSearch onSearch={handleSearch} />
      )}
    </Container>
  );
};
