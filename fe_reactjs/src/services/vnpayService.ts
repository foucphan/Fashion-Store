import { apiClient } from './authService';

export interface VNPayPaymentRequest {
  orderId: number;
  amount: number;
  orderDescription: string;
  bankCode?: string;
}

export interface VNPayPaymentResponse {
  success: boolean;
  data: {
    paymentUrl: string;
    orderId: string;
    amount: number;
    description: string;
  };
  message: string;
}

export interface VNPayBank {
  code: string;
  name: string;
}

export interface VNPayBankResponse {
  success: boolean;
  data: VNPayBank[];
}

export interface VNPayStatusResponse {
  success: boolean;
  data: {
    orderId: string;
    paymentStatus: string;
    orderStatus: string;
    amount: number;
    paymentMethod: string;
  };
}

export const vnpayService = {
  // Tạo URL thanh toán VNPay
  async createPaymentUrl(data: VNPayPaymentRequest): Promise<VNPayPaymentResponse> {
    const response = await apiClient.post('/vnpay/create-payment-url', data);
    return response.data;
  },

  // Lấy danh sách ngân hàng hỗ trợ VNPay
  async getSupportedBanks(): Promise<VNPayBankResponse> {
    const response = await apiClient.get('/vnpay/supported-banks');
    return response.data;
  },

  // Kiểm tra trạng thái thanh toán
  async checkPaymentStatus(orderId: string): Promise<VNPayStatusResponse> {
    const response = await apiClient.get(`/vnpay/payment-status/${orderId}`);
    return response.data;
  },

  // Chuyển hướng đến VNPay
  redirectToVNPay(paymentUrl: string) {
    try {
      console.log('Redirecting to VNPay:', paymentUrl);
      window.location.href = paymentUrl;
    } catch (error) {
      console.error('VNPay redirect error:', error);
      // Fallback: mở tab mới
      window.open(paymentUrl, '_blank');
    }
  }
};
