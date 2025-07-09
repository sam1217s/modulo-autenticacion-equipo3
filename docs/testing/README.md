# 🧪 Testing Documentation - Auth App

## 📋 **Información del Documento**
- **Autor**: Franklin 
- **Versión**: 1.0.0
- **Fecha**: Sprint 4
- **Estado**: Documentación completa de testing

---

## 🎯 **Estrategia de Testing**

Auth App implementa una estrategia de testing integral que cubre múltiples niveles para garantizar la calidad, seguridad y funcionalidad del sistema.

### 🏗️ **Pirámide de Testing**

```
                🔺
              /     \
            /  E2E   \     ← Integration/End-to-End (10%)
          /           \
        /    API       \    ← API/Service Testing (20%)
      /                 \
    /    UNIT TESTS      \  ← Unit Testing (70%)
  /                       \
 /_________________________\
```

---

## 🔧 **Configuración de Testing**

### 📦 **Herramientas y Dependencias**

#### **Backend Testing Stack**
```json
{
  "devDependencies": {
    "jest": "^29.0.0",
    "supertest": "^6.3.0",
    "mongodb-memory-server": "^8.12.0",
    "@types/jest": "^29.0.0",
    "nodemon": "^2.0.20"
  }
}
```

#### **Frontend Testing Stack**
```json
{
  "devDependencies": {
    "cypress": "^12.0.0",
    "jest": "^29.0.0",
    "jsdom": "^20.0.0",
    "@testing-library/dom": "^8.19.0",
    "playwright": "^1.28.0"
  }
}
```

### ⚙️ **Configuración Jest**
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.config.js',
    '!src/server.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testTimeout: 10000
};
```

---

## 🔬 **Unit Testing**

### 🛠️ **Backend Unit Tests**

#### **User Model Tests**
```javascript
// tests/unit/models/User.test.js
const User = require('../../../src/models/User');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('User Model', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('User Creation', () => {
    test('should create a valid user', async () => {
      const userData = {
        username: 'testuser',
        password: 'TestPass123!',
        email: 'test@example.com',
        profile: {
          firstName: 'Test',
          lastName: 'User'
        }
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.username).toBe(userData.username);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.password).not.toBe(userData.password); // Should be hashed
      expect(savedUser.status).toBe('active');
      expect(savedUser.createdAt).toBeDefined();
    });

    test('should hash password before saving', async () => {
      const plainPassword = 'TestPass123!';
      const user = new User({
        username: 'testuser',
        password: plainPassword
      });

      await user.save();
      expect(user.password).not.toBe(plainPassword);
      expect(user.password.length).toBeGreaterThan(50); // bcrypt hash length
    });

    test('should validate required fields', async () => {
      const user = new User({});
      
      await expect(user.save()).rejects.toThrow();
      
      const error = user.validateSync();
      expect(error.errors.username).toBeDefined();
      expect(error.errors.password).toBeDefined();
    });

    test('should enforce unique username', async () => {
      const userData = {
        username: 'duplicate',
        password: 'TestPass123!'
      };

      await new User(userData).save();
      
      await expect(new User(userData).save()).rejects.toThrow(/E11000/);
    });

    test('should validate password strength', async () => {
      const weakPasswords = [
        'weak',
        '12345678',
        'password',
        'ALLCAPS123',
        'nocaps123'
      ];

      for (const password of weakPasswords) {
        const user = new User({
          username: `user_${Date.now()}`,
          password
        });

        await expect(user.save()).rejects.toThrow();
      }
    });
  });

  describe('User Methods', () => {
    let user;

    beforeEach(async () => {
      user = await new User({
        username: 'testuser',
        password: 'TestPass123!',
        email: 'test@example.com'
      }).save();
    });

    test('should compare password correctly', async () => {
      const isValid = await user.comparePassword('TestPass123!');
      expect(isValid).toBe(true);

      const isInvalid = await user.comparePassword('wrongpassword');
      expect(isInvalid).toBe(false);
    });

    test('should generate JWT token', () => {
      const token = user.generateJWT();
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    test('should convert to JSON without password', () => {
      const userObj = user.toJSON();
      expect(userObj.password).toBeUndefined();
      expect(userObj.username).toBe('testuser');
      expect(userObj._id).toBeDefined();
    });

    test('should update last login', async () => {
      const originalLastLogin = user.lastLogin;
      await user.updateLastLogin();
      
      expect(user.lastLogin).not.toBe(originalLastLogin);
      expect(user.lastLogin).toBeInstanceOf(Date);
    });
  });
});
```

#### **Auth Controller Tests**
```javascript
// tests/unit/controllers/authController.test.js
const authController = require('../../../src/controllers/authController');
const User = require('../../../src/models/User');
const jwt = require('jsonwebtoken');

// Mock User model
jest.mock('../../../src/models/User');

describe('Auth Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis()
    };
    next = jest.fn();
    
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('register', () => {
    test('should register new user successfully', async () => {
      const userData = {
        username: 'newuser',
        password: 'TestPass123!',
        email: 'new@example.com'
      };

      req.body = userData;

      const mockUser = {
        _id: 'user123',
        username: 'newuser',
        email: 'new@example.com',
        generateJWT: jest.fn().mockReturnValue('mock-token'),
        toJSON: jest.fn().mockReturnValue({ username: 'newuser' })
      };

      User.prototype.save = jest.fn().mockResolvedValue(mockUser);

      await authController.register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User registered successfully',
        data: {
          user: { username: 'newuser' },
          token: 'mock-token'
        },
        timestamp: expect.any(String)
      });
    });

    test('should handle duplicate username error', async () => {
      req.body = {
        username: 'existing',
        password: 'TestPass123!'
      };

      const duplicateError = new Error('Duplicate key error');
      duplicateError.code = 11000;
      
      User.prototype.save = jest.fn().mockRejectedValue(duplicateError);

      await authController.register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'User already exists',
        details: expect.any(Array),
        timestamp: expect.any(String)
      });
    });

    test('should handle validation errors', async () => {
      req.body = {
        username: 'ab', // Too short
        password: 'weak'
      };

      const validationError = new Error('Validation failed');
      validationError.name = 'ValidationError';
      validationError.errors = {
        username: { message: 'Username too short' },
        password: { message: 'Password too weak' }
      };

      User.prototype.save = jest.fn().mockRejectedValue(validationError);

      await authController.register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Validation failed',
        details: expect.arrayContaining([
          'Username too short',
          'Password too weak'
        ]),
        timestamp: expect.any(String)
      });
    });
  });

  describe('login', () => {
    test('should login user successfully', async () => {
      req.body = {
        username: 'testuser',
        password: 'TestPass123!'
      };

      const mockUser = {
        _id: 'user123',
        username: 'testuser',
        comparePassword: jest.fn().mockResolvedValue(true),
        generateJWT: jest.fn().mockReturnValue('mock-token'),
        updateLastLogin: jest.fn().mockResolvedValue(true),
        toJSON: jest.fn().mockReturnValue({ username: 'testuser' })
      };

      User.findOne = jest.fn().mockResolvedValue(mockUser);

      await authController.login(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
      expect(mockUser.comparePassword).toHaveBeenCalledWith('TestPass123!');
      expect(mockUser.updateLastLogin).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Login successful',
        data: {
          user: { username: 'testuser' },
          token: 'mock-token',
          expiresIn: '7d'
        },
        timestamp: expect.any(String)
      });
    });

    test('should reject invalid credentials', async () => {
      req.body = {
        username: 'testuser',
        password: 'wrongpassword'
      };

      const mockUser = {
        comparePassword: jest.fn().mockResolvedValue(false)
      };

      User.findOne = jest.fn().mockResolvedValue(mockUser);

      await authController.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid credentials',
        details: ['Username or password is incorrect'],
        timestamp: expect.any(String)
      });
    });

    test('should reject non-existent user', async () => {
      req.body = {
        username: 'nonexistent',
        password: 'TestPass123!'
      };

      User.findOne = jest.fn().mockResolvedValue(null);

      await authController.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid credentials',
        details: ['Username or password is incorrect'],
        timestamp: expect.any(String)
      });
    });
  });

  describe('getProfile', () => {
    test('should return user profile', async () => {
      const mockUser = {
        _id: 'user123',
        username: 'testuser',
        toJSON: jest.fn().mockReturnValue({ username: 'testuser' })
      };

      req.user = mockUser;

      await authController.getProfile(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User profile retrieved',
        data: {
          user: { username: 'testuser' }
        },
        timestamp: expect.any(String)
      });
    });
  });
});
```

### 🌐 **Frontend Unit Tests**

#### **Auth Manager Tests**
```javascript
// tests/unit/frontend/auth-manager.test.js
/**
 * @jest-environment jsdom
 */

// Mock fetch globally
global.fetch = jest.fn();

// Import the auth manager (assuming it's a module)
const AuthManager = require('../../../frontend/src/js/auth-manager');

describe('AuthManager', () => {
  let authManager;

  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    
    // Clear fetch mock
    fetch.mockClear();
    
    // Create new instance
    authManager = new AuthManager();
  });

  describe('login', () => {
    test('should login successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          user: { username: 'testuser' },
          token: 'mock-token'
        }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      // Mock window.location.href
      delete window.location;
      window.location = { href: '' };

      const result = await authManager.login('testuser', 'password');

      expect(fetch).toHaveBeenCalledWith('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: 'testuser',
          password: 'password'
        })
      });

      expect(localStorage.getItem('authToken')).toBe('mock-token');
      expect(authManager.user).toEqual({ username: 'testuser' });
      expect(result).toEqual(mockResponse);
    });

    test('should handle login failure', async () => {
      const mockError = {
        success: false,
        error: 'Invalid credentials'
      };

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => mockError
      });

      await expect(authManager.login('user', 'wrong')).rejects.toThrow();
      expect(localStorage.getItem('authToken')).toBeNull();
    });
  });

  describe('makeRequest', () => {
    test('should include auth token in headers', async () => {
      authManager.token = 'test-token';

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      await authManager.makeRequest('/test');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:4000/api/test',
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-token'
          }
        }
      );
    });

    test('should handle network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(authManager.makeRequest('/test')).rejects.toThrow('Network error');
    });
  });

  describe('logout', () => {
    test('should clear token and redirect', async () => {
      authManager.token = 'test-token';
      authManager.user = { username: 'test' };
      localStorage.setItem('authToken', 'test-token');

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      // Mock window.location.href
      delete window.location;
      window.location = { href: '' };

      await authManager.logout();

      expect(authManager.token).toBeNull();
      expect(authManager.user).toBeNull();
      expect(localStorage.getItem('authToken')).toBeNull();
      expect(window.location.href).toBe('/index.html');
    });
  });
});
```

#### **Form Validation Tests**
```javascript
// tests/unit/frontend/validation.test.js
/**
 * @jest-environment jsdom
 */

const { validateUsername, validatePassword, validateEmail } = require('../../../frontend/src/js/validation');

describe('Form Validation', () => {
  describe('validateUsername', () => {
    test('should accept valid usernames', () => {
      const validUsernames = [
        'user123',
        'test_user',
        'user-name',
        'ValidUser',
        'a'.repeat(30) // Max length
      ];

      validUsernames.forEach(username => {
        expect(validateUsername(username)).toEqual({
          isValid: true,
          errors: []
        });
      });
    });

    test('should reject invalid usernames', () => {
      const invalidCases = [
        { username: '', expectedError: 'Username is required' },
        { username: 'ab', expectedError: 'Username must be at least 3 characters' },
        { username: 'a'.repeat(31), expectedError: 'Username must be at most 30 characters' },
        { username: 'user@name', expectedError: 'Username can only contain letters, numbers, underscore and hyphen' },
        { username: 'user name', expectedError: 'Username cannot contain spaces' }
      ];

      invalidCases.forEach(({ username, expectedError }) => {
        const result = validateUsername(username);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain(expectedError);
      });
    });
  });

  describe('validatePassword', () => {
    test('should accept strong passwords', () => {
      const strongPasswords = [
        'StrongPass123!',
        'MySecure@Pass1',
        'Complex#Pass99',
        'Aa1!' + 'x'.repeat(20) // Long password
      ];

      strongPasswords.forEach(password => {
        expect(validatePassword(password)).toEqual({
          isValid: true,
          errors: [],
          strength: expect.any(String)
        });
      });
    });

    test('should reject weak passwords', () => {
      const weakCases = [
        { password: '', expectedError: 'Password is required' },
        { password: 'short', expectedError: 'Password must be at least 8 characters' },
        { password: 'alllowercase', expectedError: 'Password must contain at least one uppercase letter' },
        { password: 'ALLUPPERCASE', expectedError: 'Password must contain at least one lowercase letter' },
        { password: 'NoNumbers!', expectedError: 'Password must contain at least one number' },
        { password: 'NoSpecialChars123', expectedError: 'Password must contain at least one special character' }
      ];

      weakCases.forEach(({ password, expectedError }) => {
        const result = validatePassword(password);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain(expectedError);
      });
    });

    test('should calculate password strength', () => {
      const strengthTests = [
        { password: 'Weak1!', expectedStrength: 'weak' },
        { password: 'Medium123!', expectedStrength: 'medium' },
        { password: 'VeryStrongPass123!@#', expectedStrength: 'strong' }
      ];

      strengthTests.forEach(({ password, expectedStrength }) => {
        const result = validatePassword(password);
        expect(result.strength).toBe(expectedStrength);
      });
    });
  });

  describe('validateEmail', () => {
    test('should accept valid emails', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'valid.email.123@sub.domain.com'
      ];

      validEmails.forEach(email => {
        expect(validateEmail(email)).toEqual({
          isValid: true,
          errors: []
        });
      });
    });

    test('should reject invalid emails', () => {
      const invalidEmails = [
        { email: 'invalid', expectedError: 'Invalid email format' },
        { email: '@domain.com', expectedError: 'Invalid email format' },
        { email: 'user@', expectedError: 'Invalid email format' },
        { email: 'user@domain', expectedError: 'Invalid email format' },
        { email: 'user..name@domain.com', expectedError: 'Invalid email format' }
      ];

      invalidEmails.forEach(({ email, expectedError }) => {
        const result = validateEmail(email);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain(expectedError);
      });
    });

    test('should handle empty email (optional field)', () => {
      const result = validateEmail('');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });
  });
});
```

---

## 🔗 **Integration Testing**

### 📡 **API Integration Tests**
```javascript
// tests/integration/api.test.js
const request = require('supertest');
const app = require('../../src/server');
const User = require('../../src/models/User');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

describe('API Integration Tests', () => {
  let mongoServer;
  let authToken;
  let testUser;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    
    // Create test user
    testUser = await new User({
      username: 'testuser',
      password: 'TestPass123!',
      email: 'test@example.com'
    }).save();
    
    authToken = testUser.generateJWT();
  });

  describe('Authentication Flow', () => {
    test('complete authentication flow', async () => {
      const newUser = {
        username: 'newuser',
        password: 'NewPass123!',
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'User'
      };

      // 1. Register new user
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(newUser)
        .expect(201);

      expect(registerResponse.body.success).toBe(true);
      expect(registerResponse.body.data.token).toBeDefined();
      expect(registerResponse.body.data.user.username).toBe(newUser.username);

      const newToken = registerResponse.body.data.token;

      // 2. Get profile with new token
      const profileResponse = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${newToken}`)
        .expect(200);

      expect(profileResponse.body.data.user.username).toBe(newUser.username);
      expect(profileResponse.body.data.user.email).toBe(newUser.email);

      // 3. Update profile
      const updateData = {
        profile: {
          firstName: 'Updated',
          lastName: 'Name'
        },
        preferences: {
          theme: 'dark',
          language: 'es'
        }
      };

      const updateResponse = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${newToken}`)
        .send(updateData)
        .expect(200);

      expect(updateResponse.body.data.user.profile.firstName).toBe('Updated');
      expect(updateResponse.body.data.user.preferences.theme).toBe('dark');

      // 4. Get dashboard
      const dashboardResponse = await request(app)
        .get('/api/auth/dashboard')
        .set('Authorization', `Bearer ${newToken}`)
        .expect(200);

      expect(dashboardResponse.body.data.user.username).toBe(newUser.username);
      expect(dashboardResponse.body.data.stats).toBeDefined();

      // 5. Logout
      const logoutResponse = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${newToken}`)
        .expect(200);

      expect(logoutResponse.body.success).toBe(true);
    });

    test('should handle authentication errors', async () => {
      // Test without token
      await request(app)
        .get('/api/auth/me')
        .expect(401);

      // Test with invalid token
      await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      // Test with expired token (you would need to mock this)
      // await request(app)
      //   .get('/api/auth/me')
      //   .set('Authorization', 'Bearer expired-token')
      //   .expect(401);
    });
  });

  describe('Data Validation', () => {
    test('should validate registration data', async () => {
      const invalidData = [
        { username: 'ab', password: 'TestPass123!' }, // Username too short
        { username: 'validuser', password: 'weak' }, // Password too weak
        { username: 'user@invalid', password: 'TestPass123!' }, // Invalid username chars
        { email: 'invalid-email', username: 'validuser', password: 'TestPass123!' } // Invalid email
      ];

      for (const data of invalidData) {
        await request(app)
          .post('/api/auth/register')
          .send(data)
          .expect(400);
      }
    });

    test('should validate profile update data', async () => {
      const invalidUpdates = [
        { profile: { firstName: 'a'.repeat(101) } }, // Name too long
        { preferences: { theme: 'invalid-theme' } }, // Invalid theme
        { email: 'invalid-email-format' } // Invalid email
      ];

      for (const update of invalidUpdates) {
        await request(app)
          .put('/api/auth/profile')
          .set('Authorization', `Bearer ${authToken}`)
          .send(update)
          .expect(400);
      }
    });
  });

  describe('Security Tests', () => {
    test('should prevent duplicate username registration', async () => {
      const duplicateUser = {
        username: testUser.username,
        password: 'DifferentPass123!'
      };

      await request(app)
        .post('/api/auth/register')
        .send(duplicateUser)
        .expect(409);
    });

    test('should rate limit login attempts', async () => {
      const invalidCredentials = {
        username: 'nonexistent',
        password: 'wrongpassword'
      };

      // Make multiple failed login attempts
      const promises = Array(6).fill().map(() =>
        request(app)
          .post('/api/auth/login')
          .send(invalidCredentials)
      );

      const responses = await Promise.all(promises);
      
      // Some requests should be rate limited
      const rateLimitedResponses = responses.filter(res => res.status === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });

    test('should protect sensitive endpoints', async () => {
      const protectedEndpoints = [
        { method: 'get', path: '/api/auth/me' },
        { method: 'put', path: '/api/auth/profile' },
        { method: 'get', path: '/api/auth/dashboard' },
        { method: 'post', path: '/api/auth/logout' }
      ];

      for (const endpoint of protectedEndpoints) {
        await request(app)
          [endpoint.method](endpoint.path)
          .expect(401);
      }
    });
  });

  describe('Performance Tests', () => {
    test('should respond within acceptable time limits', async () => {
      const startTime = Date.now();
      
      await request(app)
        .post('/api/auth/login')
        .send({
          username: testUser.username,
          password: 'TestPass123!'
        })
        .expect(200);

      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(1000); // Should respond within 1 second
    });

    test('should handle concurrent requests', async () => {
      const concurrentRequests = Array(10).fill().map(() =>
        request(app)
          .get('/api/health')
          .expect(200)
      );

      const responses = await Promise.all(concurrentRequests);
      expect(responses).toHaveLength(10);
      responses.forEach(response => {
        expect(response.body.success).toBe(true);
      });
    });
  });
});
```

---

## 🌐 **End-to-End Testing**

### 🤖 **Cypress E2E Tests**
```javascript
// cypress/e2e/auth-flow.cy.js
describe('Authentication Flow', () => {
  beforeEach(() => {
    // Clear localStorage and cookies
    cy.clearLocalStorage();
    cy.clearCookies();
    
    // Visit login page
    cy.visit('/');
  });

  describe('User Registration', () => {
    it('should register a new user successfully', () => {
      // Navigate to register page
      cy.get('[data-cy=register-link]').click();
      cy.url().should('include', '/register.html');

      // Fill registration form
      const username = `testuser_${Date.now()}`;
      cy.get('[data-cy=username]').type(username);
      cy.get('[data-cy=password]').type('TestPass123!');
      cy.get('[data-cy=confirm-password]').type('TestPass123!');
      cy.get('[data-cy=email]').type('test@example.com');
      cy.get('[data-cy=first-name]').type('Test');
      cy.get('[data-cy=last-name]').type('User');

      // Submit form
      cy.get('[data-cy=register-form]').submit();

      // Should redirect to dashboard
      cy.url().should('include', '/dashboard.html');
      cy.get('[data-cy=welcome-message]').should('contain', username);
      
      // Check localStorage for token
      cy.window().its('localStorage.authToken').should('exist');
    });

    it('should show validation errors for invalid data', () => {
      cy.get('[data-cy=register-link]').click();

      // Try to submit with invalid data
      cy.get('[data-cy=username]').type('ab'); // Too short
      cy.get('[data-cy=password]').type('weak'); // Too weak
      cy.get('[data-cy=register-btn]').click();

      // Should show validation errors
      cy.get('[data-cy=validation-errors]').should('be.visible');
      cy.get('[data-cy=validation-errors]').should('contain', 'Username must be at least 3 characters');
      cy.get('[data-cy=validation-errors]').should('contain', 'Password must be at least 8 characters');
    });

    it('should show error for duplicate username', () => {
      // First, register a user
      cy.request('POST', '/api/auth/register', {
        username: 'duplicateuser',
        password: 'TestPass123!'
      });

      // Try to register with same username
      cy.get('[data-cy=register-link]').click();
      cy.get('[data-cy=username]').type('duplicateuser');
      cy.get('[data-cy=password]').type('TestPass123!');
      cy.get('[data-cy=confirm-password]').type('TestPass123!');
      cy.get('[data-cy=register-btn]').click();

      cy.get('[data-cy=error-message]').should('contain', 'User already exists');
    });
  });

  describe('User Login', () => {
    beforeEach(() => {
      // Create test user via API
      cy.request('POST', '/api/auth/register', {
        username: 'loginuser',
        password: 'TestPass123!'
      });
    });

    it('should login successfully with valid credentials', () => {
      cy.get('[data-cy=username]').type('loginuser');
      cy.get('[data-cy=password]').type('TestPass123!');
      cy.get('[data-cy=login-btn]').click();

      // Should redirect to dashboard
      cy.url().should('include', '/dashboard.html');
      cy.get('[data-cy=user-profile]').should('contain', 'loginuser');
      
      // Check localStorage for token
      cy.window().its('localStorage.authToken').should('exist');
    });

    it('should show error for invalid credentials', () => {
      cy.get('[data-cy=username]').type('loginuser');
      cy.get('[data-cy=password]').type('wrongpassword');
      cy.get('[data-cy=login-btn]').click();

      cy.get('[data-cy=error-message]').should('contain', 'Invalid credentials');
      cy.url().should('not.include', '/dashboard.html');
    });

    it('should show loading state during login', () => {
      cy.get('[data-cy=username]').type('loginuser');
      cy.get('[data-cy=password]').type('TestPass123!');
      
      // Intercept API call to add delay
      cy.intercept('POST', '/api/auth/login', (req) => {
        req.reply((res) => {
          return new Promise((resolve) => {
            setTimeout(() => resolve(res), 1000);
          });
        });
      });

      cy.get('[data-cy=login-btn]').click();
      cy.get('[data-cy=loading-spinner]').should('be.visible');
      cy.get('[data-cy=login-btn]').should('be.disabled');
    });
  });

  describe('Dashboard Functionality', () => {
    beforeEach(() => {
      // Login first
      cy.request('POST', '/api/auth/register', {
        username: 'dashuser',
        password: 'TestPass123!'
      }).then((response) => {
        window.localStorage.setItem('authToken', response.body.data.token);
        cy.visit('/dashboard.html');
      });
    });

    it('should display user dashboard', () => {
      cy.get('[data-cy=sidebar]').should('be.visible');
      cy.get('[data-cy=main-content]').should('be.visible');
      cy.get('[data-cy=user-stats]').should('be.visible');
      cy.get('[data-cy=recent-activities]').should('be.visible');
    });

    it('should toggle sidebar', () => {
      cy.get('[data-cy=sidebar-toggle]').click();
      cy.get('[data-cy=sidebar]').should('have.class', 'collapsed');
      
      cy.get('[data-cy=sidebar-toggle]').click();
      cy.get('[data-cy=sidebar]').should('not.have.class', 'collapsed');
    });

    it('should update user profile', () => {
      cy.get('[data-cy=profile-menu]').click();
      cy.get('[data-cy=edit-profile]').click();

      // Update profile information
      cy.get('[data-cy=first-name]').clear().type('Updated');
      cy.get('[data-cy=last-name]').clear().type('Name');
      cy.get('[data-cy=theme-select]').select('dark');
      cy.get('[data-cy=save-profile]').click();

      // Should show success message
      cy.get('[data-cy=success-message]').should('contain', 'Profile updated');
      cy.get('[data-cy=user-name]').should('contain', 'Updated Name');
    });

    it('should logout successfully', () => {
      cy.get('[data-cy=user-menu]').click();
      cy.get('[data-cy=logout-btn]').click();

      // Should redirect to login page
      cy.url().should('include', '/index.html');
      cy.window().its('localStorage.authToken').should('not.exist');
    });
  });

  describe('Responsive Design', () => {
    const viewports = [
      { device: 'mobile', width: 375, height: 667 },
      { device: 'tablet', width: 768, height: 1024 },
      { device: 'desktop', width: 1200, height: 800 }
    ];

    viewports.forEach(({ device, width, height }) => {
      it(`should work on ${device} (${width}x${height})`, () => {
        cy.viewport(width, height);
        
        // Test login page
        cy.visit('/');
        cy.get('[data-cy=login-form]').should('be.visible');
        
        if (device === 'mobile') {
          cy.get('[data-cy=mobile-menu]').should('be.visible');
        }

        // Login and test dashboard
        cy.request('POST', '/api/auth/register', {
          username: `user_${device}`,
          password: 'TestPass123!'
        }).then((response) => {
          window.localStorage.setItem('authToken', response.body.data.token);
          cy.visit('/dashboard.html');
          
          cy.get('[data-cy=main-content]').should('be.visible');
          
          if (device === 'mobile') {
            cy.get('[data-cy=mobile-sidebar]').should('be.visible');
          } else {
            cy.get('[data-cy=desktop-sidebar]').should('be.visible');
          }
        });
      });
    });
  });

  describe('Accessibility', () => {
    it('should be accessible', () => {
      cy.visit('/');
      cy.injectAxe();
      
      // Check accessibility
      cy.checkA11y();
      
      // Test keyboard navigation
      cy.get('body').tab();
      cy.focused().should('have.attr', 'data-cy', 'username');
      
      cy.focused().tab();
      cy.focused().should('have.attr', 'data-cy', 'password');
      
      cy.focused().tab();
      cy.focused().should('have.attr', 'data-cy', 'login-btn');
    });

    it('should have proper ARIA labels', () => {
      cy.visit('/');
      
      cy.get('[data-cy=username]').should('have.attr', 'aria-label');
      cy.get('[data-cy=password]').should('have.attr', 'aria-label');
      cy.get('[data-cy=login-btn]').should('have.attr', 'aria-label');
      
      cy.get('[data-cy=login-form]').should('have.attr', 'role', 'form');
    });
  });
});
```

### 🎭 **Playwright E2E Tests**
```javascript
// tests/e2e/playwright/auth.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Auth App E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear storage
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test('complete user journey', async ({ page }) => {
    // 1. Visit login page
    await page.goto('/');
    await expect(page).toHaveTitle(/Auth App/);
    
    // 2. Navigate to registration
    await page.click('[data-test="register-link"]');
    await expect(page).toHaveURL(/register\.html/);
    
    // 3. Register new user
    const username = `test_${Date.now()}`;
    await page.fill('[data-test="username"]', username);
    await page.fill('[data-test="password"]', 'TestPass123!');
    await page.fill('[data-test="confirm-password"]', 'TestPass123!');
    await page.fill('[data-test="email"]', 'test@example.com');
    
    await page.click('[data-test="register-btn"]');
    
    // 4. Should redirect to dashboard
    await expect(page).toHaveURL(/dashboard\.html/);
    await expect(page.locator('[data-test="welcome-message"]')).toContainText(username);
    
    // 5. Verify token in localStorage
    const token = await page.evaluate(() => localStorage.getItem('authToken'));
    expect(token).toBeTruthy();
    
    // 6. Test dashboard functionality
    await expect(page.locator('[data-test="sidebar"]')).toBeVisible();
    await expect(page.locator('[data-test="user-stats"]')).toBeVisible();
    
    // 7. Update profile
    await page.click('[data-test="profile-menu"]');
    await page.click('[data-test="edit-profile"]');
    
    await page.fill('[data-test="first-name"]', 'Updated');
    await page.click('[data-test="save-profile"]');
    
    await expect(page.locator('[data-test="success-message"]')).toBeVisible();
    
    // 8. Logout
    await page.click('[data-test="user-menu"]');
    await page.click('[data-test="logout-btn"]');
    
    await expect(page).toHaveURL(/index\.html/);
    
    // 9. Verify token removed
    const tokenAfterLogout = await page.evaluate(() => localStorage.getItem('authToken'));
    expect(tokenAfterLogout).toBeNull();
  });

  test('handles errors gracefully', async ({ page }) => {
    await page.goto('/');
    
    // Test with invalid credentials
    await page.fill('[data-test="username"]', 'nonexistent');
    await page.fill('[data-test="password"]', 'wrongpassword');
    await page.click('[data-test="login-btn"]');
    
    await expect(page.locator('[data-test="error-message"]')).toContainText('Invalid credentials');
  });

  test('works across different browsers', async ({ page, browserName }) => {
    console.log(`Testing on ${browserName}`);
    
    await page.goto('/');
    await expect(page.locator('[data-test="login-form"]')).toBeVisible();
    
    // Test basic functionality works in this browser
    await page.fill('[data-test="username"]', 'testuser');
    await page.fill('[data-test="password"]', 'password');
    
    // Button should be enabled
    await expect(page.locator('[data-test="login-btn"]')).toBeEnabled();
  });
});
```

---

## 📊 **Test Coverage y Reporting**

### 📈 **Coverage Configuration**
```javascript
// jest.config.js - Coverage settings
module.exports = {
  // ... other config
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.config.js',
    '!src/**/index.js',
    '!src/server.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'json'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    './src/controllers/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  }
};
```

### 📋 **Test Reports**
```bash
#!/bin/bash
# generate-test-report.sh

echo "🧪 Generating comprehensive test report..."

# Create reports directory
mkdir -p reports

# 1. Run unit tests with coverage
echo "📊 Running unit tests..."
npm run test:unit -- --coverage --coverageReporters=json-summary

# 2. Run integration tests
echo "🔗 Running integration tests..."
npm run test:integration -- --json --outputFile=reports/integration-results.json

# 3. Run E2E tests
echo "🌐 Running E2E tests..."
npm run test:e2e -- --reporter=json --output=reports/e2e-results.json

# 4. Generate combined report
echo "📋 Generating combined report..."
node scripts/generate-combined-report.js

# 5. Generate HTML report
echo "🌐 Generating HTML report..."
npx jest --coverage --coverageReporters=html

echo "✅ Test reports generated in ./reports/"
echo "📊 Coverage report: ./coverage/index.html"
echo "📋 Combined report: ./reports/test-summary.html"
```

---

## 🔧 **Test Scripts y Comandos**

### 📋 **Package.json Scripts**
```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest --testPathPattern=unit",
    "test:integration": "jest --testPathPattern=integration",
    "test:e2e": "cypress run",
    "test:e2e:open": "cypress open",
    "test:playwright": "playwright test",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand",
    "lint:test": "eslint tests/**/*.js",
    "test:load": "artillery run tests/load/auth-load-test.yml",
    "test:security": "npm audit && snyk test",
    "test:all": "npm run test:unit && npm run test:integration && npm run test:e2e"
  }
}
```

### 🚀 **CI/CD Testing Pipeline**
```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run unit tests
      run: npm run test:unit
    
    - name: Run integration tests
      run: npm run test:integration
    
    - name: Run E2E tests
      run: npm run test:e2e
      
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
        fail_ci_if_error: true
    
    - name: Security audit
      run: npm audit --audit-level=critical
```

---

## 📚 **Referencias y Recursos**

### 🔗 **Documentación de Testing**
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Playwright Testing Guide](https://playwright.dev/docs/intro)
- [Supertest API Testing](https://github.com/visionmedia/supertest)

### 🛠️ **Herramientas Adicionales**
- **Load Testing**: Artillery, k6
- **Security Testing**: OWASP ZAP, Snyk
- **Visual Testing**: Percy, Chromatic
- **Performance Testing**: Lighthouse CI

---

<div align="center">

**🧪 Documentado por Franklin - QA & Documentation Specialist**

*Testing integral para calidad y confiabilidad*

</div>
