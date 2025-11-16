import { apiClient } from './authService';

export interface CreateOrderRequest {
  items: Array<{
    product_id: number;
    product_attribute_id?: number;
    quantity: number;
    product?: {
      price: number;
      sale_price?: number;
    };
  }>;
  shipping_info: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    district: string;
    ward: string;
    note?: string;
  };
  payment_info: {
    method: string;
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    bankCode?: string;
  };
  total_amount: number;
  shipping_fee: number;
  discount_amount: number;
}

export interface Order {
  id: number;
  order_number: string;
  status: string;
  total_amount: number;
  shipping_fee: number;
  discount_amount: number;
  final_amount: number;
  payment_method: string;
  payment_status: string;
  shipping_info: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    district: string;
    ward: string;
    note: string;
  };
  items: Array<{
    id: number;
    product_id: number;
    product_attribute_id?: number;
    quantity: number;
    price: number;
    product: {
      name: string;
      slug: string;
      image: string;
    };
    product_attribute?: {
      size: string;
      color: string;
    };
  }>;
  created_at: string;
  updated_at?: string;
}

export interface OrdersResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const orderService = {
  // Tạo đơn hàng mới
  async createOrder(data: CreateOrderRequest): Promise<{ data: Order }> {
    const response = await apiClient.post('/orders', data);
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.message);
  },

  // Lấy danh sách đơn hàng của user
  async getUserOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{ data: OrdersResponse }> {
    const response = await apiClient.get('/orders', { params });
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.message);
  },

  // Lấy chi tiết đơn hàng
  async getOrderById(orderId: number): Promise<{ data: Order }> {
    const response = await apiClient.get(`/orders/${orderId}`);
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.message);
  },

  // Hủy đơn hàng
  async cancelOrder(orderId: number): Promise<{ message: string }> {
    const response = await apiClient.put(`/orders/${orderId}/cancel`);
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.message);
  }
};
