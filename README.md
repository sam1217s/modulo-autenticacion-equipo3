# 🔒 Auth App Backend

Backend API for user authentication system built with Node.js, Express, MongoDB, and JWT.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start the server**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📁 Project Structure

```
src/
├── controllers/     # Request handlers
├── middleware/      # Custom middleware
├── models/         # Database models
├── routes/         # API routes
└── server.js       # Main server file
```

## 🔑 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `4000` |
| `MONGO_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRES_IN` | Token expiration time | `7d` |
| `BCRYPT_ROUNDS` | Password hashing rounds | `12` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

## 📚 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/register` | Register new user | ❌ |
| `POST` | `/login` | Login user | ❌ |
| `GET` | `/dashboard` | Get dashboard data | ✅ |
| `GET` | `/me` | Get user profile | ✅ |
| `PUT` | `/profile` | Update user profile | ✅ |
| `POST` | `/logout` | Logout user | ✅ |

### Example Requests

**Register User**
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "johndoe", "password": "securepass123"}'
```

**Login User**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "johndoe", "password": "securepass123"}'
```

**Access Protected Route**
```bash
curl -X GET http://localhost:4000/api/auth/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint

### Code Style

- Use ES6+ features
- Follow REST API conventions
- Implement proper error handling
- Add input validation
- Use meaningful variable names

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- CORS protection
- Error handling without sensitive data exposure

## 🧪 Testing

```bash
npm test
```

## 📝 Contributing

1. Create feature branch from `backend-dev`
2. Make changes following code style
3. Test your changes
4. Submit pull request to `backend-dev`

## 👥 Team

- **Desarrollador Backend 1**: Authentication & User Management
- **Desarrollador Backend 2**: API Routes & Database Integration

## 📄 License

MIT License
