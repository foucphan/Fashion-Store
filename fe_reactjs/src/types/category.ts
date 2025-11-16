// Category Types
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent_id?: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  product_count?: number;
  featured_image?: string;
}

export interface CategoryResponse {
  success: boolean;
  data: Category;
}

export interface CategoryListResponse {
  success: boolean;
  data: Category[];
}

export interface CategoryCreateRequest {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent_id?: number;
  sort_order?: number;
}

export interface CategoryUpdateRequest extends Partial<CategoryCreateRequest> {
  is_active?: boolean;
}