const express = require('express');
const router = express.Router();

// Import controllers and middleware
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT token
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @route   GET /api/auth/dashboard
 * @desc    Get dashboard data for authenticated user
 * @access  Private
 */
router.get('/dashboard', authMiddleware, authController.getDashboard);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile,
        preferences: user.preferences,
        status: user.status,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('❌ Profile fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const User = require('../models/User');
    const { firstName, lastName, email, preferences } = req.body;
    
    const updateData = {};
    
    if (firstName !== undefined) updateData['profile.firstName'] = firstName;
    if (lastName !== undefined) updateData['profile.lastName'] = lastName;
    if (email !== undefined) updateData.email = email;
    if (preferences !== undefined) updateData.preferences = preferences;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('❌ Profile update error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
router.post('/logout', authMiddleware, (req, res) => {
  // In a stateless JWT setup, logout is handled client-side
  // You could implement token blacklisting here if needed
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;