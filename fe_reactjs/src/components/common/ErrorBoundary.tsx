import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            p: 2,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              maxWidth: 500,
              width: '100%',
            }}
          >
            <ErrorOutline sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Đã xảy ra lỗi
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Xin lỗi, đã có lỗi xảy ra trong ứng dụng. Vui lòng thử lại sau.
            </Typography>
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
            >
              Tải lại trang
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}
