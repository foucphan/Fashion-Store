// Brand Types
export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  website?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields
  product_count?: number;
}

export interface BrandResponse {
  success: boolean;
  data: Brand;
}

export interface BrandListResponse {
  success: boolean;
  data: Brand[];
}

export interface BrandCreateRequest {
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  website?: string;
}

export interface BrandUpdateRequest extends Partial<BrandCreateRequest> {
  is_active?: boolean;
}