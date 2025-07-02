# 🔐 Auth App - Sistema de Autenticación Completo

Sistema de autenticación moderno con backend Node.js y frontend responsive, desarrollado colaborativamente.
## 🌟 Características

### 🔒 Backend (Node.js + Express + MongoDB)
- ✅ Autenticación JWT segura
- ✅ Hash de contraseñas con bcrypt
- ✅ Validación de datos robusta
- ✅ API RESTful bien estructurada
- ✅ Middleware de autenticación
- ✅ Gestión de errores centralizada

### 🎨 Frontend (HTML + CSS + JavaScript)
- ✅ Diseño moderno y responsive
- ✅ Validación en tiempo real
- ✅ Dashboard interactivo
- ✅ Indicador de fuerza de contraseña
- ✅ Manejo de estados de carga
- ✅ Soporte para dispositivos móviles

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js (v16 o superior)
- MongoDB (local o cloud)
- npm o yarn

### Instalación Completa

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/auth-app.git
cd auth-app
```

2. **Configurar Backend**
```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tu configuración de MongoDB
npm run dev
```

3. **Configurar Frontend**
```bash
cd ../frontend  
npm install
npm run dev
```

4. **Acceder a la aplicación**
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## 📁 Estructura del Proyecto

```
auth-app/
├── 📁 backend/              # API Server (Node.js + Express)
│   ├── 📁 src/
│   │   ├── 📁 controllers/  # Lógica de negocio
│   │   ├── 📁 middleware/   # Middleware personalizado
│   │   ├── 📁 models/       # Modelos de MongoDB
│   │   ├── 📁 routes/       # Rutas de la API
│   │   └── server.js        # Servidor principal
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── 📁 frontend/             # Client App (HTML + CSS + JS)
│   ├── 📁 src/
│   │   ├── 📁 css/          # Estilos
│   │   ├── 📁 js/           # JavaScript modules
│   │   └── 📁 assets/       # Recursos estáticos
│   ├── index.html           # Página de login
│   ├── register.html        # Página de registro
│   ├── dashboard.html       # Dashboard principal
│   ├── package.json
│   └── README.md
└── README.md               # Este archivo
```

## 🔧 Scripts Disponibles

### Backend
```bash
npm start          # Servidor de producción
npm run dev        # Servidor de desarrollo con nodemon
npm test           # Ejecutar tests
npm run lint       # Linter de código
```

### Frontend
```bash
npm start          # Servidor de producción
npm run dev        # Servidor de desarrollo con live-reload
npm run build      # Build para producción
npm run lint       # Linter de código
npm run format     # Formatear código
```

## 🔗 API Endpoints

### Autenticación
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Registrar usuario | ❌ |
| `POST` | `/api/auth/login` | Iniciar sesión | ❌ |
| `GET` | `/api/auth/dashboard` | Datos del dashboard | ✅ |
| `GET` | `/api/auth/me` | Perfil del usuario | ✅ |
| `PUT` | `/api/auth/profile` | Actualizar perfil | ✅ |
| `POST` | `/api/auth/logout` | Cerrar sesión | ✅ |

### Ejemplo de Uso
```javascript
// Registro de usuario
fetch('http://localhost:4000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'johndoe',
    password: 'securepass123'
  })
});

// Login
fetch('http://localhost:4000/api/auth/login', {
  method: 'POST', 
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'johndoe',
    password: 'securepass123'
  })
});
```

## 🛡️ Seguridad

### Backend
- Hashing de contraseñas con bcrypt (12 rounds)
- Tokens JWT con expiración configurable
- Validación y sanitización de inputs
- Protección CORS configurada
- Manejo seguro de errores sin exposición de datos

### Frontend
- Validación de formularios en tiempo real
- Almacenamiento seguro de tokens
- Protección contra XSS básica
- Redirección automática basada en autenticación
- Validación de fuerza de contraseña

## 🎨 Diseño y UX

### Características del Diseño
- **Responsive**: Funciona en móvil, tablet y desktop
- **Moderno**: Glassmorphism y gradientes
- **Accesible**: Contraste adecuado y semántica HTML
- **Rápido**: Animaciones suaves y carga optimizada

### Paleta de Colores
- Primario: `#6366f1` (Indigo)
- Secundario: `#8b5cf6` (Violet)
- Éxito: `#10b981` (Emerald)
- Error: `#ef4444` (Red)
- Advertencia: `#f59e0b` (Amber)

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
- Testing manual en múltiples navegadores
- Validación de responsive design
- Testing de funcionalidades de autenticación

## 🚀 Despliegue

### Backend (Heroku/Railway/Render)
1. Configurar variables de entorno
2. Conectar base de datos MongoDB Atlas
3. Deploy desde GitHub

### Frontend (Netlify/Vercel/GitHub Pages)
1. Build del proyecto: `npm run build`
2. Configurar variables de entorno para API URL
3. Deploy de la carpeta dist/

### Variables de Entorno

#### Backend (.env)
```env
PORT=4000
NODE_ENV=production
MONGO_URI=mongodb://localhost:27017/auth_app
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
FRONTEND_URL=http://localhost:3000
```

#### Frontend
Configurar API URL en `src/js/config.js` para producción.

## 👥 Equipo de Desarrollo

### 🔧 Backend Team
- **Desarrollador Backend 1**: Autenticación & Modelos de Datos
  - Server setup y configuración
  - Modelos de MongoDB
  - Controladores de autenticación
  - Middleware de seguridad

- **Desarrollador Backend 2**: API & Rutas
  - Rutas de la API
  - Integración de endpoints
  - Testing y validación
  - Documentación

### 🎨 Frontend Team
- **Desarrollador Frontend**: UI/UX & Cliente
  - Diseño responsive
  - Páginas HTML y CSS
  - JavaScript del cliente
  - Experiencia de usuario

## 🔄 Flujo de Desarrollo

### Branches Utilizadas
- `main`: Rama principal con código estable
- `backend-dev`: Desarrollo del backend
- `frontend-dev`: Desarrollo del frontend

### Proceso de Desarrollo
1. Desarrollo en ramas separadas
2. Pull requests para integración
3. Code review antes del merge
4. Testing en main branch

## 📊 Características Técnicas

### Performance
- Tiempo de carga < 2 segundos
- Animaciones a 60fps
- Optimización de imágenes
- Lazy loading implementado

### Compatibilidad
- Navegadores modernos (Chrome 90+, Firefox 88+, Safari 14+)
- Dispositivos móviles y desktop
- Resoluciones desde 320px hasta 4K

## 🐛 Problemas Conocidos

- [ ] Validación offline pendiente
- [ ] Push notifications no implementadas
- [ ] Tests automatizados en desarrollo

## 🔮 Roadmap

### v1.1.0
- [ ] Recuperación de contraseña
- [ ] Verificación por email
- [ ] Perfiles de usuario extendidos

### v1.2.0
- [ ] Autenticación con Google/GitHub
- [ ] Roles y permisos
- [ ] API de notificaciones

### v2.0.0
- [ ] Migración a TypeScript
- [ ] PWA (Progressive Web App)
- [ ] Modo offline

## 📞 Soporte

### Reportar Bugs
- Crear issue en GitHub con:
  - Descripción detallada
  - Pasos para reproducir
  - Capturas de pantalla
  - Información del navegador/OS

### Solicitar Funcionalidades
- Crear issue con label "enhancement"
- Describir caso de uso
- Especificar prioridad

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🤝 Contribuir

1. Fork del proyecto
2. Crear rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit de cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📚 Recursos Adicionales

- [Documentación del Backend](./backend/README.md)
- [Documentación del Frontend](./frontend/README.md)
- [Guía de Despliegue](./docs/deployment.md)
- [Guía de Contribución](./docs/contributing.md)

---

<div align="center">

**Desarrollado con ❤️ por el equipo de Auth App**

[Reportar Bug](https://github.com/tu-usuario/auth-app/issues) • [Solicitar Feature](https://github.com/tu-usuario/auth-app/issues) • [Documentación](https://github.com/tu-usuario/auth-app/wiki)

</div>
