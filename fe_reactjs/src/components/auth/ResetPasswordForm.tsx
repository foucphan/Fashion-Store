import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { useSearchParams, useNavigate } from 'react-router-dom';

const schema = yup.object({
  password: yup
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Mật khẩu phải chứa ít nhất 1 chữ thường, 1 chữ hoa và 1 số')
    .required('Vui lòng nhập mật khẩu'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp')
    .required('Vui lòng xác nhận mật khẩu'),
});

export const ResetPasswordForm: React.FC = () => {
  const { resetPassword, isLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [token, setToken] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ password: string; confirmPassword: string }>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError('Token không hợp lệ hoặc đã hết hạn');
    }
  }, [searchParams]);

  const onSubmit = async (data: { password: string; confirmPassword: string }) => {
    if (!token) {
      setError('Token không hợp lệ');
      return;
    }

    try {
      setError('');
      setSuccess('');
      await resetPassword({
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      setSuccess('Mật khẩu đã được đặt lại thành công. Bạn có thể đăng nhập với mật khẩu mới.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đặt lại mật khẩu thất bại');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: { xs: 4, md: 8 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            borderRadius: 4,
            backdropFilter: 'blur(10px)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))',
            border: '1px solid rgba(255,255,255,0.18)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom sx={{ color: 'white', textAlign: 'center' }}>
            Đặt Lại Mật Khẩu
          </Typography>
          
          <Typography variant="body2" sx={{ mb: 3, textAlign: 'center', color: 'rgba(255,255,255,0.8)' }}>
            Nhập mật khẩu mới của bạn
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ width: '100%' }}
          >
            <TextField
              {...register('password')}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mật khẩu mới"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              autoFocus
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
                },
              }}
            />

            <TextField
              {...register('confirmPassword')}
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Xác nhận mật khẩu mới"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              autoComplete="new-password"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={toggleConfirmPasswordVisibility}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backdropFilter: 'blur(6px)',
                  backgroundColor: 'rgba(255,255,255,0.9)',
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
                background: 'linear-gradient(90deg, #22d3ee 0%, #6366f1 50%, #8b5cf6 100%)',
                boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
                textTransform: 'none',
                fontSize: 16,
                fontWeight: 600,
                '&:hover': {
                  boxShadow: '0 12px 28px rgba(99,102,241,0.45)',
                  filter: 'brightness(1.03)',
                },
              }}
              disabled={isLoading || !token}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Đặt Lại Mật Khẩu'
              )}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
