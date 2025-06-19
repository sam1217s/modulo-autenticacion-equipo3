🌟 Variables globales / constantes sugeridas
javascript
Copiar
Editar
// =======================
// Server Configuration
// =======================
const SERVER_PORT = process.env.PORT || 3000;
const API_BASE_URL = "/api/v1";

// =======================
// Database
// =======================
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/auth_module_db";

// =======================
// Security
// =======================
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "your-secure-jwt-secret";
const JWT_EXPIRES_IN = "2h";  // Token expiration (2 hours)

// =======================
// User Roles
// =======================
const USER_ROLES = {
  ADMIN: "admin",
  USER: "user"
};

// =======================
// Validation Rules
// =======================
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 32;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// =======================
// Messages
// =======================
const ERROR_MESSAGES = {
  USER_NOT_FOUND: "User not found.",
  INVALID_PASSWORD: "Invalid password.",
  EMAIL_ALREADY_REGISTERED: "Email is already registered.",
  UNAUTHORIZED_ACCESS: "Unauthorized access."
};

const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Login successful.",
  REGISTRATION_SUCCESS: "User registered successfully."
};
