

// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  
  username: {
  type: String,
  required: [true, 'Username is required'],
  unique: true,
  trim: true,
  lowercase: true, // <-- add this
  minlength: [3, 'Username must be at least 3 characters long'],
  maxlength: [30, 'Username cannot exceed 30 characters']
},

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  // phone: {                      // kept as `phone` to match your controller usage
  //   type: String,
  //   trim: true,
  //   match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number'],
  //   default: ''
  // },

  phone: {
  type: String,
  trim: true,
  match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number'],
  default: '',
  unique: true  // <-- add this
},
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'India' }
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    },
    defaultAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String
    }
  }
}, {
  timestamps: true
});

// ----------------- Hooks & Methods -----------------

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    return next();
  } catch (err) {
    return next(err);
  }
});

// Compare password (instance method)
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token (instance method)
userSchema.methods.generateToken = function() {
  const payload = {
    id: this._id,
    email: this.email,
    username: this.username,
    role: this.role
  };

  const secret = process.env.JWT_SECRET || 'default_jwt_secret';
  const expiresIn = process.env.JWT_EXPIRE || '7d';

  return jwt.sign(payload, secret, { expiresIn });
};

// Update last login (instance method)
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

// Static to find by username or email (for login)
userSchema.statics.findByCredentials = async function(identifier, password) {
  const user = await this.findOne({
    $or: [{ username: identifier }, { email: identifier }],
    isActive: true
  });

  if (!user) throw new Error('Invalid credentials');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error('Invalid credentials');

  return user;
};

// Remove sensitive fields from JSON output
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
