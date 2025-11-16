import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Save,
  Cancel,
} from '@mui/icons-material';
import { PasswordChangeRequest } from '../../types/profile';
import { profileService } from '../../services/profileService';

interface PasswordChangeFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState<PasswordChangeRequest>({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (field: keyof PasswordChangeRequest) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.current_password) {
      return 'Vui lòng nhập mật khẩu hiện tại';
    }

    if (!formData.new_password) {
      return 'Vui lòng nhập mật khẩu mới';
    }

    if (formData.new_password.length < 6) {
      return 'Mật khẩu mới phải có ít nhất 6 ký tự';
    }

    if (formData.new_password !== formData.confirm_password) {
      return 'Mật khẩu xác nhận không khớp';
    }

    if (formData.current_password === formData.new_password) {
      return 'Mật khẩu mới phải khác mật khẩu hiện tại';
    }

    return null;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await profileService.changePassword(formData);
      setSuccess('Đổi mật khẩu thành công');
      
      // Reset form
      setFormData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });

      // Call success callback after a delay
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Không thể đổi mật khẩu');
      console.error('Password change error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Đổi mật khẩu
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Thay đổi mật khẩu tài khoản của bạn
        </Typography>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Form Fields */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Current Password */}
        <TextField
          fullWidth
          label="Mật khẩu hiện tại"
          type={showPasswords.current ? 'text' : 'password'}
          value={formData.current_password}
          onChange={handleInputChange('current_password')}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => togglePasswordVisibility('current')}
                  edge="end"
                >
                  {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* New Password */}
        <TextField
          fullWidth
          label="Mật khẩu mới"
          type={showPasswords.new ? 'text' : 'password'}
          value={formData.new_password}
          onChange={handleInputChange('new_password')}
          required
          helperText="Mật khẩu phải có ít nhất 6 ký tự"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => togglePasswordVisibility('new')}
                  edge="end"
                >
                  {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Confirm Password */}
        <TextField
          fullWidth
          label="Xác nhận mật khẩu mới"
          type={showPasswords.confirm ? 'text' : 'password'}
          value={formData.confirm_password}
          onChange={handleInputChange('confirm_password')}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => togglePasswordVisibility('confirm')}
                  edge="end"
                >
                  {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Action Buttons */}
      <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={loading}
        >
          <Cancel sx={{ mr: 1 }} />
          Hủy
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <Save />}
        >
          {loading ? 'Đang đổi...' : 'Đổi mật khẩu'}
        </Button>
      </Box>
    </Box>
  );
};
