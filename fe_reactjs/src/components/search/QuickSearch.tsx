import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  Category as CategoryIcon,
  Star,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { categoryService } from '../../services/categoryService';
import { productService } from '../../services/productService';
import { Category } from '../../types/category';
import { Product } from '../../types/product';

interface QuickSearchProps {
  onSearch?: (query: string) => void;
}

export const QuickSearch: React.FC<QuickSearchProps> = ({ onSearch }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuickSearchData();
  }, []);

  const loadQuickSearchData = async () => {
    try {
      setLoading(true);
      const [categoriesData, trendingResponse] = await Promise.all([
        categoryService.getAllCategories(),
        productService.getFeaturedProducts(6),
      ]);
      
      setCategories(categoriesData.slice(0, 8));
      setTrendingProducts(trendingResponse.data.products);
    } catch (error) {
      console.error('Error loading quick search data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category: Category) => {
    navigate(`/products?category=${category.id}`);
    onSearch?.(category.name);
  };

  const handleProductClick = (product: Product) => {
    navigate(`/products/${product.id}`);
    onSearch?.(product.name);
  };

  const handleTrendingClick = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
    onSearch?.(query);
  };

  if (loading) {
    return null;
  }

  return (
    <Box sx={{ py: 4 }}>
      {/* Trending Searches */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" gutterBottom>
            Tìm kiếm phổ biến
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {[
            'Áo thun nam',
            'Váy đầm nữ',
            'Quần jean',
            'Áo khoác',
            'Giày sneaker',
            'Túi xách',
            'Đồng hồ',
            'Phụ kiện',
          ].map((trend) => (
            <Chip
              key={trend}
              label={trend}
              onClick={() => handleTrendingClick(trend)}
              variant="outlined"
              clickable
              sx={{
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                },
              }}
            />
          ))}
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Categories */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CategoryIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" gutterBottom>
            Danh mục phổ biến
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {categories.map((category) => (
            <Box key={category.id} sx={{ width: { xs: 'calc(50% - 8px)', sm: 'calc(33.333% - 8px)', md: 'calc(25% - 8px)' } }}>
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3,
                  },
                }}
                onClick={() => handleCategoryClick(category)}
              >
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
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

      <Divider sx={{ my: 3 }} />

      {/* Featured Products */}
      {trendingProducts.length > 0 && (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Star sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" gutterBottom>
              Sản phẩm nổi bật
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {trendingProducts.map((product) => (
              <Box key={product.id} sx={{ width: { xs: 'calc(50% - 8px)', sm: 'calc(33.333% - 8px)', md: 'calc(16.666% - 8px)' } }}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3,
                    },
                  }}
                  onClick={() => handleProductClick(product)}
                >
                  <Box
                    sx={{
                      height: 120,
                      backgroundImage: `url(${product.primary_image || '/placeholder-product.jpg'})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <CardContent sx={{ p: 1.5 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 500,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        minHeight: '2.5em',
                      }}
                    >
                      {product.name}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(product.sale_price || product.price)}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};
