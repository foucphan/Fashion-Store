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
} from '@mui/material';
import {
  Email,
  ArrowBack,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';

const schema = yup.object({
  email: yup
    .string()
    .email('Email không hợp lệ')
    .required('Vui lòng nhập email'),
});

interface ForgotPasswordFormProps {
  onSwitchToLogin: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSwitchToLogin,
}) => {
  const { forgotPassword, isLoading } = useAuth();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: { email: string }) => {
    try {
      setError('');
      setSuccess('');
      await forgotPassword(data.email);
      setSuccess('Email khôi phục mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gửi email thất bại');
    }
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
            Quên Mật Khẩu
          </Typography>
          
          <Typography variant="body2" sx={{ mb: 3, textAlign: 'center', color: 'rgba(255,255,255,0.8)' }}>
            Nhập email của bạn để nhận liên kết khôi phục mật khẩu
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
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Gửi Email Khôi Phục'
              )}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link
                component="button"
                variant="body2"
                onClick={onSwitchToLogin}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: 'rgba(255,255,255,0.9)' }}
              >
                <ArrowBack fontSize="small" />
                Quay lại đăng nhập
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
