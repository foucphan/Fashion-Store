import React from 'react';
import { Grid, Box, Typography, Skeleton, Card } from '@mui/material';
import { Product } from '../../types/product';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
  wishlistItems?: number[];
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
  onAddToCart,
  onToggleWishlist,
  onViewDetails,
  wishlistItems = [],
}) => {
  const ProductSkeleton = () => (
    <Card sx={{ height: '100%' }}>
      <Skeleton variant="rectangular" height={200} />
      <Box sx={{ p: 2 }}>
        <Skeleton variant="text" height={20} width="60%" />
        <Skeleton variant="text" height={40} width="100%" />
        <Skeleton variant="text" height={20} width="40%" />
        <Skeleton variant="text" height={20} width="80%" />
      </Box>
    </Card>
  );

  if (loading) {
    return (
      <Grid container spacing={3}>
        {Array.from({ length: 8 }).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <ProductSkeleton />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (products.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Không tìm thấy sản phẩm nào
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
          <ProductCard
            product={product}
            onAddToCart={onAddToCart}
            onToggleWishlist={onToggleWishlist}
            onViewDetails={onViewDetails}
            isInWishlist={wishlistItems.includes(product.id)}
          />
        </Grid>
      ))}
    </Grid>
  );
};
