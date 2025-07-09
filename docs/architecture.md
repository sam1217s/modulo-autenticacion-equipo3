# 🏗️ Arquitectura del Sistema - Auth App

## 📋 **Información del Documento**
- **Autor**: Franklin 
- **Versión**: 1.0.0
- **Fecha**: Última actualización Sprint 5
- **Estado**: Terminado

---

## 🎯 **Visión General de la Arquitectura**

Auth App utiliza una **arquitectura de 3 capas** con separación clara entre frontend, backend y base de datos, siguiendo patrones de diseño modernos y mejores prácticas de seguridad.

### 🔧 **Stack Tecnológico**

```
┌─────────────────────────────────────────────────┐
│                 CLIENTE                         │
│  📱 Web Browser (Chrome, Firefox, Safari)      │
│  🌐 HTML5 + CSS3 + JavaScript ES6+             │
│  🎨 Bootstrap 5 + Font Awesome                 │
└─────────────────┬───────────────────────────────┘
                  │ HTTPS/REST API
┌─────────────────▼───────────────────────────────┐
│               SERVIDOR                          │
│  ⚡ Node.js + Express.js                       │
│  🔐 JWT Authentication + bcrypt                 │
│  📡 RESTful API + CORS                         │
│  🛡️ Security Middleware                        │
└─────────────────┬───────────────────────────────┘
                  │ Mongoose ODM
┌─────────────────▼───────────────────────────────┐
│            BASE DE DATOS                        │
│  🍃 MongoDB (Document Database)                │
│  📊 Collections: users, sessions               │
│  🔒 Indexes + Validation                       │
└─────────────────────────────────────────────────┘
```

---

## 🏛️ **Arquitectura Detallada**

### 🎨 **Frontend (Presentation Layer)**

#### **Responsabilidades:**
- Interface de usuario responsive
- Validación de formularios client-side
- Manejo de estados de autenticación
- Integración con API backend
- Experiencia de usuario (UX)

#### **Componentes Principales:**
```
frontend/
├── 📄 index.html          # Página de login
├── 📄 register.html       # Página de registro
├── 📄 dashboard.html      # Dashboard principal
├── 🎨 src/css/
│   ├── auth.css           # Estilos autenticación
│   └── dashboard.css      # Estilos dashboard
└── ⚡ src/js/
    ├── config.js          # Configuración app
    ├── utils.js           # Utilidades comunes
    ├── auth.js            # Lógica autenticación
    ├── dashboard.js       # Funcionalidad dashboard
    └── app.js             # Coordinador principal
```

#### **Patrones de Diseño:**
- **Module Pattern**: Separación de responsabilidades en módulos JS
- **Observer Pattern**: Event listeners para interacciones UI
- **Strategy Pattern**: Diferentes estrategias de validación
- **Facade Pattern**: Simplificación de la API del backend

### 🔧 **Backend (Business Logic Layer)**

#### **Responsabilidades:**
- Lógica de negocio de autenticación
- Validación y sanitización de datos
- Generación y validación de JWT tokens
- Seguridad y autorización
- API RESTful para el frontend

#### **Arquitectura MVC:**
```
backend/src/
├── 📊 models/             # Modelos de datos (Model)
│   └── User.js            # Schema de usuario
├── 🎛️ controllers/        # Lógica de negocio (Controller)
│   └── authController.js  # Controlador autenticación
├── 🛣️ routes/             # Definición de rutas (Router)
│   └── auth.js            # Rutas de autenticación
├── 🛡️ middleware/         # Middleware personalizado
│   └── authMiddleware.js  # Validación JWT
└── ⚙️ server.js           # Servidor principal
```

#### **Patrones de Diseño:**
- **MVC Pattern**: Separación Modelo-Vista-Controlador
- **Middleware Pattern**: Pipeline de procesamiento de requests
- **Repository Pattern**: Abstracción de acceso a datos
- **Singleton Pattern**: Conexión única a base de datos

### 🗄️ **Base de Datos (Data Layer)**

#### **MongoDB Schema Design:**
```javascript
// User Collection
{
  _id: ObjectId,
  username: String (unique, required),
  password: String (hashed, required),
  email: String (optional),
  profile: {
    firstName: String,
    lastName: String,
    avatar: String
  },
  preferences: {
    theme: String (light/dark),
    language: String (es/en)
  },
  status: String (active/inactive/suspended),
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### **Índices de Performance:**
- `{ username: 1 }` - Búsqueda rápida por usuario
- `{ email: 1 }` - Búsqueda por email
- `{ createdAt: -1 }` - Ordenamiento por fecha

---

## 🔒 **Arquitectura de Seguridad**

### 🛡️ **Capas de Seguridad:**

```
┌─────────────────────────────────────────────────┐
│  1. 🌐 HTTPS/TLS (Transport Security)          │
├─────────────────────────────────────────────────┤
│  2. 🔐 CORS (Cross-Origin Protection)          │
├─────────────────────────────────────────────────┤
│  3. 🎫 JWT (Stateless Authentication)          │
├─────────────────────────────────────────────────┤
│  4. 🔑 bcrypt (Password Hashing)               │
├─────────────────────────────────────────────────┤
│  5. ✅ Input Validation (XSS Prevention)       │
├─────────────────────────────────────────────────┤
│  6. 🗄️ MongoDB Security (Injection Prevention)  │
└─────────────────────────────────────────────────┘
```

### 🔐 **Flujo de Autenticación:**
```
1. Usuario envía credenciales (POST /api/auth/login)
2. Backend valida datos y verifica contraseña
3. Si es válido, genera JWT token firmado
4. Frontend almacena token en localStorage
5. Requests posteriores incluyen token en header
6. Middleware verifica token en cada request protegido
7. Si token válido, permite acceso a recursos
```

---

## 📡 **API Architecture**

### 🛣️ **RESTful API Design:**

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Registro de usuario | ❌ |
| `POST` | `/api/auth/login` | Inicio de sesión | ❌ |
| `GET` | `/api/auth/dashboard` | Datos dashboard | ✅ |
| `GET` | `/api/auth/me` | Perfil usuario | ✅ |
| `PUT` | `/api/auth/profile` | Actualizar perfil | ✅ |
| `POST` | `/api/auth/logout` | Cerrar sesión | ✅ |

### 📨 **Formato de Respuestas:**
```javascript
// Respuesta exitosa
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2024-01-15T10:30:00Z"
}

// Respuesta de error
{
  "success": false,
  "error": "Error description",
  "details": ["Validation error 1", "Error 2"],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 🔄 **Flujo de Datos**

### 🎯 **Ciclo de Vida de Request:**
```
1. 🌐 Browser → HTTP Request → Express Server
2. 🛡️ Express → CORS Middleware → Security Check
3. 🛣️ Router → Route Matching → Controller
4. 🎛️ Controller → Business Logic → Model
5. 🗄️ Model → MongoDB Query → Database
6. ⬅️ Database → Result → Model → Controller
7. 📨 Controller → JSON Response → Browser
```

### 📊 **Estado de la Aplicación:**
```javascript
// Frontend State Management
{
  auth: {
    isAuthenticated: boolean,
    user: User | null,
    token: string | null
  },
  ui: {
    loading: boolean,
    errors: string[],
    currentPage: string
  },
  dashboard: {
    data: DashboardData | null,
    lastUpdated: Date
  }
}
```

---

## 🚀 **Escalabilidad y Performance**

### ⚡ **Optimizaciones Implementadas:**

#### **Frontend:**
- ✅ CSS minification y compresión
- ✅ JavaScript modular y lazy loading
- ✅ Imágenes optimizadas y lazy loading
- ✅ Local storage para cache de datos
- ✅ Debouncing en validaciones

#### **Backend:**
- ✅ Mongoose connection pooling
- ✅ JWT stateless authentication
- ✅ Request rate limiting
- ✅ Error handling centralizado
- ✅ Logging estructurado

#### **Base de Datos:**
- ✅ Índices optimizados
- ✅ Queries eficientes
- ✅ Connection pooling
- ✅ Data validation a nivel schema

### 📈 **Métricas de Performance:**
- **Frontend Load Time**: < 2 segundos
- **API Response Time**: < 200ms promedio
- **Database Query Time**: < 50ms promedio
- **Concurrent Users**: Hasta 100 usuarios simultáneos

---

## 🔧 **Decisiones Arquitectónicas**

### ✅ **Decisiones Tomadas:**

#### **1. Arquitectura Monolítica vs Microservicios**
- **Decisión**: Monolítica
- **Razón**: Proyecto pequeño, equipo reducido, simplicidad de deployment

#### **2. Database: SQL vs NoSQL**
- **Decisión**: MongoDB (NoSQL)
- **Razón**: Flexibilidad de esquema, simplicidad de setup, fit con Node.js

#### **3. Authentication: Sessions vs JWT**
- **Decisión**: JWT
- **Razón**: Stateless, escalable, compatible con SPA

#### **4. Frontend: Framework vs Vanilla**
- **Decisión**: Vanilla JavaScript + Bootstrap
- **Razón**: Simplicidad, control total, no overhead de framework

#### **5. API Style: REST vs GraphQL**
- **Decisión**: REST
- **Razón**: Simplicidad, estándares conocidos, fácil testing

### 🔄 **Trade-offs Considerados:**

| Aspecto | Ventaja | Desventaja |
|---------|---------|------------|
| **Monolítico** | Simple deployment | Menos escalable |
| **MongoDB** | Flexible schema | No ACID completo |
| **JWT** | Stateless | No invalidación inmediata |
| **Vanilla JS** | Control total | Más código boilerplate |
| **REST** | Estándar conocido | Menos flexible que GraphQL |

---

## 🛠️ **Herramientas de Desarrollo**

### 🔧 **Development Stack:**
- **Code Editor**: VS Code + Extensions
- **Version Control**: Git + GitHub
- **API Testing**: Postman + Thunder Client
- **Database GUI**: MongoDB Compass
- **Browser DevTools**: Chrome DevTools

### 📊 **Monitoring y Debugging:**
- **Frontend**: Browser DevTools, Lighthouse
- **Backend**: Node.js debugger, Console logging
- **Database**: MongoDB logs, Compass profiler
- **Network**: Chrome Network tab, Postman

---

## 📋 **Consideraciones Futuras**

### 🚀 **Posibles Mejoras:**

#### **Corto Plazo (Sprint 4-5):**
- ✅ Testing automatizado (Jest + Cypress)
- ✅ Error handling mejorado
- ✅ Performance monitoring
- ✅ Security hardening

#### **Mediano Plazo:**
- 🔄 Redis para session storage
- 📊 Logging centralizado (Winston)
- 🔍 APM monitoring (New Relic)
- 🔐 OAuth integration (Google, GitHub)

#### **Largo Plazo:**
- 🏗️ Microservicios architecture
- 🌐 CDN para assets estáticos
- 📱 Mobile app (React Native)
- ☁️ Cloud deployment (AWS/Azure)

---

## 📚 **Referencias y Estándares**

### 📖 **Estándares Seguidos:**
- **REST API**: Richardson Maturity Model Level 2
- **JavaScript**: ES6+ Standards
- **CSS**: BEM Methodology
- **Git**: Conventional Commits
- **Security**: OWASP Top 10

### 🔗 **Documentación de Referencia:**
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Schema Design](https://docs.mongodb.com/manual/data-modeling/)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [Web Security Guidelines](https://owasp.org/www-project-top-ten/)

---

## 👥 **Contribuciones del Equipo**

### 🎯 **Arquitectura por Sprint:**
- **Sprint 1**: Angie (Backend base) + Samuel (Frontend base)
- **Sprint 2**: Angie & Karol (API completa)
- **Sprint 3**: Samuel (UI/UX completa) + Franklin (Testing)
- **Sprint 4-5**: Todo el equipo (Integración y refinamiento)

---

<div align="center">

**📋 Documentado por Franklin - QA & Documentation Specialist**

*Arquitectura diseñada para ser simple, segura y escalable*

</div>
