/**
 * Main Application Entry Point
 * Coordinates all modules and handles global application logic
 */

// ========================================
// APPLICATION CLASS
// ========================================

class AuthApp {
  constructor() {
    this.version = window.AppConfig.APP.VERSION;
    this.isInitialized = false;
    this.currentPage = this.getCurrentPage();
    
    window.devLog(`AuthApp v${this.version} initializing...`);
    this.init();
  }

  init() {
    if (this.isInitialized) return;
    
    try {
      // Setup global error handling
      this.setupErrorHandling();
      
      // Initialize based on current page
      this.initializePage();
      
      // Setup global event listeners
      this.setupGlobalEventListeners();
      
      // Setup theme management
      this.setupThemeManagement();
      
      // Check authentication and redirect if needed
      window.AuthFunctions.checkAuthRedirect();
      
      this.isInitialized = true;
      window.devLog('AuthApp initialized successfully');
      
    } catch (error) {
      window.handleError(error, 'App initialization');
      this.showCriticalError();
    }
  }

  getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    
    // Normalize page names
    const pageMap = {
      '': 'index.html',
      'index.html': 'login',
      'register.html': 'register', 
      'dashboard.html': 'dashboard'
    };
    
    return pageMap[page] || page;
  }

  initializePage() {
    window.devLog(`Initializing page: ${this.currentPage}`);
    
    switch (this.currentPage) {
      case 'login':
        this.initializeLoginPage();
        break;
      case 'register':
        this.initializeRegisterPage();
        break;
      case 'dashboard':
        this.initializeDashboardPage();
        break;
      default:
        window.devLog('Unknown page type');
    }
  }

  initializeLoginPage() {
    const loginForm = Utils.getElementById('loginForm');
    
    if (loginForm) {
      loginForm.addEventListener('submit', window.AuthFunctions.handleLogin);
      
      // Focus on username field
      const usernameField = Utils.getElementById('username');
      if (usernameField) {
        usernameField.focus();
      }
      
      // Setup remember me functionality
      this.setupRememberMe();
    }
    
    window.devLog('Login page initialized');
  }

  initializeRegisterPage() {
    const registerForm = Utils.getElementById('registerForm');
    
    if (registerForm) {
      registerForm.addEventListener('submit', window.AuthFunctions.handleRegistration);
      
      // Setup real-time password strength indicator
      this.setupPasswordStrengthIndicator();
      
      // Setup password confirmation validation
      this.setupPasswordConfirmation();
      
      // Focus on username field
      const usernameField = Utils.getElementById('username');
      if (usernameField) {
        usernameField.focus();
      }
    }
    
    window.devLog('Register page initialized');
  }

  initializeDashboardPage() {
    // Dashboard initialization is handled by dashboard.js
    // Here we just ensure user is authenticated
    if (!window.Auth.isAuthenticated) {
      Utils.showAlert('Acceso no autorizado', 'error');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
      return;
    }
    
    window.devLog('Dashboard page initialized');
  }

  setupErrorHandling() {
    // Global error handler for unhandled errors
    window.addEventListener('error', (event) => {
      window.handleError(event.error, 'Global error handler');
    });
    
    // Global error handler for unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      window.handleError(event.reason, 'Unhandled promise rejection');
      event.preventDefault(); // Prevent console error
    });
  }

  setupGlobalEventListeners() {
    // Global click handler for logout buttons
    document.addEventListener('click', (event) => {
      if (event.target.matches('[onclick*="logout"]') || 
          event.target.closest('[onclick*="logout"]')) {
        event.preventDefault();
        window.AuthFunctions.logout();
      }
    });
    
    // Global form validation on input
    document.addEventListener('input', (event) => {
      if (event.target.matches('input[type="password"]')) {
        this.handlePasswordInput(event.target);
      }
    });
    
    // Handle browser back/forward navigation
    window.addEventListener('popstate', () => {
      window.AuthFunctions.checkAuthRedirect();
    });
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && window.Auth.isAuthenticated) {
        // Page became visible, verify token
        window.Auth.verifyToken();
      }
    });
  }

  setupThemeManagement() {
    const savedTheme = Utils.Storage.get(window.AppConfig.APP.STORAGE_KEYS.THEME, 'light');
    this.applyTheme(savedTheme);
    
    // Listen for system theme changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        if (savedTheme === 'auto') {
          this.applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    Utils.Storage.set(window.AppConfig.APP.STORAGE_KEYS.THEME, theme);
  }

  setupRememberMe() {
    const rememberCheckbox = Utils.getElementById('rememberMe');
    const usernameField = Utils.getElementById('username');
    
    if (rememberCheckbox && usernameField) {
      // Load remembered username
      const rememberedUsername = Utils.Storage.get('remembered_username');
      if (rememberedUsername) {
        usernameField.value = rememberedUsername;
        rememberCheckbox.checked = true;
      }
      
      // Save/remove username on checkbox change
      rememberCheckbox.addEventListener('change', () => {
        if (rememberCheckbox.checked) {
          Utils.Storage.set('remembered_username', usernameField.value);
        } else {
          Utils.Storage.remove('remembered_username');
        }
      });
      
      // Update remembered username when typing
      usernameField.addEventListener('input', () => {
        if (rememberCheckbox.checked) {
          Utils.Storage.set('remembered_username', usernameField.value);
        }
      });
    }
  }

  setupPasswordStrengthIndicator() {
    const passwordField = Utils.getElementById('password');
    const strengthElement = Utils.querySelector('.password-strength');
    
    if (passwordField && strengthElement) {
      passwordField.addEventListener('input', () => {
        Utils.updatePasswordStrength(passwordField.value, strengthElement);
      });
    }
  }

  setupPasswordConfirmation() {
    const passwordField = Utils.getElementById('password');
    const confirmPasswordField = Utils.getElementById('confirmPassword');
    
    if (passwordField && confirmPasswordField) {
      const validatePasswords = () => {
        const password = passwordField.value;
        const confirmPassword = confirmPasswordField.value;
        
        if (confirmPassword && password !== confirmPassword) {
          confirmPasswordField.setCustomValidity('Las contraseñas no coinciden');
        } else {
          confirmPasswordField.setCustomValidity('');
        }
      };
      
      passwordField.addEventListener('input', validatePasswords);
      confirmPasswordField.addEventListener('input', validatePasswords);
    }
  }

  handlePasswordInput(passwordInput) {
    // Real-time password validation feedback
    const validation = Utils.validatePassword(passwordInput.value);
    
    // Update input visual state
    if (passwordInput.value.length > 0) {
      if (validation.isValid) {
        Utils.removeClass(passwordInput, 'invalid');
        Utils.addClass(passwordInput, 'valid');
      } else {
        Utils.removeClass(passwordInput, 'valid');
        Utils.addClass(passwordInput, 'invalid');
      }
    } else {
      Utils.removeClass(passwordInput, 'valid');
      Utils.removeClass(passwordInput, 'invalid');
    }
  }

  showCriticalError() {
    document.body.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        text-align: center;
        padding: 2rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-family: 'Inter', sans-serif;
      ">
        <div style="
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 3rem;
          max-width: 400px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        ">
          <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem; color: #f59e0b;"></i>
          <h2 style="margin-bottom: 1rem;">Error Crítico</h2>
          <p style="margin-bottom: 2rem; opacity: 0.9;">
            La aplicación no pudo inicializarse correctamente. 
            Por favor, recarga la página o contacta al soporte técnico.
          </p>
          <button onclick="window.location.reload()" style="
            background: #6366f1;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
          ">
            Recargar Página
          </button>
        </div>
      </div>
    `;
  }

  // Public methods for external use
  getVersion() {
    return this.version;
  }

  getCurrentPageType() {
    return this.currentPage;
  }

  isReady() {
    return this.isInitialized;
  }
}

// ========================================
// GLOBAL FUNCTIONS
// ========================================

/**
 * Global function to handle password toggle (called from HTML)
 * @param {string} inputId - Password input ID
 */
function togglePassword(inputId) {
  window.AuthFunctions.togglePassword(inputId);
}

/**
 * Global function to handle logout (called from HTML)
 */
function logout() {
  window.AuthFunctions.logout();
}

/**
 * Global function to confirm logout with Bootstrap modal (called from HTML)
 */
function confirmLogout() {
  window.AuthFunctions.confirmLogout();
}

/**
 * Global function to execute logout after confirmation (called from HTML)
 */
function executeLogout() {
  window.AuthFunctions.executeLogout();
}

/**
 * Global function to hide alert (called from HTML)
 */
function hideAlert() {
  Utils.hideAlert();
}

/**
 * Global function to toggle sidebar (called from HTML)
 */
function toggleSidebar() {
  if (window.DashboardFunctions) {
    window.DashboardFunctions.toggleSidebar();
  }
}

/**
 * Global function to toggle user menu (called from HTML)
 */
function toggleUserMenu() {
  if (window.DashboardFunctions) {
    window.DashboardFunctions.toggleUserMenu();
  }
}

// ========================================
// APPLICATION INITIALIZATION
// ========================================

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Create global app instance
    window.App = new AuthApp();
    
    // Add development helpers
    if (window.AppConfig.DEV.ENABLE_DEBUG_MODE) {
      window.devMode = {
        auth: window.Auth,
        utils: window.Utils,
        config: window.AppConfig,
        app: window.App
      };
      
      window.devLog('Development mode enabled. Access dev tools via window.devMode');
    }
    
  } catch (error) {
    window.handleError(error, 'Application startup');
    
    // Show fallback error message
    document.body.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: #ef4444;">
        <h2>Error de Aplicación</h2>
        <p>No se pudo inicializar la aplicación. Por favor, recarga la página.</p>
        <button onclick="window.location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem;">
          Recargar
        </button>
      </div>
    `;
  }
});

// Handle page load completion
window.addEventListener('load', () => {
  window.devLog('Page fully loaded');
  
  // Remove any loading classes from body
  Utils.removeClass(document.body, 'loading');
  
  // Hide page loading indicators
  Utils.hideLoading();
});

// Handle before page unload
window.addEventListener('beforeunload', () => {
  window.devLog('Page unloading...');
  
  // Cleanup any intervals or timeouts
  if (window.Dashboard) {
    window.Dashboard.destroy();
  }
});