import axios from 'axios';
import { LoginRequest, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest, AuthResponse, User } from '../types/auth';

import { config } from '../config/environment';

const API_BASE_URL = config.API_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
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
