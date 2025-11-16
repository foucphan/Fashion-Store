import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { LoginRequest } from '../../types/auth';

const schema = yup.object({
  email: yup
    .string()
    .email('Email không hợp lệ')
    .required('Vui lòng nhập email'),
  password: yup
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Vui lòng nhập mật khẩu'),
});

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onSwitchToForgotPassword: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSwitchToRegister,
  onSwitchToForgotPassword,
}) => {
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginRequest) => {
    try {
      setError('');
      await login(data);
      // Redirect will be handled by AuthGuard based on user role
      // Admin users will be redirected to /admin
      // Regular users will be redirected to /
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: { xs: 2, md: 4 },
          marginBottom: { xs: 2, md: 4 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: { xs: '100%', sm: '500px' },
            borderRadius: 4,
            backdropFilter: 'blur(10px)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))',
            border: '1px solid rgba(255,255,255,0.18)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom sx={{ color: 'white', textAlign: 'center' }}>
            Đăng Nhập
          </Typography>

          <Typography variant="body2" sx={{ mb: 3, color: 'rgba(255,255,255,0.8)', textAlign: 'center' }}>
            Chào mừng bạn quay trở lại!
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ width: '100%' }}
          >
            <TextField
              {...register('email')}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backdropFilter: 'blur(6px)',
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  height: '56px',
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(0,0,0,0.6)',
                },
                '& .MuiOutlinedInput-input': {
                  padding: '16px 14px',
                },
              }}
            />

            <TextField
              {...register('password')}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backdropFilter: 'blur(6px)',
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  height: '56px',
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(0,0,0,0.6)',
                },
                '& .MuiOutlinedInput-input': {
                  padding: '16px 14px',
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: 10,
                background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
                boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
                textTransform: 'none',
                fontSize: 16,
                fontWeight: 600,
                '&:hover': {
                  boxShadow: '0 12px 28px rgba(99,102,241,0.45)',
                  filter: 'brightness(1.03)',
                },
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Đăng Nhập'
              )}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link
                component="button"
                variant="body2"
                onClick={onSwitchToForgotPassword}
                sx={{ mr: 2, color: 'rgba(255,255,255,0.9)' }}
              >
                Quên mật khẩu?
              </Link>
              <Typography variant="body2" component="span" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Chưa có tài khoản?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={onSwitchToRegister}
                  sx={{ fontWeight: 'bold', color: '#fff' }}
                >
                  Đăng ký ngay
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
