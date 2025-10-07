import React from 'react';
import { Container, Typography, Box, Button, Card, CardContent, CardMedia } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const featuredProducts = [
    {
      id: 1,
      name: 'Áo Polo Nam',
      price: 299000,
      image: 'https://via.placeholder.com/300x400',
    },
    {
      id: 2,
      name: 'Váy Dài Nữ',
      price: 599000,
      image: 'https://via.placeholder.com/300x400',
    },
    {
      id: 3,
      name: 'Quần Jean Nam',
      price: 799000,
      image: 'https://via.placeholder.com/300x400',
    },
    {
      id: 4,
      name: 'Áo Khoác Nữ',
      price: 1299000,
      image: 'https://via.placeholder.com/300x400',
    },
  ];

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
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Sản Phẩm Nổi Bật
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: 3,
          }}
        >
          {featuredProducts.map((product) => (
            <Card
              key={product.id}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
              onClick={() => navigate(`/products/${product.id}`)}
            >
              <CardMedia
                component="img"
                height="250"
                image={product.image}
                alt={product.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  {product.name}
                </Typography>
                <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                  {product.price.toLocaleString('vi-VN')} ₫
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
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
