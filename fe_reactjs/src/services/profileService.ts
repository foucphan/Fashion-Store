import { 
  UserProfile, 
  ProfileUpdateRequest,
  PasswordChangeRequest
} from '../types/profile';
import { apiClient } from './authService';

export const profileService = {
  // Lấy thông tin profile
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get('/profile');
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message);
  },

  // Cập nhật thông tin profile
  async updateProfile(data: ProfileUpdateRequest): Promise<UserProfile> {
    const response = await apiClient.put('/profile', data);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message);
  },

  // Đổi mật khẩu
  async changePassword(data: PasswordChangeRequest): Promise<void> {
    const response = await apiClient.put('/profile/password', data);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
  },

  // Upload avatar
  async uploadAvatar(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.post('/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.success) {
      return response.data.data.avatar_url;
    }
    throw new Error(response.data.message);
  },

  // Xóa avatar
  async deleteAvatar(): Promise<void> {
    const response = await apiClient.delete('/profile/avatar');
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
  },

  // Gửi email xác thực
  async sendVerificationEmail(): Promise<void> {
    const response = await apiClient.post('/profile/send-verification');
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
  },

  // Xác thực email
  async verifyEmail(token: string): Promise<void> {
    const response = await apiClient.post('/profile/verify-email', { token });
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
  },

  // Xóa tài khoản
  async deleteAccount(password: string): Promise<void> {
    const response = await apiClient.delete('/profile', {
      data: { password }
    });
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
  },
};
