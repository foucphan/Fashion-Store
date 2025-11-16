import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { LocalShipping, ArrowBack } from '@mui/icons-material';

interface ShippingFormProps {
  initialData: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    district: string;
    ward: string;
    note: string;
  };
  onSubmit: (data: any) => void;
  onBack: () => void;
}

export const ShippingForm: React.FC<ShippingFormProps> = ({
  initialData,
  onSubmit,
  onBack
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ tên là bắt buộc';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Địa chỉ là bắt buộc';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'Tỉnh/Thành phố là bắt buộc';
    }
    if (!formData.district.trim()) {
      newErrors.district = 'Quận/Huyện là bắt buộc';
    }
    if (!formData.ward.trim()) {
      newErrors.ward = 'Phường/Xã là bắt buộc';
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

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <LocalShipping sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6">
          Thông tin giao hàng
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Hàng 1: Họ tên và Số điện thoại */}
          <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Họ và tên *"
                value={formData.fullName}
                onChange={handleChange('fullName')}
                error={!!errors.fullName}
                helperText={errors.fullName}
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: '14px',
                    padding: '12px 14px',
                  }
                }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Số điện thoại *"
                value={formData.phone}
                onChange={handleChange('phone')}
                error={!!errors.phone}
                helperText={errors.phone}
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: '14px',
                    padding: '12px 14px',
                  }
                }}
              />
            </Box>
          </Box>

          {/* Hàng 2: Email */}
          <Box>
            <TextField
              fullWidth
              label="Email *"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
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

          {/* Hàng 3: Địa chỉ chi tiết */}
          <Box>
            <TextField
              fullWidth
              label="Địa chỉ chi tiết *"
              value={formData.address}
              onChange={handleChange('address')}
              error={!!errors.address}
              helperText={errors.address}
              multiline
              rows={2}
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: '14px',
                  padding: '12px 14px',
                }
              }}
            />
          </Box>

          {/* Hàng 4: Tỉnh/Thành phố, Quận/Huyện, Phường/Xã */}
          <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Box sx={{ flex: 1 }}>
              <FormControl fullWidth error={!!errors.city}>
                <InputLabel sx={{ fontSize: '14px' }}>Tỉnh/Thành phố *</InputLabel>
                <Select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  label="Tỉnh/Thành phố *"
                  sx={{
                    '& .MuiSelect-select': {
                      fontSize: '14px',
                      padding: '12px 14px',
                    }
                  }}
                >
                  <MenuItem value="hanoi">Hà Nội</MenuItem>
                  <MenuItem value="hcm">TP. Hồ Chí Minh</MenuItem>
                  <MenuItem value="danang">Đà Nẵng</MenuItem>
                  <MenuItem value="haiphong">Hải Phòng</MenuItem>
                  <MenuItem value="cantho">Cần Thơ</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Quận/Huyện *"
                value={formData.district}
                onChange={handleChange('district')}
                error={!!errors.district}
                helperText={errors.district}
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: '14px',
                    padding: '12px 14px',
                  }
                }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Phường/Xã *"
                value={formData.ward}
                onChange={handleChange('ward')}
                error={!!errors.ward}
                helperText={errors.ward}
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: '14px',
                    padding: '12px 14px',
                  }
                }}
              />
            </Box>
          </Box>

          {/* Hàng 5: Ghi chú */}
          <Box>
            <TextField
              fullWidth
              label="Ghi chú (tùy chọn)"
              value={formData.note}
              onChange={handleChange('note')}
              multiline
              rows={3}
              placeholder="Ghi chú thêm cho đơn hàng..."
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: '14px',
                  padding: '12px 14px',
                }
              }}
            />
          </Box>
        </Box>

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
