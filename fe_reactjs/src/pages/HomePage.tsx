import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types/product';
import { productService } from '../services/productService';
import { ProductGrid } from '../components/product/ProductGrid';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Chỉ load sản phẩm, không xóa cache
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getFeaturedProducts(8);
      setFeaturedProducts(response.data.products);
    } catch (error) {
      console.error('Error loading featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product: Product) => {
    navigate(`/products/${product.id}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 2,
          p: 6,
          textAlign: 'center',
          color: 'white',
          mb: 6,
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Thời Trang Hiện Đại
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
          Khám phá bộ sưu tập mới nhất với giá cả hợp lý
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
            backgroundColor: 'white',
            color: '#667eea',
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
          }}
          onClick={() => navigate('/products')}
        >
          Mua Sắm Ngay
        </Button>
      </Box>

      {/* Featured Products */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h2">
            Sản Phẩm Nổi Bật
          </Typography>
          <Button
            variant="outlined"
            onClick={() => navigate('/products')}
            sx={{ textTransform: 'none' }}
          >
            Xem tất cả
          </Button>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <ProductGrid
            products={featuredProducts}
            onViewDetails={handleProductClick}
          />
        )}
      </Box>

      {/* Features Section */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(3, 1fr)',
          },
          gap: 4,
          mb: 6,
        }}
      >
        <Box sx={{ textAlign: 'center', p: 3 }}>
          <Typography variant="h4" color="primary" sx={{ mb: 2 }}>
            🚚
          </Typography>
          <Typography variant="h6" gutterBottom>
            Giao Hàng Nhanh
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Giao hàng trong 24h tại TP.HCM và Hà Nội
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center', p: 3 }}>
          <Typography variant="h4" color="primary" sx={{ mb: 2 }}>
            💳
          </Typography>
          <Typography variant="h6" gutterBottom>
            Thanh Toán An Toàn
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hỗ trợ nhiều phương thức thanh toán
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center', p: 3 }}>
          <Typography variant="h4" color="primary" sx={{ mb: 2 }}>
            🔄
          </Typography>
          <Typography variant="h6" gutterBottom>
            Đổi Trả Dễ Dàng
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Đổi trả trong 30 ngày nếu không hài lòng
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};
