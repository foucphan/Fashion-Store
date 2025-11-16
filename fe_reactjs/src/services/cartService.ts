import { 
  Cart, 
  CartItem, 
  CartResponse,
  AddToCartRequest,
  UpdateCartItemRequest,
  CartSummary
} from '../types/cart';
import { apiClient } from './authService';

export const cartService = {
  // Lấy giỏ hàng
  async getCart(): Promise<Cart> {
    const response = await apiClient.get('/cart');
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message);
  },

  // Thêm sản phẩm vào giỏ hàng
  async addToCart(item: AddToCartRequest): Promise<CartItem> {
    const response = await apiClient.post('/cart', item);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message);
  },

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  async updateCartItem(itemId: number, data: UpdateCartItemRequest): Promise<CartItem> {
    const response = await apiClient.put(`/cart/${itemId}`, data);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message);
  },

  // Xóa sản phẩm khỏi giỏ hàng
  async removeFromCart(itemId: number): Promise<void> {
    const response = await apiClient.delete(`/cart/${itemId}`);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
  },

  // Xóa tất cả sản phẩm khỏi giỏ hàng
  async clearCart(): Promise<void> {
    const response = await apiClient.delete('/cart');
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
  },

  // Lấy tổng kết giỏ hàng
  async getCartSummary(): Promise<CartSummary> {
    const response = await apiClient.get('/cart/summary');
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message);
  },

  // Kiểm tra sản phẩm có trong giỏ hàng không
  async isInCart(productId: number, productAttributeId?: number): Promise<boolean> {
    try {
      const cart = await this.getCart();
      return cart.items.some(item => 
        item.product_id === productId && 
        item.product_attribute_id === productAttributeId
      );
    } catch (error) {
      return false;
    }
  },

  // Lấy số lượng sản phẩm trong giỏ hàng
  async getCartItemCount(): Promise<number> {
    try {
      const cart = await this.getCart();
      return cart.total_items;
    } catch (error) {
      return 0;
    }
  },
};
