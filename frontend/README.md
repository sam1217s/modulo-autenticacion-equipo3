# 🎨 Auth App Frontend

Modern, responsive frontend for the authentication system built with vanilla HTML, CSS, and JavaScript.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher) - for development tools
- Modern web browser
- Backend API running (see backend README)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd frontend
```

2. **Install development dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── css/              # Stylesheets
│   ├── auth.css      # Authentication pages styles
│   └── dashboard.css # Dashboard styles
├── js/               # JavaScript modules
│   ├── config.js     # Application configuration
│   ├── utils.js      # Utility functions
│   ├── auth.js       # Authentication logic
│   ├── dashboard.js  # Dashboard functionality
│   └── app.js        # Main application entry point
└── assets/           # Static assets
    └── favicon.svg   # Application favicon

Pages:
├── index.html        # Login page
├── register.html     # Registration page
└── dashboard.html    # Dashboard page
```

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with live reload |
| `npm start` | Serve production build |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

## 🎨 Features

### Authentication
- ✅ User login with validation
- ✅ User registration with real-time validation
- ✅ Password strength indicator
- ✅ Remember me functionality
- ✅ JWT token management
- ✅ Auto-redirect based on auth state

### Dashboard
- ✅ Responsive dashboard layout
- ✅ Real-time data display
- ✅ Interactive navigation
- ✅ User profile management
- ✅ Statistics and charts
- ✅ Mobile-friendly sidebar

### UI/UX
- ✅ Modern glassmorphism design
- ✅ Smooth animations and transitions
- ✅ Loading states and feedback
- ✅ Responsive design (mobile-first)
- ✅ Accessibility features
- ✅ Dark/light theme support

## 🔒 Security Features

- Client-side input validation
- Secure token storage
- XSS protection
- CSRF protection via JWT
- Secure password handling
- Auto-logout on token expiration

## 📱 Responsive Design

The application is fully responsive and works on:
- 📱 Mobile devices (320px+)
- 📟 Tablets (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1440px+)

## 🎯 Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

## 🔧 Configuration

### API Configuration
Edit `src/js/config.js` to configure the backend API:

```javascript
const API_CONFIG = {
  BASE_URL: 'http://localhost:4000', // Backend URL
  ENDPOINTS: {
    AUTH: '/api/auth',
    HEALTH: '/api/health'
  }
};
```

### Theme Configuration
Customize colors and themes in `src/js/config.js`:

```javascript
const THEME_CONFIG = {
  LIGHT: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    // ... more colors
  },
  DARK: {
    // Dark theme colors
  }
};
```

## 🧪 Development

### File Organization
- **config.js**: Central configuration management
- **utils.js**: Reusable utility functions
- **auth.js**: Authentication logic and API calls
- **dashboard.js**: Dashboard-specific functionality
- **app.js**: Main application coordinator

### Code Style
- Use ES6+ features
- Follow consistent naming conventions
- Comment complex functions
- Use meaningful variable names
- Implement error handling

### CSS Architecture
- CSS Custom Properties for theming
- Mobile-first responsive design
- BEM methodology for class naming
- Modular CSS organization

## 🔄 State Management

The application uses a simple state management pattern:

```javascript
// Global state managers
window.Auth     // Authentication state
window.Utils    // Utility functions
window.App      // Main application instance
window.Dashboard // Dashboard manager (dashboard page only)
```

## 📊 Performance

### Optimization Features
- Lazy loading for images
- Debounced search and input validation
- Throttled scroll and resize events
- Minimal JavaScript bundle
- Optimized CSS with custom properties

### Loading Performance
- Critical CSS inlined
- Non-blocking JavaScript loading
- Preconnect hints for external resources
- Optimized images

## 🧪 Testing

### Manual Testing Checklist
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Register new user
- [ ] Password strength validation
- [ ] Remember me functionality
- [ ] Logout functionality
- [ ] Dashboard data loading
- [ ] Responsive design on different screen sizes
- [ ] Browser back/forward navigation
- [ ] Error handling

### Browser Testing
Test the application in all supported browsers and check:
- UI consistency
- JavaScript functionality
- CSS animations
- Responsive layout

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Static Hosting
The built application can be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Firebase Hosting

### Environment Configuration
Set the production API URL in the build process or use environment variables.

## 🐛 Troubleshooting

### Common Issues

**CORS Errors**
- Ensure backend CORS is configured for your domain
- Check API URL in config.js

**Login Not Working**
- Verify backend is running
- Check network tab for API calls
- Verify JWT token storage

**Styling Issues**
- Clear browser cache
- Check CSS file paths
- Verify browser support

### Debug Mode
Enable debug mode by setting `ENABLE_DEBUG_MODE: true` in config.js.
Access debug tools via `window.devMode` in browser console.

## 📝 Contributing

1. Create feature branch from `frontend-dev`
2. Follow code style guidelines
3. Test on multiple browsers and devices
4. Submit pull request to `frontend-dev`

## 👤 Team

- **Frontend Developer**: UI/UX, Responsive Design, JavaScript functionality

## 📄 License

MIT License

## 🔗 Related

- [Backend Repository](../backend/README.md)
- [API Documentation](../backend/README.md#api-endpoints)
- [Design System](./docs/design-system.md)