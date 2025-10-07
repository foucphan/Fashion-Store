// Frontend Environment Configuration
// ==================================

export const config = {
  // API Configuration
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  
  // App Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Fashion Store',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // Environment
  NODE_ENV: import.meta.env.VITE_NODE_ENV || 'development',
  
  // Features
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true' || false,
  ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG === 'true' || true,
  
  // API Endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      ME: '/auth/me',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
    },
    HEALTH: '/health',
  },
  
  // Local Storage Keys
  STORAGE_KEYS: {
    TOKEN: 'token',
    USER: 'user',
    THEME: 'theme',
  },
  
  // Default Values
  DEFAULTS: {
    PAGE_SIZE: 12,
    DEBOUNCE_DELAY: 300,
    TOAST_DURATION: 3000,
  },
};
