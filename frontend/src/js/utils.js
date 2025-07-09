/**
 * Utility Functions
 * Common helper functions used throughout the application
 */

// ========================================
// DOM MANIPULATION UTILITIES
// ========================================

/**
 * Safely get element by ID
 * @param {string} id - Element ID
 * @returns {HTMLElement|null}
 */
function getElementById(id) {
  return document.getElementById(id);
}

/**
 * Safely query selector
 * @param {string} selector - CSS selector
 * @param {HTMLElement} parent - Parent element (optional)
 * @returns {HTMLElement|null}
 */
function querySelector(selector, parent = document) {
  return parent.querySelector(selector);
}

/**
 * Safely query all selectors
 * @param {string} selector - CSS selector
 * @param {HTMLElement} parent - Parent element (optional)
 * @returns {NodeList}
 */
function querySelectorAll(selector, parent = document) {
  return parent.querySelectorAll(selector);
}

/**
 * Add class to element safely
 * @param {HTMLElement|string} element - Element or element ID
 * @param {string} className - Class name to add
 */
function addClass(element, className) {
  const el = typeof element === 'string' ? getElementById(element) : element;
  if (el) el.classList.add(className);
}

/**
 * Remove class from element safely
 * @param {HTMLElement|string} element - Element or element ID
 * @param {string} className - Class name to remove
 */
function removeClass(element, className) {
  const el = typeof element === 'string' ? getElementById(element) : element;
  if (el) el.classList.remove(className);
}

/**
 * Toggle class on element safely
 * @param {HTMLElement|string} element - Element or element ID
 * @param {string} className - Class name to toggle
 */
function toggleClass(element, className) {
  const el = typeof element === 'string' ? getElementById(element) : element;
  if (el) el.classList.toggle(className);
}

/**
 * Check if element has class
 * @param {HTMLElement|string} element - Element or element ID
 * @param {string} className - Class name to check
 * @returns {boolean}
 */
function hasClass(element, className) {
  const el = typeof element === 'string' ? getElementById(element) : element;
  return el ? el.classList.contains(className) : false;
}

// ========================================
// LOADING AND UI UTILITIES
// ========================================

/**
 * Show loading overlay
 * @param {string} message - Loading message (optional)
 */
function showLoading(message = 'Cargando...') {
  const overlay = getElementById('loadingOverlay');
  if (overlay) {
    const textElement = overlay.querySelector('p');
    if (textElement && message) {
      textElement.textContent = message;
    }
    addClass(overlay, 'show');
  }
}

/**
 * Hide loading overlay
 * @param {number} delay - Delay before hiding (optional)
 */
function hideLoading(delay = 0) {
  setTimeout(() => {
    const overlay = getElementById('loadingOverlay');
    if (overlay) {
      removeClass(overlay, 'show');
    }
  }, delay);
}

/**
 * Show alert message
 * @param {string} message - Alert message
 * @param {string} type - Alert type (success, error, warning)
 * @param {number} duration - Auto-hide duration in ms
 */
function showAlert(message, type = 'error', duration = 4000) {
  const alertElement = getElementById('alertMessage');
  if (!alertElement) return;

  // Remove existing classes
  alertElement.className = 'alert';
  
  // Add new type class
  addClass(alertElement, type);
  
  // Update content
  const textElement = alertElement.querySelector('.alert-text');
  const iconElement = alertElement.querySelector('.alert-icon');
  
  if (textElement) textElement.textContent = message;
  
  if (iconElement) {
    iconElement.className = 'alert-icon';
    switch (type) {
      case 'success':
        iconElement.innerHTML = '<i class="fas fa-check-circle"></i>';
        break;
      case 'warning':
        iconElement.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
        break;
      case 'error':
      default:
        iconElement.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
        break;
    }
  }
  
  // Show alert
  removeClass(alertElement, 'hidden');
  
  // Auto-hide after duration
  if (duration > 0) {
    setTimeout(() => hideAlert(), duration);
  }
}

/**
 * Hide alert message
 */
function hideAlert() {
  const alertElement = getElementById('alertMessage');
  if (alertElement) {
    addClass(alertElement, 'hidden');
  }
}

// ========================================
// FORM UTILITIES
// ========================================

/**
 * Get form data as object
 * @param {HTMLFormElement|string} form - Form element or form ID
 * @returns {Object}
 */
function getFormData(form) {
  const formElement = typeof form === 'string' ? getElementById(form) : form;
  if (!formElement) return {};
  
  const formData = new FormData(formElement);
  const data = {};
  
  for (let [key, value] of formData.entries()) {
    data[key] = value.trim();
  }
  
  return data;
}

/**
 * Clear form inputs
 * @param {HTMLFormElement|string} form - Form element or form ID
 */
function clearForm(form) {
  const formElement = typeof form === 'string' ? getElementById(form) : form;
  if (formElement) {
    formElement.reset();
  }
}

/**
 * Set button loading state
 * @param {HTMLButtonElement|string} button - Button element or button ID
 * @param {boolean} isLoading - Loading state
 * @param {string} loadingText - Text to show when loading
 */
function setButtonLoading(button, isLoading, loadingText = 'Cargando...') {
  const btnElement = typeof button === 'string' ? getElementById(button) : button;
  if (!btnElement) return;
  
  const textElement = btnElement.querySelector('.btn-text');
  const spinnerElement = btnElement.querySelector('.btn-spinner');
  
  if (isLoading) {
    btnElement.disabled = true;
    if (textElement) textElement.textContent = loadingText;
    if (spinnerElement) removeClass(spinnerElement, 'hidden');
  } else {
    btnElement.disabled = false;
    if (textElement) textElement.textContent = btnElement.dataset.originalText || 'Continuar';
    if (spinnerElement) addClass(spinnerElement, 'hidden');
  }
}

// ========================================
// VALIDATION UTILITIES
// ========================================

/**
 * Validate username
 * @param {string} username - Username to validate
 * @returns {Object} Validation result
 */
function validateUsername(username) {
  const config = window.AppConfig.APP.VALIDATION.USERNAME;
  const errors = [];
  
  if (!username || username.length < config.MIN_LENGTH) {
    errors.push(`El usuario debe tener al menos ${config.MIN_LENGTH} caracteres`);
  }
  
  if (username && username.length > config.MAX_LENGTH) {
    errors.push(`El usuario debe tener máximo ${config.MAX_LENGTH} caracteres`);
  }
  
  if (username && !config.PATTERN.test(username)) {
    errors.push('El usuario solo puede contener letras, números, puntos y guiones bajos');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate password
 * @param {string} password - Password to validate
 * @returns {Object} Validation result
 */
function validatePassword(password) {
  const config = window.AppConfig.APP.VALIDATION.PASSWORD;
  const errors = [];
  let strength = 'weak';
  
  if (!password || password.length < config.MIN_LENGTH) {
    errors.push(`La contraseña debe tener al menos ${config.MIN_LENGTH} caracteres`);
  }
  
  if (password && password.length > config.MAX_LENGTH) {
    errors.push(`La contraseña debe tener máximo ${config.MAX_LENGTH} caracteres`);
  }
  
  // Calculate password strength
  if (password) {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score >= 4) strength = 'strong';
    else if (score >= 3) strength = 'good';
    else if (score >= 2) strength = 'fair';
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength
  };
}

/**
 * Update password strength indicator
 * @param {string} password - Password to check
 * @param {HTMLElement} strengthElement - Strength indicator element
 */
function updatePasswordStrength(password, strengthElement) {
  if (!strengthElement) return;
  
  const validation = validatePassword(password);
  const fillElement = strengthElement.querySelector('.strength-fill');
  const textElement = strengthElement.querySelector('.strength-text');
  
  if (fillElement) {
    fillElement.className = `strength-fill ${validation.strength}`;
  }
  
  if (textElement) {
    const strengthTexts = {
      weak: 'Débil',
      fair: 'Regular',
      good: 'Buena',
      strong: 'Fuerte'
    };
    textElement.textContent = `Seguridad: ${strengthTexts[validation.strength]}`;
  }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Format number with thousands separator
 * @param {number} num - Number to format
 * @returns {string}
 */
function formatNumber(num) {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Animate number counter
 * @param {HTMLElement} element - Element to animate
 * @param {number} targetValue - Target value
 * @param {number} duration - Animation duration in ms
 */
function animateNumber(element, targetValue, duration = 2000) {
  if (!element) return;
  
  const startValue = 0;
  const startTime = performance.now();
  
  function animate(currentTime) {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);
    
    element.textContent = formatNumber(currentValue);
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }
  
  requestAnimationFrame(animate);
}

/**
 * Get greeting based on time of day
 * @returns {string}
 */
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 18) return 'Buenas tardes';
  return 'Buenas noches';
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function}
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in ms
 * @returns {Function}
 */
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Generate avatar URL
 * @param {string} name - Name for avatar
 * @param {string} background - Background color
 * @param {string} color - Text color
 * @param {number} size - Avatar size
 * @returns {string}
 */
function generateAvatarUrl(name, background = '6366f1', color = 'fff', size = 128) {
  const encodedName = encodeURIComponent(name);
  return `https://ui-avatars.com/api/?name=${encodedName}&background=${background}&color=${color}&size=${size}`;
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>}
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
}

/**
 * Storage utilities
 */
const Storage = {
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      window.handleError(error, 'Storage.set');
      return false;
    }
  },
  
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      window.handleError(error, 'Storage.get');
      return defaultValue;
    }
  },
  
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      window.handleError(error, 'Storage.remove');
      return false;
    }
  },
  
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      window.handleError(error, 'Storage.clear');
      return false;
    }
  }
};

// Make utilities available globally
window.Utils = {
  // DOM
  getElementById,
  querySelector,
  querySelectorAll,
  addClass,
  removeClass,
  toggleClass,
  hasClass,
  
  // UI
  showLoading,
  hideLoading,
  showAlert,
  hideAlert,
  
  // Forms
  getFormData,
  clearForm,
  setButtonLoading,
  
  // Validation
  validateUsername,
  validatePassword,
  updatePasswordStrength,
  
  // Utilities
  formatNumber,
  animateNumber,
  getGreeting,
  debounce,
  throttle,
  generateAvatarUrl,
  copyToClipboard,
  Storage
};
