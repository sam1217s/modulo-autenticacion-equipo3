# 🔐 Auth App - Sistema de Autenticación

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-En%20Desarrollo-yellow.svg)
![Methodology](https://img.shields.io/badge/methodology-SCRUM-green.svg)
![Team](https://img.shields.io/badge/team-4%20desarrolladores-purple.svg)

Sistema de autenticación moderno desarrollado con **metodología SCRUM** por un equipo multidisciplinario de 4 personas, utilizando Node.js, Express, MongoDB para el backend y HTML5, CSS3, JavaScript para el frontend.

---

## 👥 **EQUIPO DE DESARROLLO Y ROLES ESPECÍFICOS**

### 🔧 **Backend Development Team**
- **👩‍💻 Angie - Backend
  - **Rol Principal**: Líder Backend & Arquitectura de Datos
  - **Responsabilidades Específicas**:
    - Diseño y implementación de modelos de base de datos (MongoDB/Mongoose)
    - Sistema de autenticación JWT y hash de contraseñas (bcrypt)
    - Desarrollo de controladores de autenticación (register/login)
    - Implementación de middleware de seguridad y validación
    - Configuración del servidor Express y estructura del proyecto
  
- **👩‍💻 Karol - Backend 
  - **Rol Principal**: API & Integración
  - **Responsabilidades Específicas**:
    - Desarrollo de rutas API RESTful (/api/auth)
    - Implementación de endpoints y manejo de respuestas HTTP
    - Sistema de manejo de errores centralizado
    - Testing de API con Postman y automatización
    - Optimización de consultas y performance de base de datos
    - Documentación técnica de endpoints

### 🎨 **Frontend Development Team**
- **👨‍💻 Samuel 
  - **Rol Principal**: UI/UX 
  - **Responsabilidades Específicas**:
    - Desarrollo completo de interfaces de usuario (HTML5, CSS3, JavaScript ES6+)
    - Implementación de diseño responsive y mobile-first
    - Desarrollo del dashboard interactivo con sidebar colapsable
    - Integración frontend-backend mediante fetch API y manejo de JWT
    - Implementación de validación de formularios en tiempo real
    - Optimización de performance frontend y experiencia de usuario
    - Testing de compatibilidad cross-browser y dispositivos móviles

### 📚 **Quality Assurance & Documentation Team**
- **👨‍💻 Franklin 
  - **Rol Principal**: Documentación Técnica
  - **Responsabilidades Específicas**:
    - Diseño e implementación de casos de prueba (test cases)
    - Ejecución de pruebas de usuario y usabilidad (UX testing)
    - Documentación técnica completa (API docs, user manuals)
    - Testing de integración frontend-backend
    - Reporte y seguimiento de bugs mediante GitHub Issues
    - Creación de guías de deployment y mantenimiento
    - Control de calidad del código y estándares de desarrollo

---

## 🚀 **METODOLOGÍA SCRUM - 5 SPRINTS DE 6 HORAS CADA UNO**

### ⏰ **HORARIO DE TRABAJO SCRUM**
- **📅 Duración por Sprint**: 6 horas (5 días laborables = 1 semana)
- **🕐 Horario Diario**: 12:30 PM - 6:00 PM (5 horas)
- **☕ Descanso**: 30 minutos (3:00 PM - 3:30 PM)
- **⚡ Horas Efectivas**: 4.5 horas productivas por día
- **📊 Distribución Sprint**: 6 horas concentradas de desarrollo por sprint
- **🎯 Total del Proyecto**: 30 horas de desarrollo (5 sprints × 6h)

### 📋 **SPRINT PLANNING DETALLADO**

| Sprint | Semana | Días Lab. | Horas Totales | Objetivo Principal | Líder |
|--------|--------|-----------|---------------|-------------------|--------|
| **Sprint 1** | Semana 1 | 1 día | 6h | Setup & Arquitectura | Angie |
| **Sprint 2** | Semana 2 | 1 día | 6h | Backend Core & Auth | Angie |
| **Sprint 3** | Semana 3 | 1 día | 6h | Frontend UI/UX | Samuel |
| **Sprint 4** | Semana 4 | 1 día | 6h | Integración & Testing | Franklin |
| **Sprint 5** | Semana 5 | 1 día | 6h | Refinamiento & Deploy | Todo el equipo |

### 🕐 **CRONOGRAMA DIARIO SCRUM INTENSIVO**
```
12:30 PM - 12:35 PM  │ Daily Standup (5 min)
12:35 PM - 1:45 PM   │ 🎯 Trabajo Sprint (1h 10min)
1:45 PM - 3:00 PM    │ Trabajo Individual (1h 15min)
3:00 PM - 3:30 PM    │ ☕ DESCANSO (30 min)
3:30 PM - 6:00 PM    │ Trabajo Individual (2h 30min)
```

### ⚡ **DISTRIBUCIÓN DE 6 HORAS POR SPRINT**
```
📊 ENFOQUE INTENSIVO POR SPRINT:

Sprint 1 (6h): Setup & Arquitectura
├── 2h → Configuración repositorio y herramientas
├── 2h → Estructura base backend/frontend  
├── 1h → Documentación inicial
└── 1h → Planning Sprint 2

Sprint 2 (6h): Backend Core
├── 3h → Sistema autenticación JWT
├── 2h → API endpoints y validación
└── 1h → Testing y documentación

Sprint 3 (6h): Frontend UI/UX  
├── 3h → Desarrollo interface completa
├── 2h → Integración con backend
└── 1h → Testing responsive

Sprint 4 (6h): Integración & Testing
├── 2h → Testing integración completa
├── 2h → Pruebas usuario y UX
├── 1h → Bug fixes
└── 1h → Documentación final

Sprint 5 (6h): Deploy & Refinamiento
├── 2h → Optimización y deployment
├── 2h → Documentación completa
├── 1h → Testing final
└── 1h → Presentación y cierre
```

**Total: 30 horas de desarrollo concentrado en 5 semanas**

---

## 📅 **SPRINT 1: FUNDACIÓN Y SETUP**
**🎯 Objetivo:** Establecer la base del proyecto y arquitectura

### 🔧 **Backend (Angie & Karol)**
- [x] Configuración del repositorio y ramas
- [x] Setup del servidor Express
- [x] Configuración de MongoDB
- [x] Estructura de carpetas del proyecto
- [x] Configuración de variables de entorno
- [x] Setup de herramientas de desarrollo (nodemon, eslint)

### 🎨 **Frontend (Samuel)**
- [x] Estructura HTML básica
- [x] Setup de estilos CSS base
- [x] Configuración de herramientas de desarrollo
- [x] Diseño de mockups y wireframes
- [x] Setup de responsive design framework

### 📚 **Documentación (Franklin)**
- [x] README inicial del proyecto
- [x] Documentación de arquitectura
- [x] Plan de testing inicial
- [x] Definición de casos de uso
- [x] Setup de herramientas de documentación

### 🎯 **Entregables Sprint 1:**
- Repositorio configurado con ramas
- Servidor básico funcionando
- Estructura HTML base
- Documentación inicial

---

## 📅 **SPRINT 2: BACKEND CORE & AUTENTICACIÓN**
**🎯 Objetivo:** Desarrollar el sistema de autenticación completo

### 🔧 **Backend (Angie & Karol)**

#### **Angie - Autenticación & Seguridad**
- [x] Modelo de Usuario (MongoDB/Mongoose)
- [x] Hash de contraseñas con bcrypt
- [x] Generación y validación de JWT
- [x] Middleware de autenticación
- [x] Controladores de registro y login
- [x] Validación y sanitización de datos

#### **Karol - API & Integración**
- [x] Rutas de autenticación (/api/auth)
- [x] Endpoints RESTful completos
- [x] Manejo de errores centralizado
- [x] Testing de endpoints con Postman
- [x] Documentación de API
- [x] Optimización de queries de BD

### 🎨 **Frontend (Samuel)**
- [ ] Investigación de integración con API
- [ ] Preparación de formularios de auth
- [ ] Diseño de componentes reutilizables

### 📚 **Documentación & Testing (Franklin)**
- [x] Documentación de API endpoints
- [x] Casos de prueba para autenticación
- [x] Testing manual de funcionalidades backend
- [x] Reporte de bugs y sugerencias
- [x] Documentación de base de datos

### 🎯 **Entregables Sprint 2:**
- API de autenticación completa
- Endpoints probados y documentados
- Sistema de JWT funcionando
- Documentación técnica actualizada

---

## 📅 **SPRINT 3: FRONTEND UI/UX COMPLETO**
**🎯 Objetivo:** Desarrollar la interfaz de usuario completa

### 🎨 **Frontend (Samuel)**

#### **Páginas de Autenticación**
- [x] Página de Login responsive
- [x] Página de Registro con validación
- [x] Validación en tiempo real
- [x] Indicador de fuerza de contraseña
- [x] Manejo de estados de carga
- [x] Mensajes de error y éxito

#### **Dashboard Principal**
- [x] Layout responsivo completo
- [x] Sidebar colapsable con hover
- [x] Header con navegación
- [x] Cards de estadísticas
- [x] Tablas de datos
- [x] Modales con Bootstrap
- [x] Sistema de notificaciones

#### **JavaScript & Integración**
- [x] Módulos JavaScript organizados
- [x] Integración con API backend
- [x] Manejo de autenticación JWT
- [x] LocalStorage management
- [x] Validación de formularios
- [x] Estados de carga y error

### 🔧 **Backend (Angie & Karol)**
- [x] Endpoint de dashboard data
- [x] Middleware de validación mejorado
- [x] Optimizaciones de performance
- [x] Logs y monitoring básico

### 📚 **Documentación & Testing (Franklin)**
- [x] Testing de UX en diferentes dispositivos
- [x] Documentación de componentes frontend
- [x] Casos de prueba de interface
- [x] Reporte de usabilidad
- [x] Testing de accesibilidad básico

### 🎯 **Entregables Sprint 3:**
- Interface de usuario completa
- Páginas responsive funcionando
- JavaScript integrado con backend
- UX testing completado

---

## 📅 **SPRINT 4: INTEGRACIÓN Y TESTING COMPLETO**
**🎯 Objetivo:** Integrar frontend y backend, testing

### 🔗 **Integración (Todo el Equipo)**

#### **Backend (Angie & Karol)**
- [ ] CORS configurado correctamente
- [ ] Validación de datos mejorada
- [ ] Manejo de errores refinado
- [ ] Optimización de consultas BD
- [ ] Logs y monitoring avanzado
- [ ] Testing de carga básico

#### **Frontend (Samuel)**
- [ ] Integración completa con API
- [ ] Manejo de errores de red
- [ ] Estados de loading optimizados
- [ ] Validación frontend/backend sincronizada
- [ ] Optimización de performance
- [ ] Progressive Web App features (PWA)

#### **Testing & QA (Franklin)**
- [ ] Testing de integración completo
- [ ] Pruebas de usuario con casos reales
- [ ] Testing de seguridad básico
- [ ] Performance testing
- [ ] Cross-browser testing
- [ ] Mobile device testing
- [ ] Accessibility compliance testing

### 🎯 **Entregables Sprint 4:**
- Aplicación completamente integrada
- Suite de testing exhaustiva
- Reporte de performance
- Documentación de deployment

---

## 📅 **SPRINT 5: REFINAMIENTO Y DEPLOYMENT**
**🎯 Objetivo:** Pulir la aplicación y preparar para producción

### 🚀 **Deployment & Refinamiento (Todo el Equipo)**

#### **Backend (Angie & Karol)**
- [ ] Configuración para producción
- [ ] Variables de entorno seguras
- [ ] Database optimization
- [ ] Security hardening
- [ ] Monitoring y logging
- [ ] Backup strategy

#### **Frontend (Samuel)**
- [ ] Build optimization
- [ ] Asset compression
- [ ] PWA implementation
- [ ] SEO optimization
- [ ] Performance monitoring
- [ ] UI/UX final polish

#### **Documentation & Final QA (Franklin)**
- [ ] Documentación final completa
- [ ] Manual de usuario
- [ ] Guía de deployment
- [ ] Testing de regresión
- [ ] User Acceptance Testing (UAT)
- [ ] Documentación de mantenimiento

### 🎯 **Entregables Sprint 5:**
- Aplicación lista para producción
- Documentación completa
- Manual de usuario
- Estrategia de mantenimiento

---

## 📁 **ESTRUCTURA DEL PROYECTO**

```
auth-app/
├── 📁 backend/                 # API Server (Angie & Karol)
│   ├── 📁 src/
│   │   ├── 📁 controllers/     # Lógica de negocio
│   │   ├── 📁 middleware/      # Middleware personalizado
│   │   ├── 📁 models/          # Modelos de MongoDB
│   │   ├── 📁 routes/          # Rutas de la API
│   │   ├── 📁 utils/           # Utilidades
│   │   └── server.js           # Servidor principal
│   ├── 📁 tests/               # Tests del backend
│   ├── package.json
│   └── README.md
├── 📁 frontend/                # Client App (Samuel)
│   ├── 📁 src/
│   │   ├── 📁 css/             # Estilos
│   │   ├── 📁 js/              # JavaScript modules
│   │   └── 📁 assets/          # Recursos estáticos
│   ├── 📁 tests/               # Tests del frontend
│   ├── index.html              # Página de login
│   ├── register.html           # Página de registro
│   ├── dashboard.html          # Dashboard principal
│   └── README.md
├── 📁 docs/                    # Documentación (Franklin)
│   ├── 📁 api/                 # Documentación de API
│   ├── 📁 testing/             # Reportes de testing
│   ├── 📁 user-manual/         # Manual de usuario
│   ├── architecture.md         # Arquitectura del sistema
│   ├── deployment.md           # Guía de deployment
│   └── maintenance.md          # Guía de mantenimiento
├── 📁 scripts/                 # Scripts de deployment
└── README.md                   # Este archivo
```

---

## 🔧 **TECNOLOGÍAS UTILIZADAS**

### 🔧 **Backend Stack**
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - JSON Web Tokens para auth
- **bcryptjs** - Hash de contraseñas
- **CORS** - Cross-Origin Resource Sharing

### 🎨 **Frontend Stack**
- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos + Custom Properties
- **JavaScript (ES6+)** - Lógica del cliente
- **Bootstrap 5** - Framework UI
- **Font Awesome** - Iconografía

### 🛠️ **Development Tools**
- **Git & GitHub** - Control de versiones
- **VS Code** - IDE
- **Postman** - Testing de API
- **Chrome DevTools** - Debug frontend
- **MongoDB Compass** - GUI para MongoDB

---

## 🚀 **QUICK START**

### 📋 **Prerrequisitos**
- Node.js (v16 or superior)
- MongoDB (local o cloud)
- Git
- Editor de código

### ⚡ **Instalación Rápida**

```bash
# 1. Clonar repositorio
git clone https://github.com/team/auth-app.git
cd auth-app

# 2. Setup Backend
cd backend
npm install
cp .env.example .env
# Editar .env con tu configuración
npm run dev

# 3. Setup Frontend (nueva terminal)
cd ../frontend
npm install
npm run dev

# 4. Acceder a la aplicación
# Frontend: http://localhost:3000
# Backend: http://localhost:4000
```

---

## 📊 **PROGRESO DEL PROYECTO**

### ✅ **Estado Actual de Sprints (Metodología Intensiva)**
- [x] **Sprint 1**: Fundación y Setup (100% - 6h completadas)
- [x] **Sprint 2**: Backend Core & Auth (100% - 6h completadas)  
- [x] **Sprint 3**: Frontend UI/UX (100% - 6h completadas)
- [x] **Sprint 4**: Integración & Testing (100% - 0h/6h)
- [x] **Sprint 5**: Refinamiento & Deploy (100% - 0h/6h)

### 📈 **Métricas del Proyecto (Desarrollo Ágil Intensivo)**
- **👥 Desarrolladores**: 4 personas
- **⏰ Horario disponible**: 5 horas diarias (4.5h productivas + ceremonias)
- **📅 Duración por sprint**: 1 dia (5 días laborables)
- **🕐 Horas por sprint**: 6 horas concentradas de desarrollo
- **📊 Total horas proyecto**: 30 horas (5 sprints × 6h)


## 🧪 **TESTING STRATEGY**

### 🔧 **Backend Testing (Angie & Karol)**
- Unit Tests con Jest
- Integration Tests para API
- Load Testing básico
- Security Testing

### 🎨 **Frontend Testing (Samuel)**
- UI Component Testing
- Cross-browser Testing
- Responsive Design Testing
- Performance Testing

### 📚 **User Testing (Franklin)**
- Usability Testing
- User Acceptance Testing (UAT)
- Accessibility Testing
- Bug Tracking & Reporting


## 📚 **DOCUMENTACIÓN**

### 📖 **Para Desarrolladores**
- [Documentación de API](./docs/api/README.md)
- [Guía de Arquitectura](./docs/architecture.md)
- [Setup de Desarrollo](./docs/development-setup.md)
- [Estándares de Código](./docs/coding-standards.md)

### 👤 **Para Usuarios**
- [Manual de Usuario](./docs/user-manual/README.md)
- [FAQ](./docs/user-manual/faq.md)
- [Guía de Troubleshooting](./docs/user-manual/troubleshooting.md)

### 🚀 **Para DevOps**
- [Guía de Deployment](./docs/deployment.md)
- [Guía de Mantenimiento](./docs/maintenance.md)
- [Monitoring y Logs](./docs/monitoring.md)

---

## 🤝 **FLUJO DE TRABAJO SCRUM**

### 🌿 **Branching Strategy**
```
main
├── backend-dev (Angie & Karol)
├── frontend-dev (Samuel)
└── docs-dev (Franklin)
```

### 📋 **Daily Scrum Standup**
- **⏰ Horario**: 12:30 PM - 12:45 
- **📍 Formato**: Presencial/Virtual (Discord)
- **❓ Preguntas Clave**:
  1. ¿Qué completé ayer en las 5 horas de trabajo?
  2. ¿Qué planeo hacer hoy en mi bloque de 4.5 horas?
  3. ¿Tengo algún bloqueador que impida mi progreso?
- **👥 Participantes**: Todo el equipo (Angie, Karol, Samuel, Franklin)
- **📝 Registro**: Notas en GitHub Projects/Issues
- 

## 📄 **LICENCIA**

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

---

## 🏆 **RECONOCIMIENTOS**

- **Metodología SCRUM** implementada exitosamente
- **Colaboración efectiva** entre equipos multidisciplinarios  
- **Calidad de código** mantenida a lo largo del proyecto
- **Documentación exhaustiva** para escalabilidad futura

---

<div align="center">

**Desarrollado con ❤️ por el Team Auth App**

![Team](https://img.shields.io/badge/Team-Angie%20|%20Karol%20|%20Samuel%20|%20Franklin-blue)

[🐛 Reportar Bug](https://github.com/team/auth-app/issues) • [✨ Solicitar Feature](https://github.com/team/auth-app/issues) • [📚 Ver Docs](./docs/README.md)

</div>
