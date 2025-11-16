import axios from 'axios';
import { LoginRequest, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest, AuthResponse, User } from '../types/auth';

import { config } from '../config/environment';

const API_BASE_URL = config.API_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('🚀 API Request - URL:', config.url);
    console.log('🚀 API Request - Method:', config.method);
    console.log('🚀 API Request - Token from localStorage:', token ? `${token.substring(0, 20)}...` : 'null');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ API Request - Authorization header set');
    } else {
      console.warn('⚠️ API Request - No token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('❌ API Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response - Status:', response.status, 'URL:', response.config.url);
    return response;
  },
  (error) => {
    console.log('❌ API Response Error - Status:', error.response?.status);
    console.log('❌ API Response Error - URL:', error.config?.url);
    console.log('❌ API Response Error - Message:', error.message);
    console.log('❌ API Response Error - Response data:', error.response?.data);

    if (error.response?.status === 401) {
      console.warn('🔐 Token expired or invalid, clearing token and redirecting to login');
      console.warn('🔐 Error details:', error.response?.data);

      localStorage.removeItem('token');

      // Dispatch custom event to notify AuthContext
      window.dispatchEvent(new CustomEvent('auth:logout'));

      // Small delay before redirect to allow context to update
      setTimeout(() => {
        console.log('🔐 Redirecting to login page...');
        window.location.href = '/auth';
      }, 100);
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', credentials);
    if (response.data.success) {
      return {
        user: response.data.user,
        token: response.data.token,
        refreshToken: response.data.token // Backend chỉ trả về 1 token
      };
    }
    throw new Error(response.data.message);
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/register', userData);
    if (response.data.success) {
      return {
        user: response.data.user,
        token: response.data.token,
        refreshToken: response.data.token
      };
    }
    throw new Error(response.data.message);
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get('/auth/me');
    if (response.data.success) {
      return response.data.user;
    }
    throw new Error(response.data.message);
  },

  async forgotPassword(email: string): Promise<void> {
    const response = await apiClient.post('/auth/forgot-password', { email });
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
  },

  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    const response = await apiClient.post('/auth/reset-password', data);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
  },

  async verifyEmail(token: string): Promise<void> {
    const response = await apiClient.post('/auth/verify-email', { token });
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
  },

  async refreshToken(): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/refresh');
    if (response.data.success) {
      return {
        user: response.data.user,
        token: response.data.token,
        refreshToken: response.data.token
      };
    }
    throw new Error(response.data.message);
  },
};
