import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Chip,
  Rating,
  Alert,
  CircularProgress,
  Paper,
  Tabs,
  Tab,
  IconButton,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Share,
  ArrowBack,
} from '@mui/icons-material';
import { Product } from '../types/product';
import { productService } from '../services/productService';
import { AddToCartButton } from '../components/cart/AddToCartButton';
import { useCart } from '../contexts/CartContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Loading product with ID:', id);
      const response = await productService.getProductById(parseInt(id!));
      console.log('🔍 API Response:', response);
      
      if (response) {
        console.log('🔍 Setting product data:', response);
        setProduct(response);
        
        // Set first image as selected
        if (response.images && Array.isArray(response.images) && response.images.length > 0) {
          console.log('🔍 Setting selected image to 0, total images:', response.images.length);
          setSelectedImage(0);
        } else {
          console.log('🔍 No images found or images is not an array:', response.images);
        }
      } else {
        throw new Error('Không có dữ liệu sản phẩm');
      }
    } catch (error: any) {
      console.error('❌ Error loading product:', error);
      console.error('❌ Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setError(error.response?.data?.message || error.message || 'Không thể tải thông tin sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: Product, quantity: number) => {
    try {
      await addToCart({
        product_id: product.id,
        product_attribute_id: undefined, // Will be handled by AddToCartButton
        quantity: quantity,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleToggleWishlist = () => {
    setIsInWishlist(!isInWishlist);
    // TODO: Implement wishlist functionality
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // TODO: Show toast notification
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getDiscountPercentage = () => {
    if (product?.sale_price && product.sale_price < product.price) {
      return Math.round(((product.price - product.sale_price) / product.price) * 100);
    }
    return 0;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Sản phẩm không tồn tại'}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/products')}
        >
          Quay lại danh sách sản phẩm
        </Button>
      </Container>
    );
  }

  const discountPercentage = getDiscountPercentage();
  const finalPrice = product.sale_price || product.price;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumb */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Quay lại
        </Button>
        <Typography variant="body2" color="text.secondary">
          {product.category_name} / {product.brand_name} / {product.name}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        {/* Product Images */}
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 2 }}>
            {/* Main Image */}
            <Box sx={{ mb: 2, textAlign: 'center' }}>
              <img
                src={product.images?.[selectedImage]?.image_url || product.primary_image || '/placeholder-product.jpg'}
                alt={product.name}
                style={{
                  width: '100%',
                  maxHeight: '500px',
                  objectFit: 'contain',
                  borderRadius: '8px',
                }}
              />
            </Box>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto' }}>
                {product.images.map((image, index) => (
                  <Box
                    key={index}
                    sx={{
                      minWidth: '80px',
                      height: '80px',
                      border: selectedImage === index ? 2 : 1,
                      borderColor: selectedImage === index ? 'primary.main' : 'grey.300',
                      borderRadius: 1,
                      overflow: 'hidden',
                      cursor: 'pointer',
                    }}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image.image_url}
                      alt={`${product.name} ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Box>

        {/* Product Info */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ mb: 3 }}>
            {/* Category & Brand */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              {product.category_name && (
                <Chip label={product.category_name} size="small" />
              )}
              {product.brand_name && (
                <Chip label={product.brand_name} size="small" color="primary" />
              )}
            </Box>

            {/* Product Name */}
            <Typography variant="h4" gutterBottom>
              {product.name}
            </Typography>

            {/* Rating */}
            {product.average_rating && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Rating value={product.average_rating} readOnly precision={0.1} />
                <Typography variant="body2" color="text.secondary">
                  ({product.review_count} đánh giá)
                </Typography>
              </Box>
            )}

            {/* Price */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                  {formatPrice(finalPrice)}
                </Typography>
                {product.sale_price && (
                  <>
                    <Typography
                      variant="h6"
                      sx={{
                        textDecoration: 'line-through',
                        color: 'text.secondary',
                      }}
                    >
                      {formatPrice(product.price)}
                    </Typography>
                    {discountPercentage > 0 && (
                      <Chip
                        label={`-${discountPercentage}%`}
                        color="error"
                        size="small"
                      />
                    )}
                  </>
                )}
              </Box>
            </Box>

            {/* Stock Status */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
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
              <Typography variant="body2" color="text.secondary">
                {product.available_variants && product.available_variants > 0 
                  ? 'Còn hàng' 
                  : 'Hết hàng'}
              </Typography>
            </Box>

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <AddToCartButton
                product={product}
                variant="contained"
                size="large"
                onAddToCart={handleAddToCart}
              />
              <IconButton
                color={isInWishlist ? 'error' : 'default'}
                onClick={handleToggleWishlist}
                size="large"
              >
                {isInWishlist ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
              <IconButton onClick={handleShare} size="large">
                <Share />
              </IconButton>
            </Box>

            {/* Quick Info */}
            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="h6" gutterBottom>
                Thông tin nhanh
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                <Typography variant="body2">
                  <strong>Thương hiệu:</strong> {product.brand_name || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <strong>Danh mục:</strong> {product.category_name || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <strong>Giới tính:</strong> {product.gender || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <strong>SKU:</strong> {product.sku || 'N/A'}
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Product Details Tabs */}
      <Box sx={{ mt: 4 }}>
        <Paper>
          <Tabs value={tabValue} onChange={(_e, newValue) => setTabValue(newValue)}>
            <Tab label="Mô tả sản phẩm" />
            <Tab label="Thông số kỹ thuật" />
            <Tab label="Đánh giá" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {product.description || 'Chưa có mô tả sản phẩm.'}
            </Typography>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="body1">
              Thông số kỹ thuật sẽ được cập nhật sớm.
            </Typography>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="body1">
              Tính năng đánh giá sẽ được cập nhật sớm.
            </Typography>
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
};
