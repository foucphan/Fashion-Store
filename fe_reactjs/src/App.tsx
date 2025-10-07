import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/layout/Layout';
import { AuthPage } from './components/auth/AuthPage';
import { ResetPasswordForm } from './components/auth/ResetPasswordForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { HomePage } from './pages/HomePage';
import { WarrantyPage } from './pages/WarrantyPage';
import { AboutPage } from './pages/AboutPage';

// Tạo theme Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<AuthPage />} />
              <Route path="/register" element={<AuthPage />} />
              <Route path="/forgot-password" element={<AuthPage />} />
              <Route path="/reset-password" element={<ResetPasswordForm />} />
              
              {/* Protected routes with layout */}
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="products" element={<div>Products Page - Coming Soon</div>} />
                <Route path="search" element={<div>Search Page - Coming Soon</div>} />
                <Route path="warranty" element={<WarrantyPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="cart" element={
                  <ProtectedRoute>
                    <div>Cart Page - Coming Soon</div>
                  </ProtectedRoute>
                } />
                <Route path="wishlist" element={
                  <ProtectedRoute>
                    <div>Wishlist Page - Coming Soon</div>
                  </ProtectedRoute>
                } />
                <Route path="profile" element={
                  <ProtectedRoute>
                    <div>Profile Page - Coming Soon</div>
                  </ProtectedRoute>
                } />
                <Route path="settings" element={
                  <ProtectedRoute>
                    <div>Settings Page - Coming Soon</div>
                  </ProtectedRoute>
                } />
              </Route>
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
