import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Card,
  CardContent,
} from '@mui/material';
import { Payment, ArrowBack, LocalAtm, AccountBalanceWallet } from '@mui/icons-material';

interface PaymentFormProps {
  initialData: {
    method: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    bankCode: string;
    phone?: string;
    email?: string;
  };
  onSubmit: (data: any) => void;
  onBack: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  initialData,
  onSubmit,
  onBack
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      method: event.target.value
    });
  };

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.method === 'credit_card') {
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = 'Số thẻ là bắt buộc';
      } else if (!/^[0-9\s]{16,19}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Số thẻ không hợp lệ';
      }
      if (!formData.expiryDate.trim()) {
        newErrors.expiryDate = 'Ngày hết hạn là bắt buộc';
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Định dạng MM/YY';
      }
      if (!formData.cvv.trim()) {
        newErrors.cvv = 'CVV là bắt buộc';
      } else if (!/^[0-9]{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = 'CVV không hợp lệ';
      }
    } else if (formData.method === 'vnpay') {
      // VNPay không yêu cầu email và phone
      // Chỉ validate nếu user nhập
      if (formData.phone && formData.phone.trim() && !/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Số điện thoại không hợp lệ';
      }
      if (formData.email && formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Email không hợp lệ';
      }
    }

    if (formData.method === 'bank_transfer') {
      if (!formData.bankCode.trim()) {
        newErrors.bankCode = 'Mã ngân hàng là bắt buộc';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const paymentMethods = [
    {
      value: 'cod',
      label: 'Thanh toán khi nhận hàng (COD)',
      icon: <LocalAtm />,
      description: 'Thanh toán bằng tiền mặt khi nhận hàng'
    },
    {
      value: 'vnpay',
      label: 'Thanh toán VNPay',
      icon: <AccountBalanceWallet />,
      description: 'Thanh toán qua ví điện tử VNPay'
    }
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Payment sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6">
          Phương thức thanh toán
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
          <FormLabel component="legend" sx={{ mb: 2 }}>
            Chọn phương thức thanh toán
          </FormLabel>
          <RadioGroup
            value={formData.method}
            onChange={handleMethodChange}
          >
            {paymentMethods.map((method) => (
              <Card
                key={method.value}
                sx={{
                  mb: 2,
                  border: formData.method === method.value ? 2 : 1,
                  borderColor: formData.method === method.value ? 'primary.main' : 'divider',
                  cursor: 'pointer'
                }}
                onClick={() => setFormData({ ...formData, method: method.value })}
              >
                <CardContent sx={{ p: 2 }}>
                  <FormControlLabel
                    value={method.value}
                    control={<Radio />}
                    label={
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          {method.icon}
                          <Typography variant="subtitle1" sx={{ ml: 1 }}>
                            {method.label}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {method.description}
                        </Typography>
                      </Box>
                    }
                    sx={{ width: '100%', m: 0 }}
                  />
                </CardContent>
              </Card>
            ))}
          </RadioGroup>
        </FormControl>

        {/* Credit Card Details */}
        {formData.method === 'credit_card' && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Thông tin thẻ
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                fullWidth
                label="Số thẻ *"
                value={formData.cardNumber}
                onChange={handleChange('cardNumber')}
                error={!!errors.cardNumber}
                helperText={errors.cardNumber}
                placeholder="1234 5678 9012 3456"
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: '14px',
                    padding: '12px 14px',
                  }
                }}
              />
              <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                  fullWidth
                  label="Ngày hết hạn *"
                  value={formData.expiryDate}
                  onChange={handleChange('expiryDate')}
                  error={!!errors.expiryDate}
                  helperText={errors.expiryDate}
                  placeholder="MM/YY"
                  sx={{
                    '& .MuiInputBase-input': {
                      fontSize: '14px',
                      padding: '12px 14px',
                    }
                  }}
                />
                <TextField
                  fullWidth
                  label="CVV *"
                  value={formData.cvv}
                  onChange={handleChange('cvv')}
                  error={!!errors.cvv}
                  helperText={errors.cvv}
                  placeholder="123"
                  sx={{
                    '& .MuiInputBase-input': {
                      fontSize: '14px',
                      padding: '12px 14px',
                    }
                  }}
                />
              </Box>
            </Box>
          </Box>
        )}


        {/* Bank Transfer Details */}
        {formData.method === 'bank_transfer' && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Thông tin chuyển khoản
            </Typography>
            <TextField
              fullWidth
              label="Mã ngân hàng *"
              value={formData.bankCode}
              onChange={handleChange('bankCode')}
              error={!!errors.bankCode}
              helperText={errors.bankCode}
              placeholder="Chọn ngân hàng"
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: '14px',
                  padding: '12px 14px',
                }
              }}
            />
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Thông tin chuyển khoản:</strong><br />
                Số tài khoản: 1234567890<br />
                Chủ tài khoản: CÔNG TY TNHH THỜI TRANG ABC<br />
                Ngân hàng: Vietcombank - Chi nhánh Hà Nội<br />
                Nội dung: [Mã đơn hàng]
              </Typography>
            </Box>
          </Box>
        )}

        {/* VNPay Details */}
        {formData.method === 'vnpay' && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Thông tin VNPay
            </Typography>
            <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1, mb: 2 }}>
              <Typography variant="body2" color="success.contrastText">
                <strong>Hướng dẫn thanh toán VNPay:</strong><br />
                1. Nhấn "Thanh toán VNPay" để chuyển đến trang thanh toán<br />
                2. Chọn ngân hàng hoặc ví điện tử của bạn<br />
                3. Nhập thông tin thanh toán theo hướng dẫn<br />
                4. Xác nhận thanh toán để hoàn tất đơn hàng
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                fullWidth
                label="Số điện thoại (tùy chọn)"
                value={formData.phone || ''}
                onChange={handleChange('phone')}
                placeholder="Nhập số điện thoại để nhận thông báo (không bắt buộc)"
                error={!!errors.phone}
                helperText={errors.phone}
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: '14px',
                    padding: '12px 14px',
                  }
                }}
              />
              <TextField
                fullWidth
                label="Email (tùy chọn)"
                value={formData.email || ''}
                onChange={handleChange('email')}
                placeholder="Nhập email để nhận hóa đơn (không bắt buộc)"
                error={!!errors.email}
                helperText={errors.email}
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: '14px',
                    padding: '12px 14px',
                  }
                }}
              />
            </Box>
          </Box>
        )}

        {/* COD Info */}
        {formData.method === 'cod' && (
          <Box sx={{ mb: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
            <Typography variant="body2" color="info.contrastText">
              <strong>Lưu ý:</strong> Bạn sẽ thanh toán bằng tiền mặt khi nhận hàng. 
              Vui lòng chuẩn bị đúng số tiền theo đơn hàng.
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={onBack}
            startIcon={<ArrowBack />}
          >
            Quay lại
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="large"
          >
            Tiếp tục
          </Button>
        </Box>
      </form>
    </Paper>
  );
};
