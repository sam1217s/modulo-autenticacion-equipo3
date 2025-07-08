const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username must be less than 30 characters'],
    match: [/^[a-zA-Z0-9._]+$/, 'Username can only contain letters, numbers, dots and underscores']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  email: {
    type: String,
    sparse: true, // Allows multiple null values
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  profile: {
    firstName: {
      type: String,
      trim: true,
      maxlength: [50, 'First name must be less than 50 characters']
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: [50, 'Last name must be less than 50 characters']
    },
    avatar: {
      type: String,
      default: function() {
        return `https://ui-avatars.com/api/?name=${this.username}&background=6366f1&color=fff&size=128`;
      }
    }
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    },
    language: {
      type: String,
      enum: ['es', 'en'],
      default: 'es'
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { 
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for better performance
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  if (this.profile.firstName && this.profile.lastName) {
    return `${this.profile.firstName} ${this.profile.lastName}`;
  }
  return this.username;
});

// Instance method to update last login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

// Static method to find active users
userSchema.statics.findActive = function() {
  return this.find({ status: 'active' });
};

// Pre-save middleware
userSchema.pre('save', function(next) {
  // Set default avatar if not provided
  if (!this.profile.avatar) {
    this.profile.avatar = `https://ui-avatars.com/api/?name=${this.username}&background=6366f1&color=fff&size=128`;
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;