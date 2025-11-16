import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthContextType, LoginRequest, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest } from '../types/auth';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_USER'; payload: User };

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  isAuthenticated: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      console.log('🔐 AuthContext - Initializing auth, token exists:', !!token);
      console.log('🔐 AuthContext - Current state:', { user: !!state.user, isLoading: state.isLoading, isAuthenticated: state.isAuthenticated });

      if (token && !state.user && !state.isLoading) {
        try {
          console.log('🔐 AuthContext - Validating token...');
          dispatch({ type: 'SET_LOADING', payload: true });
          const user = await authService.getCurrentUser();
          console.log('🔐 AuthContext - Token validation successful, user:', user);
          dispatch({ type: 'SET_USER', payload: user });
        } catch (error) {
          console.warn('🔐 AuthContext - Token validation failed:', error);
          localStorage.removeItem('token');
          dispatch({ type: 'LOGOUT' });
        }
      } else if (!token && state.isAuthenticated) {
        console.log('🔐 AuthContext - No token but user is authenticated, logging out');
        dispatch({ type: 'LOGOUT' });
      }
    };

    initAuth();
  }, []); // Remove dependency to prevent infinite loop

  // Listen for custom logout events from interceptor
  useEffect(() => {
    const handleLogout = () => {
      console.log('Received auth:logout event, logging out user');
      dispatch({ type: 'LOGOUT' });
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authService.login(credentials);

      // Debug logging
      console.log('Login response:', response);
      console.log('Token received:', response.token);

      // Set token in localStorage
      localStorage.setItem('token', response.token);

      // Verify token was set
      const savedToken = localStorage.getItem('token');
      console.log('Token saved to localStorage:', savedToken);

      dispatch({ type: 'LOGIN_SUCCESS', payload: response });

      // Verify state after login
      console.log('Auth state after login:', {
        user: response.user,
        token: response.token,
        isAuthenticated: true
      });

    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authService.register(userData);
      localStorage.setItem('token', response.token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: response });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  const forgotPassword = async (email: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await authService.forgotPassword(email);
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const resetPassword = async (data: ResetPasswordRequest) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await authService.resetPassword(data);
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const value: AuthContextType = {
    user: state.user,
    token: state.token,
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
