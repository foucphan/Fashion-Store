import { 
  Category, 
  CategoryResponse, 
  CategoryListResponse,
  CategoryCreateRequest,
  CategoryUpdateRequest
} from '../types/category';
import { apiClient } from './authService';

export const categoryService = {
  // Lấy tất cả danh mục
  async getAllCategories(): Promise<Category[]> {
    const response = await apiClient.get('/categories');
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message);
  },

  // Lấy danh mục theo ID
  async getCategoryById(id: number): Promise<Category> {
    const response = await apiClient.get(`/categories/${id}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message);
  },

  // Tạo danh mục mới (Admin only)
  async createCategory(categoryData: CategoryCreateRequest): Promise<Category> {
    const response = await apiClient.post('/categories', categoryData);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message);
  },

  // Cập nhật danh mục (Admin only)
  async updateCategory(id: number, categoryData: CategoryUpdateRequest): Promise<Category> {
    const response = await apiClient.put(`/categories/${id}`, categoryData);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message);
  },

  // Xóa danh mục (Admin only)
  async deleteCategory(id: number): Promise<void> {
    const response = await apiClient.delete(`/categories/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
  },
};
