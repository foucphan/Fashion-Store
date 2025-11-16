import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Visibility,
} from '@mui/icons-material';
import { Product } from '../../types/product';
import { AddToCartButton } from '../cart/AddToCartButton';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isInWishlist?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleWishlist,
  isInWishlist = false,
}) => {
  const navigate = useNavigate();
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getDiscountPercentage = () => {
    if (product.sale_price && product.sale_price < product.price) {
      return Math.round(((product.price - product.sale_price) / product.price) * 100);
    }
    return 0;
  };

  const discountPercentage = getDiscountPercentage();
  const finalPrice = product.sale_price || product.price;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        },
      }}
      onClick={() => navigate(`/products/${product.id}`)}
    >
      {/* Product Image */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={product.primary_image || '/placeholder-product.jpg'}
          alt={product.name}
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <Chip
            label={`-${discountPercentage}%`}
            color="error"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              fontWeight: 'bold',
            }}
          />
        )}

        {/* Featured Badge */}
        {product.featured && (
          <Chip
            label="Nổi bật"
            color="primary"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              fontWeight: 'bold',
            }}
          />
        )}

        {/* Quick Actions */}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            opacity: 0,
            transition: 'opacity 0.2s ease-in-out',
            '&:hover': {
              opacity: 1,
            },
          }}
        >
          <IconButton
            size="small"
            sx={{
              backgroundColor: 'white',
              boxShadow: 1,
              '&:hover': {
                backgroundColor: 'grey.100',
              },
            }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/products/${product.id}`);
            }}
          >
            <Visibility fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            sx={{
              backgroundColor: 'white',
              boxShadow: 1,
              '&:hover': {
                backgroundColor: 'grey.100',
              },
            }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist?.(product);
            }}
          >
            {isInWishlist ? (
              <Favorite color="error" fontSize="small" />
            ) : (
              <FavoriteBorder fontSize="small" />
            )}
          </IconButton>
        </Box>
      </Box>

      {/* Product Content */}
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        {/* Category */}
        {product.category_name && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textTransform: 'uppercase', fontWeight: 'medium' }}
          >
            {product.category_name}
          </Typography>
        )}

        {/* Product Name */}
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 600,
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minHeight: '2.5em',
            transition: 'color 0.2s ease-in-out',
            '&:hover': {
              color: 'primary.main',
            },
          }}
        >
          {product.name}
        </Typography>

        {/* Brand */}
        {product.brand_name && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            {product.brand_name}
          </Typography>
        )}

        {/* Price */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Typography
            variant="h6"
            color="primary"
            sx={{ fontWeight: 'bold' }}
          >
            {formatPrice(finalPrice)}
          </Typography>
          {product.sale_price && (
            <Typography
              variant="body2"
              sx={{
                textDecoration: 'line-through',
                color: 'text.secondary',
              }}
            >
              {formatPrice(product.price)}
            </Typography>
          )}
        </Box>

        {/* Stock Status */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: product.available_variants && product.available_variants > 0 
                ? 'success.main' 
                : 'error.main',
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {product.available_variants && product.available_variants > 0 
              ? 'Còn hàng' 
              : 'Hết hàng'}
          </Typography>
        </Box>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ p: 2, pt: 0 }}>
        <AddToCartButton
          product={product}
          variant="contained"
          fullWidth
          onAddToCart={onAddToCart}
        />
      </CardActions>
    </Card>
  );
};
