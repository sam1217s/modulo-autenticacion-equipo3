# 🔐 Módulo de Autenticación

## 🎯 Objetivo
Desarrollar un módulo de autenticación con login, registro de usuarios y visualización de un dashboard. El proyecto aplica buenas prácticas de **Clean Code** y se gestiona mediante **GitHub Projects**.

---

## 🧩 Historias de Usuario

1️⃣ **Login**
> Como **usuario registrado**, quiero **iniciar sesión con mi correo y contraseña**, para **acceder al panel de control de la aplicación**.

2️⃣ **Registro**
> Como **visitante**, quiero **registrarme proporcionando mis datos**, para **crear una cuenta y utilizar la plataforma**.

3️⃣ **Dashboard**
> Como **usuario autenticado**, quiero **ver un dashboard con opciones y estadísticas**, para **gestionar mi información y acceder rápidamente a funcionalidades clave**.

---

## 🚀 Enlace al tablero de proyecto
👉 [GitHub Projects - Módulo de Autenticación](https://github.com/usuario/repositorio/projects/1)  
*(Reemplaza con el enlace real de tu proyecto)*

---

## 🧑‍🤝‍🧑 Integrantes del equipo

| Nombre      | Rol                 |
|-------------|---------------------|
| Samuel      | Frontend / Git Master |
| Karol       | Backend / QA          |
| angie      | Backend / QA |
| franklin   | Diseño / Testing      |

---

## 🌟 Variables globales / constantes sugeridas

```javascript
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


✅ Nombres de funciones sugeridas (Clean Code)
🟣 Para el registro de usuarios

async function registerUser(userData) { ... }
async function isEmailTaken(email) { ... }
async function hashPassword(password) { ... }
async function saveUserToDatabase(user) { ... }
🟣 Para el login de usuarios

async function loginUser(credentials) { ... }
async function verifyPassword(inputPassword, hashedPassword) { ... }
function generateAuthToken(user) { ... }
🟣 Para middleware de autenticación

function authenticateToken(req, res, next) { ... }
function authorizeUserRole(requiredRole) { ... }  // Ejemplo: proteger rutas de admin
🟣 Para dashboard y gestión

async function getUserDashboardData(userId) { ... }
🟣 Para validaciones generales

function isValidEmail(email) { ... }
function isValidPassword(password) { ... }
