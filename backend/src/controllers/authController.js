const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Utility function to generate JWT
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, 
    process.env.JWT_SECRET || 'default_secret_key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Utility function to validate input
const validateInput = (username, password) => {
  const errors = [];
  
  if (!username || username.trim().length < 3) {
    errors.push('Username must be at least 3 characters long');
  }
  
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  return errors;
};

/**
 * Register new user
 * @route POST /api/auth/register
 */
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    const validationErrors = validateInput(username, password);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: validationErrors 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      username: username.trim().toLowerCase() 
    });
    
    if (existingUser) {
      return res.status(409).json({ 
        error: 'Username already exists' 
      });
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create new user
    const newUser = new User({ 
      username: username.trim().toLowerCase(), 
      password: hashedPassword 
    });
    
    await newUser.save();
    
    console.log(`✅ New user registered: ${username}`);
    
    res.status(201).json({ 
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        username: newUser.username
      }
    });
    
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ 
      error: 'Internal server error during registration' 
    });
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Username and password are required' 
      });
    }

    // Find user
    const user = await User.findOne({ 
      username: username.trim().toLowerCase() 
    });
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    // Generate token
    const token = generateToken(user._id);
    
    console.log(`✅ User logged in: ${username}`);
    
    res.status(200).json({ 
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username
      }
    });
    
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error during login' 
    });
  }
};

/**
 * Get dashboard data for authenticated user
 * @route GET /api/auth/dashboard
 */
exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    // Mock dashboard data - replace with real data from your database
    const dashboardData = {
      user: {
        id: user._id,
        name: user.username,
        avatar: `https://ui-avatars.com/api/?name=${user.username}&background=6366f1&color=fff&size=128`
      },
      earnings: {
        amount: Math.floor(Math.random() * 10000) + 5000,
        change: '+10% desde el mes pasado',
        trend: 'up'
      },
      rank: {
        position: Math.floor(Math.random() * 100) + 1,
        description: 'en top 100'
      },
      projects: {
        total: Math.floor(Math.random() * 50) + 10,
        pending: 'mobile app',
        completed: 'branding'
      },
      recentInvoices: [
        {
          client: 'Alexander Williams',
          company: 'AX creations',
          amount: 1200.87,
          status: 'Paid',
          avatar: 'https://ui-avatars.com/api/?name=Alexander+Williams&background=10b981&color=fff'
        },
        {
          client: 'John Phillips',
          company: 'design studio',
          amount: 12989.88,
          status: 'Late',
          avatar: 'https://ui-avatars.com/api/?name=John+Phillips&background=ef4444&color=fff'
        }
      ],
      yourProjects: [
        {
          title: 'Logo design for Bakery',
          daysRemaining: 3,
          avatar: 'https://ui-avatars.com/api/?name=Bakery&background=f59e0b&color=fff'
        },
        {
          title: 'Personal branding project',
          daysRemaining: 5,
          avatar: 'https://ui-avatars.com/api/?name=Branding&background=8b5cf6&color=fff'
        }
      ],
      recommendedProject: {
        client: 'Thomas Martin',
        company: 'Upside Designs',
        title: 'Need a designer to form branding essentials for my business.',
        description: 'Looking for a talented brand designer to create all the branding materials for my new bakery.',
        budget: 8700,
        status: 'Design',
        avatar: 'https://ui-avatars.com/api/?name=Thomas+Martin&background=6366f1&color=fff'
      }
    };
    
    res.status(200).json(dashboardData);
    
  } catch (error) {
    console.error('❌ Dashboard error:', error);
    res.status(500).json({ 
      error: 'Internal server error while fetching dashboard data' 
    });
  }
};