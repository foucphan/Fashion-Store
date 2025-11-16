import React from 'react';
import { ProductList } from '../components/product/ProductList';
import { Product } from '../types/product';

export const ProductsPage: React.FC = () => {
  const handleProductClick = (product: Product) => {
    // TODO: Navigate to product detail page
    console.log('Product clicked:', product);
  };

  return <ProductList onProductClick={handleProductClick} />;
};
