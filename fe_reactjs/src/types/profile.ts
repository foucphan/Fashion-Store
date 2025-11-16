// Profile Types
export interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  city?: string;
  district?: string;
  ward?: string;
  postal_code?: string;
  country?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  avatar?: string;
  is_email_verified: boolean;
  created_at: string;
  updated_at: string;
  // Lịch sử đơn hàng
  recent_orders?: OrderHistory[];
}

export interface OrderHistory {
  id: number;
  order_code: string;
  status: string;
  total_amount: number;
  product_name?: string;
  quantity?: number;
  price?: number;
  created_at: string;
}

export interface ProfileUpdateRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  district?: string;
  ward?: string;
  postal_code?: string;
  country?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  avatar?: string;
}

export interface PasswordChangeRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface ProfileResponse {
  success: boolean;
  data: UserProfile;
}

export interface ProfileUpdateResponse {
  success: boolean;
  data: UserProfile;
  message: string;
}

export interface PasswordChangeResponse {
  success: boolean;
  message: string;
}

export interface AvatarUploadResponse {
  success: boolean;
  data: {
    avatar_url: string;
  };
  message: string;
}
