import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        navigate('/login');
      } else if (!requireAuth && isAuthenticated) {
        navigate('/');
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, navigate]);

  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh',
          gap: 2
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Đang xác thực...
        </Typography>
      </Box>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null; // Will redirect to login
  }

  if (!requireAuth && isAuthenticated) {
    return null; // Will redirect to home
  }

  return <>{children}</>;
};
