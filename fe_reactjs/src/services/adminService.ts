import { apiClient } from './authService';

export interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
}

export interface AdminOrder {
  id: number;
  order_code: string;
  user_id: number;
  user_name?: string;
  user_email?: string;
  total_amount: number;
  shipping_fee: number;
  discount_amount: number;
  final_amount: number;
  status?: string;
  order_status?: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar?: string;
  role: 'admin' | 'user';
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export const adminService = {
  // Dashboard Statistics
  async getStats(): Promise<AdminStats> {
    const response = await apiClient.get('/admin/stats');
    return response.data.data;
  },

  // Products
  async getAllProducts(params?: any) {
    const response = await apiClient.get('/products', { params });
    return response.data;
  },

  async getProductById(id: number) {
    const response = await apiClient.get(`/products/${id}`);
    return response.data.data;
  },

  async createProduct(productData: any) {
    const response = await apiClient.post('/products', productData);
    return response.data;
  },

  async updateProduct(id: number, productData: any) {
    const response = await apiClient.put(`/products/${id}`, productData);
    return response.data;
  },

  async deleteProduct(id: number) {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },

  // Orders
  async getAllOrders(params?: any) {
    const response = await apiClient.get('/admin/orders', { params });
    return response.data;
  },

  async getOrderById(id: number) {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data.data;
  },

  async updateOrderStatus(id: number, status: string) {
    const response = await apiClient.put(`/admin/orders/${id}/status`, { status });
    return response.data;
  },

  async updatePaymentStatus(id: number, payment_status: string) {
    const response = await apiClient.put(`/admin/orders/${id}/payment-status`, { payment_status });
    return response.data;
  },

  // Users
  async getAllUsers(params?: any) {
    const response = await apiClient.get('/admin/users', { params });
    return response.data;
  },

  async getUserById(id: number) {
    const response = await apiClient.get(`/admin/users/${id}`);
    return response.data.data;
  },

  async updateUser(id: number, userData: any) {
    const response = await apiClient.put(`/admin/users/${id}`, userData);
    return response.data;
  },

  async deleteUser(id: number) {
    const response = await apiClient.delete(`/admin/users/${id}`);
    return response.data;
  },

  // Categories
  async getAllCategories() {
    const response = await apiClient.get('/categories');
    return response.data.data;
  },

  async getCategoryById(id: number) {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data.data;
  },

  async createCategory(categoryData: any) {
    const response = await apiClient.post('/categories', categoryData);
    return response.data;
  },

  async updateCategory(id: number, categoryData: any) {
    const response = await apiClient.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  async deleteCategory(id: number) {
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data;
  },

  // Brands
  async getAllBrands() {
    const response = await apiClient.get('/brands');
    return response.data.data;
  },

  async getBrandById(id: number) {
    const response = await apiClient.get(`/brands/${id}`);
    return response.data.data;
  },

  async createBrand(brandData: any) {
    const response = await apiClient.post('/brands', brandData);
    return response.data;
  },

  async updateBrand(id: number, brandData: any) {
    const response = await apiClient.put(`/brands/${id}`, brandData);
    return response.data;
  },

  async deleteBrand(id: number) {
    const response = await apiClient.delete(`/brands/${id}`);
    return response.data;
  },

  // Product Images
  async getProductImages(productId: number) {
    const response = await apiClient.get(`/products/${productId}/images`);
    return response.data.data;
  },

  async uploadProductImage(productId: number, file: File, options?: { is_primary?: boolean; alt_text?: string; sort_order?: number }) {
    const formData = new FormData();
    formData.append('image', file);
    if (options?.is_primary !== undefined) {
      formData.append('is_primary', options.is_primary.toString());
    }
    if (options?.alt_text) {
      formData.append('alt_text', options.alt_text);
    }
    if (options?.sort_order !== undefined) {
      formData.append('sort_order', options.sort_order.toString());
    }
    const response = await apiClient.post(`/products/${productId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateProductImage(productId: number, imageId: number, data: { alt_text?: string; is_primary?: boolean; sort_order?: number }) {
    const response = await apiClient.put(`/products/${productId}/images/${imageId}`, data);
    return response.data;
  },

  async deleteProductImage(productId: number, imageId: number) {
    const response = await apiClient.delete(`/products/${productId}/images/${imageId}`);
    return response.data;
  },

  // Inventory
  async getAllInventory(params?: any) {
    const response = await apiClient.get('/products/inventory/all', { params });
    return response.data;
  },

  async updateStockQuantity(attributeId: number, stock_quantity: number) {
    const response = await apiClient.put(`/products/attributes/${attributeId}/stock`, { stock_quantity });
    return response.data;
  },
};

