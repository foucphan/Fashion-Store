// Cart Types
export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  product_attribute_id?: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  product?: {
    id: number;
    name: string;
    slug: string;
    price: number;
    sale_price?: number;
    primary_image?: string;
    available_variants?: number;
  };
  product_attribute?: {
    id: number;
    size?: string;
    color?: string;
    stock_quantity: number;
  };
}

export interface Cart {
  items: CartItem[];
  total_items: number;
  total_amount: number;
  shipping_fee: number;
  discount_amount: number;
  final_amount: number;
}

export interface CartResponse {
  success: boolean;
  data: Cart;
}

export interface AddToCartRequest {
  product_id: number;
  product_attribute_id?: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CartSummary {
  total_items: number;
  total_amount: number;
  shipping_fee: number;
  discount_amount: number;
  final_amount: number;
}
