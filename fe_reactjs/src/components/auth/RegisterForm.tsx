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
  Person,
  Phone,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { RegisterRequest } from '../../types/auth';

const schema = yup.object({
  username: yup
    .string()
    .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
    .max(20, 'Tên đăng nhập không được quá 20 ký tự')
    .matches(/^[a-zA-Z0-9_]+$/, 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới')
    .required('Vui lòng nhập tên đăng nhập'),
  email: yup
    .string()
    .email('Email không hợp lệ')
    .required('Vui lòng nhập email'),
  password: yup
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Mật khẩu phải chứa ít nhất 1 chữ thường, 1 chữ hoa và 1 số')
    .required('Vui lòng nhập mật khẩu'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp')
    .required('Vui lòng xác nhận mật khẩu'),
  full_name: yup
    .string()
    .min(2, 'Họ tên phải có ít nhất 2 ký tự')
    .required('Vui lòng nhập họ tên'),
  phone: yup
    .string()
    .matches(/^[0-9+\-\s()]+$/, 'Số điện thoại không hợp lệ')
    .optional(),
});

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSwitchToLogin,
}) => {
  const { register: registerUser, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterRequest) => {
    try {
      setError('');
      await registerUser(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Container component="main" maxWidth="md" sx={{ px: { xs: 1, sm: 2 } }}>
      <Box
        sx={{
          marginTop: { xs: 1, md: 4 },
          marginBottom: { xs: 1, md: 4 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: { xs: 'auto', md: '100vh' },
          justifyContent: { xs: 'flex-start', md: 'center' },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 5, md: 6 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: { xs: '100%', sm: '800px' },
            borderRadius: 4,
            backdropFilter: 'blur(10px)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))',
            border: '1px solid rgba(255,255,255,0.18)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
            mx: 'auto',
            overflow: 'visible',
            position: 'relative',
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom sx={{ color: 'white', textAlign: 'center' }}>
            Đăng Ký Tài Khoản
          </Typography>
          
          <Typography variant="body2" sx={{ mb: 3, color: 'rgba(255,255,255,0.8)', textAlign: 'center' }}>
            Tạo tài khoản để trải nghiệm mua sắm tốt nhất
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
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: { xs: 3, sm: 4 },
                width: '100%',
                alignItems: 'start',
                '& > *': {
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '100px',
                  position: 'relative',
                },
              }}
            >
              <TextField
                {...register('username')}
                required
                fullWidth
                id="username"
                label="Tên đăng nhập"
                name="username"
                autoComplete="username"
                error={!!errors.username}
                helperText={errors.username?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backdropFilter: 'blur(6px)',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    minHeight: '64px',
                    height: 'auto',
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    '& fieldset': {
                      borderColor: 'rgba(0,0,0,0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0,0,0,0.87)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976d2',
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(0,0,0,0.6)',
                    fontSize: '14px',
                    lineHeight: '1.2',
                    transform: 'translate(14px, 24px) scale(1)',
                    '&.Mui-focused': {
                      transform: 'translate(14px, -9px) scale(0.75)',
                      color: '#1976d2',
                    },
                    '&.MuiFormLabel-filled': {
                      transform: 'translate(14px, -9px) scale(0.75)',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '24px 14px 16px 14px',
                    minHeight: '24px',
                    fontSize: '16px',
                    lineHeight: '1.5',
                  },
                  '& .MuiFormHelperText-root': {
                    marginTop: '6px',
                    marginLeft: '0px',
                    fontSize: '12px',
                    lineHeight: '1.4',
                  },
                  '& .MuiInputAdornment-root': {
                    marginRight: '8px',
                    marginTop: '8px',
                    '& .MuiSvgIcon-root': {
                      fontSize: '20px',
                    },
                  },
                }}
              />
              <TextField
                {...register('full_name')}
                required
                fullWidth
                id="full_name"
                label="Họ và tên"
                name="full_name"
                autoComplete="name"
                error={!!errors.full_name}
                helperText={errors.full_name?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backdropFilter: 'blur(6px)',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    minHeight: '64px',
                    height: 'auto',
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    '& fieldset': {
                      borderColor: 'rgba(0,0,0,0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0,0,0,0.87)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976d2',
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(0,0,0,0.6)',
                    fontSize: '14px',
                    lineHeight: '1.2',
                    transform: 'translate(14px, 24px) scale(1)',
                    '&.Mui-focused': {
                      transform: 'translate(14px, -9px) scale(0.75)',
                      color: '#1976d2',
                    },
                    '&.MuiFormLabel-filled': {
                      transform: 'translate(14px, -9px) scale(0.75)',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '24px 14px 16px 14px',
                    minHeight: '24px',
                    fontSize: '16px',
                    lineHeight: '1.5',
                  },
                  '& .MuiFormHelperText-root': {
                    marginTop: '6px',
                    marginLeft: '0px',
                    fontSize: '12px',
                    lineHeight: '1.4',
                  },
                  '& .MuiInputAdornment-root': {
                    marginRight: '8px',
                    marginTop: '8px',
                    '& .MuiSvgIcon-root': {
                      fontSize: '20px',
                    },
                  },
                }}
              />
              <TextField
                {...register('email')}
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
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
                    minHeight: '64px',
                    height: 'auto',
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    '& fieldset': {
                      borderColor: 'rgba(0,0,0,0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0,0,0,0.87)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976d2',
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(0,0,0,0.6)',
                    fontSize: '14px',
                    lineHeight: '1.2',
                    transform: 'translate(14px, 24px) scale(1)',
                    '&.Mui-focused': {
                      transform: 'translate(14px, -9px) scale(0.75)',
                      color: '#1976d2',
                    },
                    '&.MuiFormLabel-filled': {
                      transform: 'translate(14px, -9px) scale(0.75)',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '24px 14px 16px 14px',
                    minHeight: '24px',
                    fontSize: '16px',
                    lineHeight: '1.5',
                  },
                  '& .MuiFormHelperText-root': {
                    marginTop: '6px',
                    marginLeft: '0px',
                    fontSize: '12px',
                    lineHeight: '1.4',
                  },
                  '& .MuiInputAdornment-root': {
                    marginRight: '8px',
                    marginTop: '8px',
                    '& .MuiSvgIcon-root': {
                      fontSize: '20px',
                    },
                  },
                }}
              />
              <TextField
                {...register('phone')}
                fullWidth
                id="phone"
                label="Số điện thoại"
                name="phone"
                autoComplete="tel"
                error={!!errors.phone}
                helperText={errors.phone?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backdropFilter: 'blur(6px)',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    minHeight: '64px',
                    height: 'auto',
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    '& fieldset': {
                      borderColor: 'rgba(0,0,0,0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0,0,0,0.87)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976d2',
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(0,0,0,0.6)',
                    fontSize: '14px',
                    lineHeight: '1.2',
                    transform: 'translate(14px, 24px) scale(1)',
                    '&.Mui-focused': {
                      transform: 'translate(14px, -9px) scale(0.75)',
                      color: '#1976d2',
                    },
                    '&.MuiFormLabel-filled': {
                      transform: 'translate(14px, -9px) scale(0.75)',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '24px 14px 16px 14px',
                    minHeight: '24px',
                    fontSize: '16px',
                    lineHeight: '1.5',
                  },
                  '& .MuiFormHelperText-root': {
                    marginTop: '6px',
                    marginLeft: '0px',
                    fontSize: '12px',
                    lineHeight: '1.4',
                  },
                  '& .MuiInputAdornment-root': {
                    marginRight: '8px',
                    marginTop: '8px',
                    '& .MuiSvgIcon-root': {
                      fontSize: '20px',
                    },
                  },
                }}
              />
              <TextField
                {...register('password')}
                required
                fullWidth
                name="password"
                label="Mật khẩu"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
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
                    minHeight: '64px',
                    height: 'auto',
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    '& fieldset': {
                      borderColor: 'rgba(0,0,0,0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0,0,0,0.87)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976d2',
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(0,0,0,0.6)',
                    fontSize: '14px',
                    lineHeight: '1.2',
                    transform: 'translate(14px, 24px) scale(1)',
                    '&.Mui-focused': {
                      transform: 'translate(14px, -9px) scale(0.75)',
                      color: '#1976d2',
                    },
                    '&.MuiFormLabel-filled': {
                      transform: 'translate(14px, -9px) scale(0.75)',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '24px 14px 16px 14px',
                    minHeight: '24px',
                    fontSize: '16px',
                    lineHeight: '1.5',
                  },
                  '& .MuiFormHelperText-root': {
                    marginTop: '6px',
                    marginLeft: '0px',
                    fontSize: '12px',
                    lineHeight: '1.4',
                  },
                  '& .MuiInputAdornment-root': {
                    marginRight: '8px',
                    marginTop: '8px',
                    '& .MuiSvgIcon-root': {
                      fontSize: '20px',
                    },
                  },
                }}
              />
              <TextField
                {...register('confirmPassword')}
                required
                fullWidth
                name="confirmPassword"
                label="Xác nhận mật khẩu"
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
                    minHeight: '64px',
                    height: 'auto',
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    '& fieldset': {
                      borderColor: 'rgba(0,0,0,0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0,0,0,0.87)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976d2',
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(0,0,0,0.6)',
                    fontSize: '14px',
                    lineHeight: '1.2',
                    transform: 'translate(14px, 24px) scale(1)',
                    '&.Mui-focused': {
                      transform: 'translate(14px, -9px) scale(0.75)',
                      color: '#1976d2',
                    },
                    '&.MuiFormLabel-filled': {
                      transform: 'translate(14px, -9px) scale(0.75)',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '24px 14px 16px 14px',
                    minHeight: '24px',
                    fontSize: '16px',
                    lineHeight: '1.5',
                  },
                  '& .MuiFormHelperText-root': {
                    marginTop: '6px',
                    marginLeft: '0px',
                    fontSize: '12px',
                    lineHeight: '1.4',
                  },
                  '& .MuiInputAdornment-root': {
                    marginRight: '8px',
                    marginTop: '8px',
                    '& .MuiSvgIcon-root': {
                      fontSize: '20px',
                    },
                  },
                }}
              />
            </Box>

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
                'Đăng Ký'
              )}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" component="span" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Đã có tài khoản?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={onSwitchToLogin}
                  sx={{ fontWeight: 'bold', color: '#fff' }}
                >
                  Đăng nhập ngay
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
