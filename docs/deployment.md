# 🚀 Guía de Deployment - Auth App

## 📋 **Información del Documento**
- **Autor**: Franklin - QA & Documentation Specialist
- **Versión**: 1.0.0
- **Fecha**: Sprint 4 - Preparación para producción
- **Estado**: En preparación

---

## 🎯 **Visión General del Deployment**

Esta guía proporciona instrucciones detalladas para el deployment de Auth App en diferentes entornos, desde desarrollo local hasta producción completa.

### 🌍 **Entornos Disponibles**

```
Development → Staging → Production
     ↓           ↓          ↓
  localhost   testing    live app
  (Sprint 1-3) (Sprint 4) (Sprint 5)
```

---

## 🛠️ **Prerrequisitos del Sistema**

### 📋 **Requisitos Mínimos**

| Componente | Versión Mínima | Versión Recomendada | Notas |
|------------|---------------|---------------------|-------|
| **Node.js** | v16.0.0 | v18.0.0+ | LTS recomendado |
| **MongoDB** | v5.0 | v6.0+ | Community/Atlas |
| **Git** | v2.20+ | v2.40+ | Control de versiones |
| **RAM** | 2GB | 4GB+ | Para desarrollo |
| **Storage** | 1GB | 5GB+ | Logs y base de datos |

### 🔧 **Herramientas de Desarrollo**
```bash
# Verificar versiones instaladas
node --version     # v18.0.0+
npm --version      # v9.0.0+
git --version      # v2.40+
mongo --version    # v6.0+
```

---

## 🏠 **Deployment Local (Development)**

### ⚡ **Setup Rápido**

```bash
# 1. Clonar repositorio
git clone https://github.com/team/auth-app.git
cd auth-app

# 2. Setup Backend
cd backend
npm install
cp .env.example .env

# 3. Configurar variables de entorno
# Editar .env con configuración local
nano .env
```

### 📝 **Configuración .env para Desarrollo**
```bash
# .env file para desarrollo local
NODE_ENV=development
PORT=4000

# MongoDB Local
MONGODB_URI=mongodb://localhost:27017/authapp_dev
DB_NAME=authapp_dev

# JWT Configuration
JWT_SECRET=tu_super_secret_key_development_2024
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=debug
LOG_FILE=logs/app.log

# Security
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

### 🚀 **Comandos de Inicio**
```bash
# Terminal 1 - Backend
cd backend
npm run dev          # Inicia con nodemon
# Servidor: http://localhost:4000

# Terminal 2 - Frontend (Live Server)
cd frontend
npx live-server --port=3000
# Cliente: http://localhost:3000

# Terminal 3 - MongoDB (si es local)
mongod --dbpath ./data/db
```

### 🔍 **Verificación de Desarrollo**
```bash
# Test de API
curl http://localhost:4000/api/health
# Response: {"status": "OK", "timestamp": "..."}

# Test de Frontend
open http://localhost:3000
# Debe cargar la página de login
```

---

## 🧪 **Deployment Staging (Testing)**

### 🔧 **Configuración de Staging**

```bash
# 1. Crear rama de staging
git checkout -b staging
git push origin staging

# 2. Setup servidor staging
ssh user@staging-server.com
cd /var/www/auth-app-staging
git clone -b staging https://github.com/team/auth-app.git .
```

### 📝 **Variables de Entorno - Staging**
```bash
# .env.staging
NODE_ENV=staging
PORT=4001

# MongoDB Atlas Staging
MONGODB_URI=mongodb+srv://user:pass@cluster-staging.mongodb.net/authapp_staging
DB_NAME=authapp_staging

# JWT Configuration
JWT_SECRET=staging_secret_key_ultra_secure_2024
JWT_EXPIRES_IN=1d

# Frontend
FRONTEND_URL=https://staging-auth-app.com
CORS_ORIGIN=https://staging-auth-app.com

# Logging
LOG_LEVEL=info
LOG_FILE=/var/log/auth-app/staging.log

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=50
```

### 🚀 **Deploy Script Staging**
```bash
#!/bin/bash
# deploy-staging.sh

echo "🚀 Iniciando deployment staging..."

# 1. Pull latest changes
git pull origin staging

# 2. Install dependencies
cd backend && npm ci
cd ../frontend && npm ci

# 3. Run tests
npm run test

# 4. Restart services
pm2 restart auth-app-staging

# 5. Health check
sleep 10
curl -f http://localhost:4001/api/health

echo "✅ Staging deployment completado!"
```

---

## 🌐 **Deployment Producción**

### 🏭 **Arquitectura de Producción**

```
                    🌐 Internet
                         │
              ┌─────────────────────┐
              │   Load Balancer     │ (Nginx/CloudFlare)
              │   SSL Termination   │
              └─────────┬───────────┘
                        │
           ┌────────────┴────────────┐
           │                         │
    ┌─────────────┐         ┌─────────────┐
    │   Server 1  │         │   Server 2  │
    │  Frontend   │         │  Backend    │
    │  (Nginx)    │         │  (Node.js)  │
    └─────────────┘         └─────┬───────┘
                                  │
                         ┌────────┴────────┐
                         │   MongoDB       │
                         │   Atlas/Cloud   │
                         └─────────────────┘
```

### 📝 **Variables de Entorno - Producción**
```bash
# .env.production
NODE_ENV=production
PORT=4000

# MongoDB Atlas Production
MONGODB_URI=mongodb+srv://produser:securepass@cluster-prod.mongodb.net/authapp_prod
DB_NAME=authapp_prod

# JWT Configuration
JWT_SECRET=ultra_secure_production_key_2024_auth_app
JWT_EXPIRES_IN=24h

# Frontend
FRONTEND_URL=https://auth-app.com
CORS_ORIGIN=https://auth-app.com

# Logging
LOG_LEVEL=error
LOG_FILE=/var/log/auth-app/production.log

# Security
BCRYPT_ROUNDS=15
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=20

# Monitoring
SENTRY_DSN=https://your-sentry-dsn.com
NEW_RELIC_LICENSE_KEY=your-newrelic-key
```

### 🔐 **Configuración Nginx**
```nginx
# /etc/nginx/sites-available/auth-app
server {
    listen 80;
    server_name auth-app.com www.auth-app.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name auth-app.com www.auth-app.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/auth-app.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/auth-app.com/privkey.pem;
    
    # Frontend (Static Files)
    location / {
        root /var/www/auth-app/frontend;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 🚀 **Script de Deploy Producción**
```bash
#!/bin/bash
# deploy-production.sh

set -e  # Exit on any error

echo "🚀 Iniciando deployment producción..."

# 1. Backup actual
echo "📦 Creando backup..."
sudo cp -r /var/www/auth-app /var/backups/auth-app-$(date +%Y%m%d_%H%M%S)

# 2. Pull latest stable
cd /var/www/auth-app
git pull origin main

# 3. Install dependencies
echo "📥 Instalando dependencias..."
cd backend && npm ci --production
cd ../frontend && npm ci --production

# 4. Run production tests
echo "🧪 Ejecutando tests..."
npm run test:production

# 5. Build frontend
echo "🏗️ Building frontend..."
npm run build

# 6. Restart services with zero downtime
echo "🔄 Reiniciando servicios..."
pm2 reload auth-app-production --update-env

# 7. Health check
echo "🔍 Verificando health..."
sleep 15
if curl -f https://auth-app.com/api/health; then
    echo "✅ Deployment exitoso!"
    
    # 8. Notify team
    curl -X POST -H 'Content-type: application/json' \
         --data '{"text":"🚀 Auth App deployed successfully to production!"}' \
         $SLACK_WEBHOOK_URL
else
    echo "❌ Health check failed, rolling back..."
    pm2 reload auth-app-production
    exit 1
fi
```

---

## 🐳 **Deployment con Docker**

### 📝 **Dockerfile Backend**
```dockerfile
# Dockerfile.backend
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S authapp -u 1001
USER authapp

EXPOSE 4000

CMD ["npm", "start"]
```

### 📝 **Dockerfile Frontend**
```dockerfile
# Dockerfile.frontend
FROM nginx:alpine

# Copy static files
COPY . /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 📝 **Docker Compose**
```yaml
# docker-compose.yml
version: '3.8'

services:
  mongodb:
    image: mongo:6
    container_name: auth-app-db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: secure_password
      MONGO_INITDB_DATABASE: authapp
    volumes:
      - mongodb_data:/data/db
    ports:
      - "27017:27017"
    networks:
      - auth-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.backend
    container_name: auth-app-backend
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://admin:secure_password@mongodb:27017/authapp
      JWT_SECRET: docker_production_secret_2024
    ports:
      - "4000:4000"
    depends_on:
      - mongodb
    networks:
      - auth-network
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.frontend
    container_name: auth-app-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - auth-network
    restart: unless-stopped

volumes:
  mongodb_data:

networks:
  auth-network:
    driver: bridge
```

### 🚀 **Comandos Docker**
```bash
# Build y deploy
docker-compose up -d --build

# Logs
docker-compose logs -f

# Scale services
docker-compose up -d --scale backend=3

# Stop
docker-compose down
```

---

## ☁️ **Cloud Deployment**

### 🔧 **AWS Deployment**

#### **EC2 + RDS + S3**
```bash
# 1. Launch EC2 instance
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1d0 \
  --count 1 \
  --instance-type t3.medium \
  --key-name auth-app-key \
  --security-group-ids sg-12345678

# 2. Setup MongoDB on AWS DocumentDB
aws docdb create-db-cluster \
  --db-cluster-identifier auth-app-cluster \
  --engine docdb \
  --master-username admin \
  --master-user-password SecurePassword2024

# 3. Deploy to S3 (Frontend)
aws s3 sync ./frontend s3://auth-app-frontend --delete
```

#### **Elastic Beanstalk**
```yaml
# .ebextensions/nodejs.config
option_settings:
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
    NPM_USE_PRODUCTION: true
  aws:elasticbeanstalk:nodejs:
    NodeCommand: "npm start"
    NodeVersion: "18.0.0"
```

### 🌐 **Vercel Deployment (Frontend)**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "**/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://api.auth-app.com/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

### 🚀 **Heroku Deployment (Backend)**
```json
{
  "name": "auth-app-backend",
  "description": "Auth App Backend API",
  "repository": "https://github.com/team/auth-app",
  "logo": "https://auth-app.com/logo.png",
  "keywords": ["node", "express", "mongodb", "jwt"],
  "env": {
    "NODE_ENV": {
      "description": "Environment",
      "value": "production"
    },
    "JWT_SECRET": {
      "description": "JWT Secret Key",
      "generator": "secret"
    },
    "MONGODB_URI": {
      "description": "MongoDB Connection String"
    }
  },
  "formation": {
    "web": {
      "quantity": 1,
      "size": "standard-1x"
    }
  },
  "addons": [
    "mongolab:sandbox",
    "papertrail:choklad"
  ]
}
```

---

## 🔍 **Verificación Post-Deployment**

### ✅ **Checklist de Verificación**

#### **🔧 Backend Checks**
```bash
# 1. Health endpoint
curl https://api.auth-app.com/api/health
# Expected: {"status": "OK", "timestamp": "..."}

# 2. Database connection
curl https://api.auth-app.com/api/db-status
# Expected: {"database": "connected", "collections": [...]}

# 3. Authentication endpoint
curl -X POST https://api.auth-app.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```

#### **🎨 Frontend Checks**
```bash
# 1. Static assets loading
curl -I https://auth-app.com/src/css/auth.css
# Expected: 200 OK

# 2. JavaScript loading
curl -I https://auth-app.com/src/js/app.js
# Expected: 200 OK

# 3. Main pages accessible
curl -I https://auth-app.com/
curl -I https://auth-app.com/register.html
curl -I https://auth-app.com/dashboard.html
```

#### **🔐 Security Checks**
```bash
# 1. HTTPS redirect
curl -I http://auth-app.com
# Expected: 301 redirect to https://

# 2. Security headers
curl -I https://auth-app.com
# Check for: X-Frame-Options, X-Content-Type-Options, etc.

# 3. CORS configuration
curl -H "Origin: https://malicious-site.com" https://api.auth-app.com/api/health
# Should reject or handle properly
```

### 📊 **Performance Checks**
```bash
# 1. Page load time
curl -w "@curl-format.txt" -o /dev/null -s https://auth-app.com

# 2. API response time
time curl https://api.auth-app.com/api/health

# 3. Database query performance
# Check MongoDB slow query logs
```

---

## 🔧 **Troubleshooting**

### ⚠️ **Problemas Comunes**

#### **Error: Cannot connect to MongoDB**
```bash
# Verificar conexión
mongosh "mongodb+srv://cluster.mongodb.net/authapp" --username user

# Verificar variables de entorno
echo $MONGODB_URI

# Check firewall/security groups
telnet cluster.mongodb.net 27017
```

#### **Error: JWT token invalid**
```bash
# Verificar JWT_SECRET
echo $JWT_SECRET

# Regenerar tokens
# Clear localStorage en frontend
localStorage.clear()
```

#### **Error: CORS issues**
```bash
# Verificar CORS_ORIGIN
echo $CORS_ORIGIN

# Check browser console for CORS errors
# Verify nginx/proxy configuration
```

### 🆘 **Rollback Procedure**
```bash
#!/bin/bash
# rollback.sh

echo "🔄 Iniciando rollback..."

# 1. Get last successful deployment
LAST_BACKUP=$(ls -t /var/backups/auth-app-* | head -1)

# 2. Stop current services
pm2 stop auth-app-production

# 3. Restore backup
sudo rm -rf /var/www/auth-app
sudo cp -r $LAST_BACKUP /var/www/auth-app

# 4. Restart services
pm2 start auth-app-production

# 5. Verify
curl -f https://auth-app.com/api/health

echo "✅ Rollback completado!"
```

---

## 📊 **Monitoring y Logs**

### 📈 **Health Monitoring**
```bash
# Setup basic monitoring
curl -X POST "https://api.uptimerobot.com/v2/newMonitor" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "api_key=YOUR_API_KEY&format=json&type=1&url=https://auth-app.com&friendly_name=Auth App"
```

### 📋 **Log Locations**
```
Production Logs:
├── /var/log/auth-app/production.log    # Application logs
├── /var/log/nginx/auth-app.access.log  # Nginx access logs
├── /var/log/nginx/auth-app.error.log   # Nginx error logs
├── /var/log/pm2/auth-app-out.log       # PM2 stdout
└── /var/log/pm2/auth-app-error.log     # PM2 stderr
```

---

## 🚀 **Automatización CI/CD**

### 📝 **GitHub Actions**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.KEY }}
          script: |
            cd /var/www/auth-app
            ./deploy-production.sh
```

---

## 📚 **Referencias y Recursos**

### 🔗 **Links Útiles**
- [Express.js Production Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [MongoDB Production Notes](https://docs.mongodb.com/manual/administration/production-notes/)
- [Node.js Deployment Guide](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [Nginx Configuration](https://nginx.org/en/docs/beginners_guide.html)

### 🛠️ **Herramientas Recomendadas**
- **PM2**: Process manager para Node.js
- **Docker**: Containerización
- **Nginx**: Reverse proxy y web server
- **Let's Encrypt**: SSL certificates gratuitos
- **MongoDB Atlas**: Database as a Service

---

<div align="center">

**🚀 Documentado por Franklin - QA & Documentation Specialist**

*Deployment guide para escalabilidad y confiabilidad*

</div>