// Product Types
export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  sku: string;
  price: number;
  sale_price?: number;
  category_id: number;
  brand_id?: number;
  gender: 'nam' | 'nu' | 'unisex';
  status: 'active' | 'inactive' | 'out_of_stock';
  featured: boolean;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  category_name?: string;
  category_slug?: string;
  brand_name?: string;
  brand_slug?: string;
  primary_image?: string;
  available_variants?: number;
  // Additional fields from API
  images?: ProductImage[];
  attributes?: ProductAttribute[];
  reviews?: ProductReview[];
  average_rating?: number;
  review_count?: number;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  alt_text?: string;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
}

export interface ProductAttribute {
  id: number;
  product_id: number;
  size?: string;
  color?: string;
  stock_quantity: number;
  sku_variant?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductReview {
  id: number;
  product_id: number;
  user_id: number;
  order_id?: number;
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields
  full_name?: string;
  avatar?: string;
}

export interface ProductRatingStats {
  avg_rating: number;
  total_reviews: number;
}

export interface ProductDetail extends Product {
  images: ProductImage[];
  attributes: ProductAttribute[];
  reviews: ProductReview[];
  rating_stats: ProductRatingStats;
}

// API Request/Response Types
export interface ProductListParams {
  page?: number;
  limit?: number;
  category_id?: number;
  brand_id?: number;
  gender?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'ASC' | 'DESC';
  featured?: boolean;
}

export interface ProductListResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: {
      current_page: number;
      per_page: number;
      total: number;
      total_pages: number;
    };
  };
}

export interface ProductResponse {
  success: boolean;
  data: ProductDetail;
}

export interface ProductCreateRequest {
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  sku: string;
  price: number;
  sale_price?: number;
  category_id: number;
  brand_id?: number;
  gender?: 'nam' | 'nu' | 'unisex';
  featured?: boolean;
  meta_title?: string;
  meta_description?: string;
}

export interface ProductUpdateRequest extends Partial<ProductCreateRequest> {
  status?: 'active' | 'inactive' | 'out_of_stock';
}
