import { 
  Product, 
  ProductDetail, 
  ProductListParams, 
  ProductListResponse, 
  ProductCreateRequest,
  ProductUpdateRequest
} from '../types/product';
import { apiClient } from './authService';

export const productService = {
  // Lấy danh sách sản phẩm
  async getProducts(params: ProductListParams = {}): Promise<ProductListResponse> {
    const response = await apiClient.get('/products', { params });
    return response.data;
  },

  // Lấy sản phẩm theo ID
  async getProductById(id: number): Promise<ProductDetail> {
    console.log('🔍 ProductService - Getting product by ID:', id);
    const response = await apiClient.get(`/products/${id}`);
    console.log('🔍 ProductService - API Response:', response.data);
    
    if (response.data.success) {
      console.log('🔍 ProductService - Product data:', response.data.data);
      return response.data.data;
    }
    throw new Error(response.data.message || 'Không thể lấy thông tin sản phẩm');
  },

  // Lấy sản phẩm liên quan
  async getRelatedProducts(id: number, limit: number = 8): Promise<Product[]> {
    const response = await apiClient.get(`/products/${id}/related`, { 
      params: { limit } 
    });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message);
  },

  // Tạo sản phẩm mới (Admin only)
  async createProduct(productData: ProductCreateRequest): Promise<Product> {
    const response = await apiClient.post('/products', productData);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message);
  },

  // Cập nhật sản phẩm (Admin only)
  async updateProduct(id: number, productData: ProductUpdateRequest): Promise<Product> {
    const response = await apiClient.put(`/products/${id}`, productData);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message);
  },

  // Xóa sản phẩm (Admin only)
  async deleteProduct(id: number): Promise<void> {
    const response = await apiClient.delete(`/products/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
  },

  // Tìm kiếm sản phẩm
  async searchProducts(query: string, params: Omit<ProductListParams, 'search'> = {}): Promise<ProductListResponse> {
    return this.getProducts({ ...params, search: query });
  },

  // Lấy sản phẩm nổi bật
  async getFeaturedProducts(limit: number = 8): Promise<ProductListResponse> {
    return this.getProducts({ featured: true, limit });
  },

  // Lấy sản phẩm theo danh mục
  async getProductsByCategory(categoryId: number, params: Omit<ProductListParams, 'category_id'> = {}): Promise<ProductListResponse> {
    return this.getProducts({ ...params, category_id: categoryId });
  },

  // Lấy sản phẩm theo thương hiệu
  async getProductsByBrand(brandId: number, params: Omit<ProductListParams, 'brand_id'> = {}): Promise<ProductListResponse> {
    return this.getProducts({ ...params, brand_id: brandId });
  },

  // Lấy attributes của sản phẩm
  async getProductAttributes(productId: number): Promise<{ data: any[] }> {
    const response = await apiClient.get(`/products/${productId}/attributes`);
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.message);
  },
};
