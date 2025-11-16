import { 
  Brand, 
  BrandResponse, 
  BrandListResponse,
  BrandCreateRequest,
  BrandUpdateRequest
} from '../types/brand';
import { apiClient } from './authService';

export const brandService = {
  // Lấy tất cả thương hiệu
  async getAllBrands(): Promise<Brand[]> {
    const response = await apiClient.get('/brands');
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message);
  },

  // Lấy thương hiệu theo ID
  async getBrandById(id: number): Promise<Brand> {
    const response = await apiClient.get(`/brands/${id}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message);
  },

  // Tạo thương hiệu mới (Admin only)
  async createBrand(brandData: BrandCreateRequest): Promise<Brand> {
    const response = await apiClient.post('/brands', brandData);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message);
  },

  // Cập nhật thương hiệu (Admin only)
  async updateBrand(id: number, brandData: BrandUpdateRequest): Promise<Brand> {
    const response = await apiClient.put(`/brands/${id}`, brandData);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message);
  },

  // Xóa thương hiệu (Admin only)
  async deleteBrand(id: number): Promise<void> {
    const response = await apiClient.delete(`/brands/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
  },
};
