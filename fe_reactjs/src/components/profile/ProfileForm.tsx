import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  IconButton,
  CircularProgress,
  Divider,
  Snackbar,
  Alert as MuiAlert,
} from '@mui/material';
import {
  PhotoCamera,
  Save,
  Cancel,
} from '@mui/icons-material';
import { UserProfile, ProfileUpdateRequest } from '../../types/profile';
import { profileService } from '../../services/profileService';

interface ProfileFormProps {
  profile: UserProfile;
  onUpdate: (updatedProfile: UserProfile) => void;
  onCancel: () => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onUpdate,
  onCancel,
}) => {
  const [formData, setFormData] = useState<ProfileUpdateRequest>({
    first_name: profile.first_name || '',
    last_name: profile.last_name || '',
    phone: profile.phone || '',
    address: profile.address || '',
    city: profile.city || '',
    district: profile.district || '',
    ward: profile.ward || '',
    postal_code: profile.postal_code || '',
    country: profile.country || 'Vietnam',
    date_of_birth: '',
    gender: 'other',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatar || null);

  const handleInputChange = (field: keyof ProfileUpdateRequest) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn file hình ảnh');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Kích thước file không được vượt quá 5MB');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const avatarUrl = await profileService.uploadAvatar(file);
      setAvatarPreview(avatarUrl);
      setFormData(prev => ({ ...prev, avatar: avatarUrl }));
      setSuccess('Cập nhật ảnh đại diện thành công');
    } catch (error) {
      setError('Không thể tải lên ảnh đại diện');
      console.error('Avatar upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const updatedProfile = await profileService.updateProfile(formData);
      onUpdate(updatedProfile);
      setSuccess('Cập nhật thông tin thành công');
    } catch (error: any) {
      setError(error.message || 'Không thể cập nhật thông tin');
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
      phone: profile.phone || '',
      address: profile.address || '',
      city: profile.city || '',
      postal_code: profile.postal_code || '',
      country: profile.country || 'Vietnam',
      date_of_birth: profile.date_of_birth || '',
      gender: profile.gender || 'other',
    });
    setAvatarPreview(profile.avatar || null);
    onCancel();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Thông tin cá nhân
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Cập nhật thông tin cá nhân của bạn
        </Typography>
      </Box>

      {/* Snackbar notifications */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiAlert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiAlert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {success}
        </MuiAlert>
      </Snackbar>

      {/* Avatar Section */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <Avatar
            src={avatarPreview || undefined}
            sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
          >
            {profile.first_name?.[0]}{profile.last_name?.[0]}
          </Avatar>
          <IconButton
            color="primary"
            aria-label="upload avatar"
            component="label"
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
            disabled={loading}
          >
            <PhotoCamera />
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={handleAvatarChange}
            />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Nhấn để thay đổi ảnh đại diện
        </Typography>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Form Fields */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Basic Information */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Thông tin cơ bản
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <TextField
            fullWidth
            label="Họ"
            value={formData.first_name}
            onChange={handleInputChange('first_name')}
            required
          />
          <TextField
            fullWidth
            label="Tên"
            value={formData.last_name}
            onChange={handleInputChange('last_name')}
            required
          />
        </Box>

        <TextField
          fullWidth
          label="Số điện thoại"
          value={formData.phone}
          onChange={handleInputChange('phone')}
          placeholder="0123456789"
        />

        {/* Giới tính và Ngày sinh không có trong database schema */}

        {/* Address Information */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Địa chỉ
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="Địa chỉ"
          value={formData.address}
          onChange={handleInputChange('address')}
          multiline
          rows={2}
        />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <TextField
            fullWidth
            label="Tỉnh/Thành phố"
            value={formData.city}
            onChange={handleInputChange('city')}
          />
          <TextField
            fullWidth
            label="Quận/Huyện"
            value={formData.district}
            onChange={handleInputChange('district')}
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <TextField
            fullWidth
            label="Phường/Xã"
            value={formData.ward}
            onChange={handleInputChange('ward')}
          />
          <TextField
            fullWidth
            label="Mã bưu điện"
            value={formData.postal_code}
            onChange={handleInputChange('postal_code')}
          />
        </Box>

        <TextField
          fullWidth
          label="Quốc gia"
          value={formData.country}
          onChange={handleInputChange('country')}
        />
      </Box>

      {/* Action Buttons */}
      <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={handleCancel}
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
          {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </Box>
    </Box>
  );
};
