/**
 * Authentication Module
 * Handles all authentication-related functionality
 */

// ========================================
// AUTH STATE MANAGEMENT
// ========================================

class AuthManager {
  constructor() {
    this.token = null;
    this.user = null;
    this.isAuthenticated = false;
    this.init();
  }

  init() {
    // Load token and user from storage
    this.token = Utils.Storage.get(window.AppConfig.APP.STORAGE_KEYS.TOKEN);
    this.user = Utils.Storage.get(window.AppConfig.APP.STORAGE_KEYS.USER);
    this.isAuthenticated = !!this.token;
    
    // Verify token on page load
    if (this.token) {
      this.verifyToken();
    }
  }

  setAuth(token, user) {
    this.token = token;
    this.user = user;
    this.isAuthenticated = true;
    
    // Save to storage
    Utils.Storage.set(window.AppConfig.APP.STORAGE_KEYS.TOKEN, token);
    Utils.Storage.set(window.AppConfig.APP.STORAGE_KEYS.USER, user);
    
    window.devLog('User authenticated:', user);
  }

  clearAuth() {
    this.token = null;
    this.user = null;
    this.isAuthenticated = false;
    
    // Clear storage
    Utils.Storage.remove(window.AppConfig.APP.STORAGE_KEYS.TOKEN);
    Utils.Storage.remove(window.AppConfig.APP.STORAGE_KEYS.USER);
    
    window.devLog('User logged out');
  }

  getAuthHeaders() {
    return this.token ? {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    } : {
      'Content-Type': 'application/json'
    };
  }

  async verifyToken() {
    if (!this.token) return false;
    
    try {
      const response = await this.makeAuthenticatedRequest('/me');
      if (response.ok) {
        const data = await response.json();
        this.user = data.user;
        Utils.Storage.set(window.AppConfig.APP.STORAGE_KEYS.USER, this.user);
        return true;
      } else {
        this.clearAuth();
        return false;
      }
    } catch (error) {
      window.handleError(error, 'Token verification');
      this.clearAuth();
      return false;
    }
  }

  async makeAuthenticatedRequest(endpoint, options = {}) {
    const url = window.getApiUrl(`${window.AppConfig.API.ENDPOINTS.AUTH}${endpoint}`);
    
    return fetch(url, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers
      }
    });
  }
}

// Create global auth manager instance
window.Auth = new AuthManager();

// ========================================
// API FUNCTIONS
// ========================================

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>}
 */
async function registerUser(userData) {
  const url = window.getApiUrl(`${window.AppConfig.API.ENDPOINTS.AUTH}/register`);
  
  try {
    window.devLog('Registering user:', userData.username);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (response.ok) {
      window.devLog('Registration successful');
      return {
        success: true,
        message: data.message || 'Usuario registrado exitosamente',
        user: data.user
      };
    } else {
      window.devLog('Registration failed:', data);
      return {
        success: false,
        message: data.error || 'Error en el registro',
        details: data.details
      };
    }
  } catch (error) {
    window.handleError(error, 'User registration');
    return {
      success: false,
      message: 'Error de conexión. Verifique su conexión a internet.'
    };
  }
}

/**
 * Login user
 * @param {Object} credentials - User login credentials
 * @returns {Promise<Object>}
 */
async function loginUser(credentials) {
  const url = window.getApiUrl(`${window.AppConfig.API.ENDPOINTS.AUTH}/login`);
  
  try {
    window.devLog('Logging in user:', credentials.username);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    const data = await response.json();

    if (response.ok) {
      window.devLog('Login successful');
      
      // Set authentication state
      window.Auth.setAuth(data.token, data.user);
      
      return {
        success: true,
        message: data.message || 'Inicio de sesión exitoso',
        token: data.token,
        user: data.user
      };
    } else {
      window.devLog('Login failed:', data);
      return {
        success: false,
        message: data.error || 'Credenciales inválidas'
      };
    }
  } catch (error) {
    window.handleError(error, 'User login');
    return {
      success: false,
      message: 'Error de conexión. Verifique su conexión a internet.'
    };
  }
}

/**
 * Logout user
 * @returns {Promise<Object>}
 */
async function logoutUser() {
  try {
    // Try to notify backend about logout
    if (window.Auth.isAuthenticated) {
      const response = await window.Auth.makeAuthenticatedRequest('/logout', {
        method: 'POST'
      });
      
      if (response.ok) {
        window.devLog('Server logout successful');
      }
    }
  } catch (error) {
    window.devLog('Server logout failed, but continuing with client logout');
  } finally {
    // Always clear client-side auth state
    window.Auth.clearAuth();
    
    return {
      success: true,
      message: 'Sesión cerrada correctamente'
    };
  }
}

/**
 * Get dashboard data
 * @returns {Promise<Object>}
 */
async function getDashboardData() {
  try {
    window.devLog('Fetching dashboard data');
    
    const response = await window.Auth.makeAuthenticatedRequest('/dashboard');
    
    if (response.ok) {
      const data = await response.json();
      window.devLog('Dashboard data loaded');
      return {
        success: true,
        data
      };
    } else if (response.status === 401) {
      // Token expired or invalid
      window.Auth.clearAuth();
      return {
        success: false,
        message: 'Sesión expirada. Por favor, inicia sesión nuevamente.',
        shouldRedirect: true
      };
    } else {
      return {
        success: false,
        message: 'Error al cargar los datos del dashboard'
      };
    }
  } catch (error) {
    window.handleError(error, 'Dashboard data fetch');
    return {
      success: false,
      message: 'Error de conexión al cargar el dashboard'
    };
  }
}

// ========================================
// FORM HANDLERS
// ========================================

/**
 * Handle registration form submission
 * @param {Event} event - Form submit event
 */
async function handleRegistration(event) {
  event.preventDefault();
  
  const form = event.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.querySelector('.btn-text').textContent;
  
  try {
    // Get form data
    const formData = Utils.getFormData(form);
    const { username, password, confirmPassword } = formData;
    
    // Validate form
    const validation = validateRegistrationForm(formData);
    if (!validation.isValid) {
      Utils.showAlert(validation.errors[0], 'error');
      return;
    }
    
    // Set loading state
    Utils.setButtonLoading(submitBtn, true, 'Creando cuenta...');
    Utils.showLoading('Registrando usuario...');
    
    // Register user
    const result = await registerUser({ username, password });
    
    if (result.success) {
      Utils.showAlert(result.message, 'success');
      
      // Clear form and redirect after delay
      Utils.clearForm(form);
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    } else {
      if (result.details && Array.isArray(result.details)) {
        Utils.showAlert(result.details.join(', '), 'error');
      } else {
        Utils.showAlert(result.message, 'error');
      }
    }
  } catch (error) {
    window.handleError(error, 'Registration form');
    Utils.showAlert('Error inesperado durante el registro', 'error');
  } finally {
    Utils.setButtonLoading(submitBtn, false);
    Utils.hideLoading();
    
    // Restore original button text
    const textElement = submitBtn.querySelector('.btn-text');
    if (textElement && originalText) {
      textElement.textContent = originalText;
    }
  }
}

/**
 * Handle login form submission
 * @param {Event} event - Form submit event
 */
async function handleLogin(event) {
  event.preventDefault();
  
  const form = event.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.querySelector('.btn-text').textContent;
  
  try {
    // Get form data
    const formData = Utils.getFormData(form);
    const { username, password } = formData;
    
    // Validate form
    const validation = validateLoginForm(formData);
    if (!validation.isValid) {
      Utils.showAlert(validation.errors[0], 'error');
      return;
    }
    
    // Set loading state
    Utils.setButtonLoading(submitBtn, true, 'Iniciando sesión...');
    Utils.showLoading('Verificando credenciales...');
    
    // Login user
    const result = await loginUser({ username, password });
    
    if (result.success) {
      Utils.showAlert(`¡Bienvenido, ${result.user.username}!`, 'success');
      
      // Redirect to dashboard after delay
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    } else {
      Utils.showAlert(result.message, 'error');
    }
  } catch (error) {
    window.handleError(error, 'Login form');
    Utils.showAlert('Error inesperado durante el inicio de sesión', 'error');
  } finally {
    Utils.setButtonLoading(submitBtn, false);
    Utils.hideLoading();
    
    // Restore original button text
    const textElement = submitBtn.querySelector('.btn-text');
    if (textElement && originalText) {
      textElement.textContent = originalText;
    }
  }
}

// ========================================
// VALIDATION FUNCTIONS
// ========================================

/**
 * Validate registration form
 * @param {Object} formData - Form data object
 * @returns {Object} Validation result
 */
function validateRegistrationForm(formData) {
  const errors = [];
  const { username, password, confirmPassword, acceptTerms } = formData;
  
  // Validate username
  const usernameValidation = Utils.validateUsername(username);
  if (!usernameValidation.isValid) {
    errors.push(...usernameValidation.errors);
  }
  
  // Validate password
  const passwordValidation = Utils.validatePassword(password);
  if (!passwordValidation.isValid) {
    errors.push(...passwordValidation.errors);
  }
  
  // Validate password confirmation
  if (password !== confirmPassword) {
    errors.push('Las contraseñas no coinciden');
  }
  
  // Validate terms acceptance
  if (!acceptTerms) {
    errors.push('Debes aceptar los términos y condiciones');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate login form
 * @param {Object} formData - Form data object
 * @returns {Object} Validation result
 */
function validateLoginForm(formData) {
  const errors = [];
  const { username, password } = formData;
  
  if (!username || username.trim().length === 0) {
    errors.push('El nombre de usuario es requerido');
  }
  
  if (!password || password.length === 0) {
    errors.push('La contraseña es requerida');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// ========================================
// UI HELPER FUNCTIONS
// ========================================

/**
 * Toggle password visibility
 * @param {string} inputId - Password input ID
 */
function togglePassword(inputId) {
  const input = Utils.getElementById(inputId);
  const button = input?.parentElement.querySelector('.password-toggle');
  const icon = button?.querySelector('i');
  
  if (input && button && icon) {
    if (input.type === 'password') {
      input.type = 'text';
      icon.className = 'fas fa-eye-slash';
    } else {
      input.type = 'password';
      icon.className = 'fas fa-eye';
    }
  }
}

/**
 * Check if user should be redirected
 */
function checkAuthRedirect() {
  const currentPage = window.location.pathname.split('/').pop();
  
  // If on auth pages and already logged in, redirect to dashboard
  if ((currentPage === 'index.html' || currentPage === 'register.html' || currentPage === '') && window.Auth.isAuthenticated) {
    window.location.href = 'dashboard.html';
    return;
  }
  
  // If on dashboard and not logged in, redirect to login
  if (currentPage === 'dashboard.html' && !window.Auth.isAuthenticated) {
    Utils.showAlert('Debes iniciar sesión para acceder al dashboard', 'warning');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
    return;
  }
}

/**
 * Handle logout action
 */
async function logout() {
  // Confirmación más amigable
  if (!confirm('¿Estás seguro de que quieres cerrar sesión?')) {
    return;
  }
  
  Utils.showLoading('Cerrando sesión...');
  
  try {
    const result = await logoutUser();
    
    if (result.success) {
      Utils.showAlert(result.message, 'success', 2000);
      
      // Limpiar datos locales inmediatamente
      Utils.Storage.clear();
      
      // Pequeña demora para mostrar el mensaje de éxito
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    } else {
      // Si falla el logout del servidor, igual limpiar localmente
      Utils.Storage.clear();
      Utils.showAlert('Sesión cerrada localmente', 'warning', 2000);
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    }
  } catch (error) {
    window.handleError(error, 'Logout');
    
    // Siempre limpiar datos locales y redirigir
    Utils.Storage.clear();
    Utils.showAlert('Sesión cerrada', 'success', 2000);
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  } finally {
    Utils.hideLoading();
  }
}

/**
 * Handle emergency logout (for expired tokens, etc.)
 */
function emergencyLogout(message = 'Sesión expirada') {
  Utils.Storage.clear();
  window.Auth.clearAuth();
  Utils.showAlert(message, 'warning', 3000);
  
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 2000);
}

// Make functions available globally
window.AuthFunctions = {
  registerUser,
  loginUser,
  logoutUser,
  getDashboardData,
  handleRegistration,
  handleLogin,
  togglePassword,
  checkAuthRedirect,
  logout,
  emergencyLogout
};