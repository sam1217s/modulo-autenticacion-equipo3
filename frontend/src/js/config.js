/**
 * Application Configuration
 * Centralizes all configuration settings for the frontend
 */

// Environment detection
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname.includes('192.168.');

// Get current origin for production
const getProductionBaseUrl = () => {
  return window.location.origin; // Usa el dominio actual de Render
};

// API Configuration
const API_CONFIG = {
  BASE_URL: isDevelopment ? 'http://localhost:4000' : getProductionBaseUrl(),
  ENDPOINTS: {
    AUTH: '/api/auth',
    HEALTH: '/api/health'
  },
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3
};

// Application Settings
const APP_CONFIG = {
  NAME: 'AuthApp',
  VERSION: '1.0.0',
  AUTHOR: 'Equipo 3',
  
  // Storage keys for localStorage
  STORAGE_KEYS: {
    TOKEN: 'authapp_token',
    USER: 'authapp_user',
    PREFERENCES: 'authapp_preferences',
    THEME: 'authapp_theme'
  },
  
  // Default user preferences
  DEFAULT_PREFERENCES: {
    theme: 'light',
    language: 'es',
    notifications: true,
    autoSave: true
  },
  
  // UI Configuration
  UI: {
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 500,
    TOAST_DURATION: 4000,
    LOADING_MIN_DURATION: 800
  },
  
  // Validation rules
  VALIDATION: {
    USERNAME: {
      MIN_LENGTH: 3,
      MAX_LENGTH: 30,
      PATTERN: /^[a-zA-Z0-9._]+$/
    },
    PASSWORD: {
      MIN_LENGTH: 6,
      MAX_LENGTH: 128
    }
  }
};

// Theme Configuration
const THEME_CONFIG = {
  LIGHT: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#0f172a'
  },
  DARK: {
    primary: '#818cf8',
    secondary: '#a78bfa',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f8fafc'
  }
};

// Feature Flags
const FEATURE_FLAGS = {
  ENABLE_DARK_MODE: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_ANALYTICS: false,
  ENABLE_PWA: false,
  ENABLE_OFFLINE_MODE: false
};

// Development Configuration
const DEV_CONFIG = {
  ENABLE_CONSOLE_LOGS: isDevelopment,
  ENABLE_DEBUG_MODE: isDevelopment,
  MOCK_API_DELAY: 1000,
  SHOW_PERFORMANCE_METRICS: isDevelopment
};

// Export configuration object
window.AppConfig = {
  API: API_CONFIG,
  APP: APP_CONFIG,
  THEME: THEME_CONFIG,
  FEATURES: FEATURE_FLAGS,
  DEV: DEV_CONFIG,
  IS_DEVELOPMENT: isDevelopment
};

// Utility function to get API URL
window.getApiUrl = (endpoint = '') => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Utility function to log in development mode
window.devLog = (...args) => {
  if (DEV_CONFIG.ENABLE_CONSOLE_LOGS) {
    console.log('[AuthApp]', ...args);
  }
};

// Utility function to handle errors
window.handleError = (error, context = 'Unknown') => {
  if (DEV_CONFIG.ENABLE_CONSOLE_LOGS) {
    console.error(`[AuthApp Error - ${context}]`, error);
  }
  
  // In production, you might want to send errors to a logging service
  if (!isDevelopment) {
    // sendToErrorTracking(error, context);
  }
};