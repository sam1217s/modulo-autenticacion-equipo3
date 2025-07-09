# 📡 API Documentation - Auth App

## 📋 **Información del Documento**
- **Autor**: Franklin 
- **Versión**: 1.0.0
- **Fecha**: 09 07 2025 - Sprint 5
- **Estado**: Documentación completa

---

## 🎯 **Visión General de la API**

Auth App proporciona una API RESTful completa para la gestión de autenticación de usuarios, construida con Node.js y Express.js. La API sigue las mejores prácticas de REST y utiliza JWT para la autenticación stateless.

### 🌐 **Base URL**
```
Development:  http://localhost:4000/api
Staging:      https://staging-api.auth-app.com/api
Production:   https://api.auth-app.com/api
```

### 🔐 **Autenticación**
```javascript
// Headers requeridos para endpoints protegidos
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}
```

---

## 📊 **Endpoints Disponibles**

### 🔍 **Health Check**

#### `GET /api/health`
Verifica el estado de la API y conectividad a la base de datos.

**Request:**
```bash
curl -X GET https://api.auth-app.com/api/health
```

**Response:**
```json
{
  "success": true,
  "message": "API is healthy",
  "data": {
    "status": "OK",
    "uptime": "2h 15m 30s",
    "database": "connected",
    "version": "1.0.0"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 🔐 **Authentication Endpoints**

### 👤 **User Registration**

#### `POST /api/auth/register`
Registra un nuevo usuario en el sistema.

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "SecurePass123!",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Request Example:**
```bash
curl -X POST https://api.auth-app.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "SecurePass123!",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "username": "john_doe",
      "email": "john@example.com",
      "profile": {
        "firstName": "John",
        "lastName": "Doe"
      },
      "status": "active",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    "Username is required",
    "Password must be at least 8 characters",
    "Email format is invalid"
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (409):**
```json
{
  "success": false,
  "error": "User already exists",
  "details": ["Username 'john_doe' is already taken"],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### 🔑 **User Login**

#### `POST /api/auth/login`
Autentica un usuario existente y retorna un JWT token.

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "SecurePass123!"
}
```

**Request Example:**
```bash
curl -X POST https://api.auth-app.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "SecurePass123!"
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "username": "john_doe",
      "email": "john@example.com",
      "profile": {
        "firstName": "John",
        "lastName": "Doe",
        "avatar": null
      },
      "preferences": {
        "theme": "light",
        "language": "en"
      },
      "lastLogin": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "7d"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Invalid credentials",
  "details": ["Username or password is incorrect"],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (423):**
```json
{
  "success": false,
  "error": "Account locked",
  "details": ["Account temporarily locked due to multiple failed attempts"],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### 🚪 **User Logout**

#### `POST /api/auth/logout`
Cierra la sesión del usuario (invalida el token en el cliente).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Example:**
```bash
curl -X POST https://api.auth-app.com/api/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logout successful",
  "data": null,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 👤 **User Profile Endpoints**

### 🔍 **Get Current User Profile**

#### `GET /api/auth/me`
Obtiene la información del perfil del usuario autenticado.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Example:**
```bash
curl -X GET https://api.auth-app.com/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User profile retrieved",
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "username": "john_doe",
      "email": "john@example.com",
      "profile": {
        "firstName": "John",
        "lastName": "Doe",
        "avatar": "https://example.com/avatar.jpg"
      },
      "preferences": {
        "theme": "dark",
        "language": "es"
      },
      "status": "active",
      "lastLogin": "2024-01-15T10:30:00.000Z",
      "createdAt": "2024-01-10T08:15:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### ✏️ **Update User Profile**

#### `PUT /api/auth/profile`
Actualiza la información del perfil del usuario autenticado.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "profile": {
    "firstName": "John Updated",
    "lastName": "Doe",
    "avatar": "https://example.com/new-avatar.jpg"
  },
  "preferences": {
    "theme": "dark",
    "language": "es"
  },
  "email": "john.updated@example.com"
}
```

**Request Example:**
```bash
curl -X PUT https://api.auth-app.com/api/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "profile": {
      "firstName": "John Updated",
      "lastName": "Doe"
    },
    "preferences": {
      "theme": "dark",
      "language": "es"
    }
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "username": "john_doe",
      "email": "john.updated@example.com",
      "profile": {
        "firstName": "John Updated",
        "lastName": "Doe",
        "avatar": "https://example.com/new-avatar.jpg"
      },
      "preferences": {
        "theme": "dark",
        "language": "es"
      },
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 📊 **Dashboard Endpoints**

### 📈 **Get Dashboard Data**

#### `GET /api/auth/dashboard`
Obtiene los datos del dashboard para el usuario autenticado.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Example:**
```bash
curl -X GET https://api.auth-app.com/api/auth/dashboard \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Dashboard data retrieved",
  "data": {
    "user": {
      "username": "john_doe",
      "firstName": "John",
      "lastLogin": "2024-01-15T10:30:00.000Z",
      "memberSince": "2024-01-10T08:15:00.000Z"
    },
    "stats": {
      "totalLogins": 42,
      "lastLoginIP": "192.168.1.100",
      "accountAge": "5 days",
      "profileCompleteness": 85
    },
    "activities": [
      {
        "type": "login",
        "timestamp": "2024-01-15T10:30:00.000Z",
        "details": "Successful login from 192.168.1.100"
      },
      {
        "type": "profile_update",
        "timestamp": "2024-01-14T15:20:00.000Z",
        "details": "Updated profile information"
      }
    ],
    "notifications": [
      {
        "id": "notif_001",
        "type": "info",
        "message": "Welcome to Auth App!",
        "read": false,
        "timestamp": "2024-01-15T09:00:00.000Z"
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 🔐 **Password Management**

### 🔄 **Change Password**

#### `PUT /api/auth/password`
Cambia la contraseña del usuario autenticado.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "currentPassword": "OldSecurePass123!",
  "newPassword": "NewSecurePass456!",
  "confirmPassword": "NewSecurePass456!"
}
```

**Request Example:**
```bash
curl -X PUT https://api.auth-app.com/api/auth/password \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "OldSecurePass123!",
    "newPassword": "NewSecurePass456!",
    "confirmPassword": "NewSecurePass456!"
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password updated successfully",
  "data": {
    "passwordChanged": true,
    "timestamp": "2024-01-15T10:30:00.000Z"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Invalid current password",
  "details": ["Current password is incorrect"],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 📊 **Response Format**

### ✅ **Success Response Structure**
```json
{
  "success": true,
  "message": "Descriptive success message",
  "data": {
    // Response data object
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### ❌ **Error Response Structure**
```json
{
  "success": false,
  "error": "Error category or type",
  "details": [
    "Specific error message 1",
    "Specific error message 2"
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 📋 **HTTP Status Codes**

### ✅ **Success Codes**
| Code | Status | Description |
|------|--------|-------------|
| `200` | OK | Request successful |
| `201` | Created | Resource created successfully |
| `204` | No Content | Request successful, no content to return |

### ⚠️ **Client Error Codes**
| Code | Status | Description |
|------|--------|-------------|
| `400` | Bad Request | Invalid request data or parameters |
| `401` | Unauthorized | Authentication required or invalid token |
| `403` | Forbidden | Access denied to resource |
| `404` | Not Found | Resource not found |
| `409` | Conflict | Resource already exists (duplicate) |
| `422` | Unprocessable Entity | Validation errors |
| `429` | Too Many Requests | Rate limit exceeded |

### 🚨 **Server Error Codes**
| Code | Status | Description |
|------|--------|-------------|
| `500` | Internal Server Error | Unexpected server error |
| `502` | Bad Gateway | Upstream server error |
| `503` | Service Unavailable | Server temporarily unavailable |
| `504` | Gateway Timeout | Upstream server timeout |

---

## 🔒 **Security Considerations**

### 🔐 **JWT Token Management**

#### **Token Structure**
```javascript
// JWT Header
{
  "alg": "HS256",
  "typ": "JWT"
}

// JWT Payload
{
  "userId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "username": "john_doe",
  "iat": 1642243200,
  "exp": 1642848000
}
```

#### **Token Usage**
```javascript
// Frontend JavaScript example
const token = localStorage.getItem('authToken');

// API Request with token
fetch('https://api.auth-app.com/api/auth/me', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

### 🛡️ **Rate Limiting**
```
Rate Limits per endpoint:
├── /api/auth/login: 5 requests per 15 minutes per IP
├── /api/auth/register: 3 requests per hour per IP
├── /api/auth/*: 100 requests per 15 minutes per user
└── /api/health: 1000 requests per hour per IP
```

### 🔍 **Input Validation**

#### **Username Requirements**
- Length: 3-30 characters
- Characters: alphanumeric, underscore, hyphen
- Case: case-sensitive
- Unique: must be unique across system

#### **Password Requirements**
- Length: 8-128 characters
- Must contain: uppercase, lowercase, number, special character
- Cannot contain: username, common patterns
- Hashed with: bcrypt (12 rounds)

#### **Email Requirements**
- Format: valid email format (RFC 5322)
- Length: max 254 characters
- Unique: must be unique across system (optional field)

---

## 🧪 **Testing Examples**

### 📝 **Postman Collection**

#### **Environment Variables**
```json
{
  "baseUrl": "https://api.auth-app.com/api",
  "authToken": "{{token}}",
  "testUsername": "test_user_{{$randomInt}}",
  "testPassword": "TestPass123!"
}
```

#### **Test Scripts**
```javascript
// Login Test Script
pm.test("Login successful", function () {
    pm.response.to.have.status(200);
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data.token).to.exist;
    
    // Save token for subsequent requests
    pm.environment.set("authToken", response.data.token);
});

// Registration Test Script
pm.test("User registration", function () {
    pm.response.to.have.status(201);
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data.user.username).to.exist;
});
```

### 🔧 **cURL Examples**

#### **Complete Authentication Flow**
```bash
#!/bin/bash
# complete-auth-flow.sh

BASE_URL="https://api.auth-app.com/api"
USERNAME="test_user_$(date +%s)"
PASSWORD="TestPass123!"

echo "🧪 Testing complete authentication flow..."

# 1. Health Check
echo "📡 Testing health endpoint..."
curl -s "$BASE_URL/health" | jq '.'

# 2. User Registration
echo "👤 Testing user registration..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"$USERNAME\",
    \"password\": \"$PASSWORD\",
    \"email\": \"test@example.com\",
    \"firstName\": \"Test\",
    \"lastName\": \"User\"
  }")

echo $REGISTER_RESPONSE | jq '.'
TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.data.token')

# 3. Get Profile
echo "🔍 Testing get profile..."
curl -s -X GET "$BASE_URL/auth/me" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# 4. Update Profile
echo "✏️ Testing profile update..."
curl -s -X PUT "$BASE_URL/auth/profile" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "profile": {
      "firstName": "Updated Test",
      "lastName": "User"
    },
    "preferences": {
      "theme": "dark",
      "language": "es"
    }
  }' | jq '.'

# 5. Get Dashboard
echo "📊 Testing dashboard..."
curl -s -X GET "$BASE_URL/auth/dashboard" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# 6. Logout
echo "🚪 Testing logout..."
curl -s -X POST "$BASE_URL/auth/logout" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo "✅ Authentication flow test completed!"
```

---

## 🔧 **Integration Examples**

### ⚛️ **React Integration**

#### **API Service**
```javascript
// services/authAPI.js
class AuthAPI {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';
    this.token = localStorage.getItem('authToken');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.success) {
      this.token = response.data.token;
      localStorage.setItem('authToken', this.token);
    }
    
    return response;
  }

  async logout() {
    const response = await this.request('/auth/logout', {
      method: 'POST',
    });
    
    this.token = null;
    localStorage.removeItem('authToken');
    return response;
  }

  async getProfile() {
    return this.request('/auth/me');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getDashboard() {
    return this.request('/auth/dashboard');
  }
}

export default new AuthAPI();
```

#### **React Hook**
```javascript
// hooks/useAuth.js
import { useState, useEffect } from 'react';
import AuthAPI from '../services/authAPI';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const response = await AuthAPI.getProfile();
        if (response.success) {
          setUser(response.data.user);
        }
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await AuthAPI.login(credentials);
      if (response.success) {
        setUser(response.data.user);
        return { success: true };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AuthAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };
};
```

### 📱 **Vanilla JavaScript Integration**

#### **Auth Manager**
```javascript
// js/auth-manager.js
class AuthManager {
  constructor() {
    this.apiUrl = 'https://api.auth-app.com/api';
    this.token = localStorage.getItem('authToken');
    this.user = null;
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.apiUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers
    };

    try {
      const response = await fetch(url, { ...options, headers });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async login(username, password) {
    try {
      const response = await this.makeRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });

      if (response.success) {
        this.token = response.data.token;
        this.user = response.data.user;
        localStorage.setItem('authToken', this.token);
        this.redirectToDashboard();
      }

      return response;
    } catch (error) {
      this.showError('Login failed: ' + error.message);
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await this.makeRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });

      if (response.success) {
        this.token = response.data.token;
        this.user = response.data.user;
        localStorage.setItem('authToken', this.token);
        this.redirectToDashboard();
      }

      return response;
    } catch (error) {
      this.showError('Registration failed: ' + error.message);
      throw error;
    }
  }

  async logout() {
    try {
      if (this.token) {
        await this.makeRequest('/auth/logout', { method: 'POST' });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.token = null;
      this.user = null;
      localStorage.removeItem('authToken');
      window.location.href = '/index.html';
    }
  }

  async getDashboard() {
    return this.makeRequest('/auth/dashboard');
  }

  redirectToDashboard() {
    window.location.href = '/dashboard.html';
  }

  showError(message) {
    // Display error in UI
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
    }
  }

  handleError(error) {
    console.error('API Error:', error);
    
    if (error.message.includes('401')) {
      this.logout();
    }
  }
}

// Export for use in other files
window.authManager = new AuthManager();
```

---

## 📊 **Error Handling Guide**

### 🚨 **Common Error Scenarios**

#### **Authentication Errors**
```javascript
// Handle different authentication states
const handleAuthError = (error, response) => {
  switch (response.status) {
    case 401:
      // Token expired or invalid
      localStorage.removeItem('authToken');
      window.location.href = '/login.html';
      break;
      
    case 403:
      // Access forbidden
      showError('Access denied to this resource');
      break;
      
    case 423:
      // Account locked
      showError('Account temporarily locked. Try again later.');
      break;
      
    default:
      showError('Authentication failed');
  }
};
```

#### **Validation Errors**
```javascript
// Handle validation errors from API
const handleValidationErrors = (errorDetails) => {
  const errorContainer = document.getElementById('validation-errors');
  errorContainer.innerHTML = '';
  
  errorDetails.forEach(error => {
    const errorElement = document.createElement('div');
    errorElement.className = 'alert alert-danger';
    errorElement.textContent = error;
    errorContainer.appendChild(errorElement);
  });
  
  errorContainer.style.display = 'block';
};
```

#### **Network Errors**
```javascript
// Handle network connectivity issues
const handleNetworkError = (error) => {
  if (!navigator.onLine) {
    showError('No internet connection. Please check your network.');
    return;
  }
  
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    showError('Server unreachable. Please try again later.');
    return;
  }
  
  showError('Network error. Please try again.');
};
```

---

## 📈 **Performance Considerations**

### ⚡ **API Optimization Tips**

#### **Request Optimization**
```javascript
// Use AbortController for request cancellation
const controller = new AbortController();

fetch('/api/auth/dashboard', {
  signal: controller.signal,
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(response => response.json())
.catch(error => {
  if (error.name === 'AbortError') {
    console.log('Request cancelled');
  }
});

// Cancel request if needed
controller.abort();
```

#### **Caching Strategy**
```javascript
// Simple cache implementation
class APICache {
  constructor(ttl = 5 * 60 * 1000) { // 5 minutes default
    this.cache = new Map();
    this.ttl = ttl;
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    const isExpired = Date.now() - item.timestamp > this.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }
}

const apiCache = new APICache();

// Use cache for dashboard data
async function getDashboard() {
  const cached = apiCache.get('dashboard');
  if (cached) return cached;

  const response = await fetch('/api/auth/dashboard', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await response.json();
  
  apiCache.set('dashboard', data);
  return data;
}
```

---

## 🔧 **Development Tools**

### 📋 **API Testing Scripts**

#### **Load Testing**
```bash
#!/bin/bash
# load-test.sh

echo "🚀 Starting API load test..."

# Test login endpoint
echo "Testing login endpoint..."
ab -n 1000 -c 10 -T 'application/json' \
   -p login-data.json \
   https://api.auth-app.com/api/auth/login

# Test authenticated endpoint
echo "Testing dashboard endpoint..."
ab -n 1000 -c 10 \
   -H "Authorization: Bearer YOUR_TOKEN_HERE" \
   https://api.auth-app.com/api/auth/dashboard

echo "✅ Load test completed"
```

#### **API Monitoring**
```bash
#!/bin/bash
# api-monitor.sh

API_URL="https://api.auth-app.com/api"
LOG_FILE="/var/log/api-monitor.log"

while true; do
  TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
  
  # Test health endpoint
  RESPONSE_TIME=$(curl -w "%{time_total}" -s -o /dev/null "$API_URL/health")
  STATUS_CODE=$(curl -w "%{http_code}" -s -o /dev/null "$API_URL/health")
  
  echo "$TIMESTAMP - Health: $STATUS_CODE (${RESPONSE_TIME}s)" >> $LOG_FILE
  
  # Alert if response time > 1 second or status != 200
  if (( $(echo "$RESPONSE_TIME > 1.0" | bc -l) )) || [ "$STATUS_CODE" != "200" ]; then
    echo "🚨 API Alert: Status $STATUS_CODE, Response time ${RESPONSE_TIME}s"
  fi
  
  sleep 60
done
```

---

## 🔍 **Debugging Guide**

### 🐛 **Common Issues and Solutions**

#### **CORS Issues**
```javascript
// If getting CORS errors in browser
console.error('CORS Error Solutions:');
console.log('1. Check API CORS configuration');
console.log('2. Verify frontend URL in CORS_ORIGIN');
console.log('3. Ensure preflight requests are handled');

// Debug CORS
fetch('/api/auth/login', {
  method: 'OPTIONS',
  headers: {
    'Origin': window.location.origin,
    'Access-Control-Request-Method': 'POST',
    'Access-Control-Request-Headers': 'Content-Type'
  }
})
.then(response => {
  console.log('CORS preflight response:', response.headers);
});
```

#### **JWT Token Issues**
```javascript
// Debug JWT token
function debugToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Token payload:', payload);
    console.log('Expires:', new Date(payload.exp * 1000));
    console.log('Issued:', new Date(payload.iat * 1000));
    console.log('Is expired:', Date.now() / 1000 > payload.exp);
  } catch (error) {
    console.error('Invalid token format:', error);
  }
}

// Usage
const token = localStorage.getItem('authToken');
if (token) debugToken(token);
```

---

## 📚 **Additional Resources**

### 🔗 **Related Documentation**
- [Architecture Documentation](../architecture.md)
- [Deployment Guide](../deployment.md)
- [Maintenance Guide](../maintenance.md)
- [User Manual](../user-manual/README.md)

### 🛠️ **Development Tools**
- **Postman Collection**: [Download](./postman/auth-app.postman_collection.json)
- **OpenAPI Spec**: [Download](./openapi/auth-app-api.yaml)
- **Insomnia Workspace**: [Download](./insomnia/auth-app-workspace.json)

### 📖 **External References**
- [RESTful API Design Best Practices](https://restfulapi.net/)
- [JWT Token Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [HTTP Status Code Reference](https://httpstatuses.com/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

## 📧 **Support and Contact**

### 🆘 **Getting Help**
- **API Issues**: Open an issue on [GitHub](https://github.com/team/auth-app/issues)
- **Documentation**: Check [Wiki](https://github.com/team/auth-app/wiki)
- **Team Contact**: team@auth-app.com

### 🔄 **API Updates**
- **Changelog**: [View on GitHub](https://github.com/team/auth-app/blob/main/CHANGELOG.md)
- **Breaking Changes**: Will be announced 30 days in advance
- **API Versioning**: Currently v1, backwards compatible

---

<div align="center">

**📡 Documentado por Franklin - QA & Documentation Specialist**

*API RESTful completa para autenticación moderna*

**Version 1.0.0** | **Last Updated**: Sprint 3

</div>
