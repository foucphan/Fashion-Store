import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Breadcrumbs,
  Link,
  Tabs,
  Tab,
  Snackbar,
  Alert as MuiAlert,
} from '@mui/material';
import {
  Edit,
  Phone,
  Person,
  Verified,
  LocationOn,
  ShoppingCart,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserProfile } from '../types/profile';
import { profileService } from '../services/profileService';
import { ProfileForm } from '../components/profile/ProfileForm';
import { PasswordChangeForm } from '../components/profile/PasswordChangeForm';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`,
  };
}

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await profileService.getProfile();
      setProfile(response);
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Không thể tải thông tin cá nhân');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    setIsEditing(false);
  };

  const handlePasswordChange = () => {
    // Password change success - could show a success message
    console.log('Password changed successfully');
  };

  // Các function này không cần thiết vì không có field tương ứng trong database schema

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
          <Button variant="contained" onClick={loadProfile}>
            Thử lại
          </Button>
        </Box>
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
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Không tìm thấy thông tin cá nhân
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate('/')}
          sx={{ textDecoration: 'none' }}
        >
          Trang chủ
        </Link>
        <Typography variant="body2" color="text.primary">
          Hồ sơ cá nhân
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Avatar
          src={profile.avatar || undefined}
          sx={{ width: 80, height: 80, mr: 3 }}
        >
          {profile.first_name?.[0]}{profile.last_name?.[0]}
        </Avatar>
        <Box>
          <Typography variant="h4" gutterBottom>
            {profile.first_name} {profile.last_name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {profile.email}
          </Typography>
          {profile.is_email_verified && (
            <Chip
              label="Email đã xác thực"
              color="success"
              size="small"
              icon={<Verified />}
              sx={{ mt: 1 }}
            />
          )}
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Thông tin cá nhân" {...a11yProps(0)} />
          <Tab label="Bảo mật" {...a11yProps(1)} />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        {isEditing ? (
          <ProfileForm
            profile={profile}
            onUpdate={handleProfileUpdate}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Personal Information */}
            <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
              <Box sx={{ flex: 1 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person />
                      Thông tin cá nhân
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Họ và tên
                        </Typography>
                        <Typography variant="body1">
                          {profile.first_name || ''} {profile.last_name || ''}
                        </Typography>
                      </Box>

                      {/* Giới tính và Ngày sinh không có trong database schema */}
                    </Box>
                  </CardContent>
                </Card>
              </Box>

              {/* Contact Information */}
              <Box sx={{ flex: 1 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Phone />
                      Thông tin liên hệ
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Email
                        </Typography>
                        <Typography variant="body1">
                          {profile.email}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Số điện thoại
                        </Typography>
                        <Typography variant="body1">
                          {profile.phone || 'Chưa cập nhật'}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Box>

            {/* Address Information */}
            <Box>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn />
                    Địa chỉ
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Địa chỉ
                        </Typography>
                        <Typography variant="body1">
                          {profile.address || 'Chưa cập nhật'}
                        </Typography>
                      </Box>

                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Tỉnh/Thành phố
                        </Typography>
                        <Typography variant="body1">
                          {profile.city || 'Chưa cập nhật'}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Quận/Huyện
                        </Typography>
                        <Typography variant="body1">
                          {profile.district || 'Chưa cập nhật'}
                        </Typography>
                      </Box>

                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Phường/Xã
                        </Typography>
                        <Typography variant="body1">
                          {profile.ward || 'Chưa cập nhật'}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Mã bưu điện
                        </Typography>
                        <Typography variant="body1">
                          {profile.postal_code || 'Chưa cập nhật'}
                        </Typography>
                      </Box>

                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Quốc gia
                        </Typography>
                        <Typography variant="body1">
                          {profile.country || 'Chưa cập nhật'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Order History */}
            {profile.recent_orders && profile.recent_orders.length > 0 && (
              <Box>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ShoppingCart />
                      Lịch sử mua hàng gần đây
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {profile.recent_orders.map((order) => (
                        <Box key={order.id} sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {order.order_code}
                            </Typography>
                            <Chip
                              label={order.status}
                              color={order.status === 'delivered' ? 'success' : 'primary'}
                              size="small"
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {order.product_name} x {order.quantity}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Tổng tiền: {order.total_amount.toLocaleString('vi-VN')} VNĐ
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(order.created_at).toLocaleDateString('vi-VN')}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={() => setIsEditing(true)}
              >
                Chỉnh sửa thông tin
              </Button>
            </Box>
          </Box>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <PasswordChangeForm
          onSuccess={handlePasswordChange}
          onCancel={() => { }}
        />
      </TabPanel>
    </Container>
  );
};