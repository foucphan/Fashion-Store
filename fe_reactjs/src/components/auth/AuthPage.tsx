import React, { useState } from 'react';
import { Box, Container, IconButton, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Home } from '@mui/icons-material';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';

type AuthMode = 'login' | 'register' | 'forgot-password';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const navigate = useNavigate();

  const switchToLogin = () => setMode('login');
  const switchToRegister = () => setMode('register');
  const switchToForgotPassword = () => setMode('forgot-password');
  const goToHome = () => navigate('/');

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 2, md: 4 },
        px: { xs: 1, sm: 2 },
        background: 'radial-gradient(1200px 600px at 10% 10%, rgba(102,126,234,0.35), transparent), radial-gradient(1000px 500px at 90% 20%, rgba(118,75,162,0.35), transparent), linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: { xs: '-80px', md: '-120px' },
          right: { xs: '-80px', md: '-120px' },
          width: { xs: 240, md: 360 },
          height: { xs: 240, md: 360 },
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(236,72,153,0.3))',
          filter: 'blur(60px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: '-100px', md: '-160px' },
          left: { xs: '-100px', md: '-140px' },
          width: { xs: 280, md: 420 },
          height: { xs: 280, md: 420 },
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(56,189,248,0.35), rgba(139,92,246,0.35))',
          filter: 'blur(70px)',
        }}
      />
      {/* Home Button */}
      <Tooltip title="Quay lại trang chủ">
        <IconButton
          onClick={goToHome}
          sx={{
            position: 'absolute',
            top: { xs: 16, md: 24 },
            left: { xs: 16, md: 24 },
            zIndex: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              transform: 'scale(1.05)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          <Home />
        </IconButton>
      </Tooltip>

      <Container maxWidth="md" sx={{ position: 'relative', width: '100%' }}>
        {mode === 'login' && (
          <LoginForm
            onSwitchToRegister={switchToRegister}
            onSwitchToForgotPassword={switchToForgotPassword}
          />
        )}
        {mode === 'register' && (
          <RegisterForm onSwitchToLogin={switchToLogin} />
        )}
        {mode === 'forgot-password' && (
          <ForgotPasswordForm onSwitchToLogin={switchToLogin} />
        )}
      </Container>
    </Box>
  );
};
