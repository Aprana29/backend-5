

const User = require('../models/User');

const signup = async (req, res) => {
  try {
    const { name, username, email, phone, password } = req.body;

    // Normalize inputs
    const finalUsername = (username || name).toLowerCase().trim();
    const finalName = (name || username).trim();
    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = phone.replace(/[^\d]/g, ''); // only digits

    // Validation - all required fields
    if (!finalUsername || !cleanEmail || !cleanPhone || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields (name/username, email, phone, password) are required'
      });
    }

    // Additional validations
    if (finalName.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters long'
      });
    }

    if (finalUsername.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Username must be at least 3 characters long'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Email format validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Phone validation
    if (cleanPhone.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Phone number must be at least 10 digits'
      });
    }

    // Check if user already exists by email, username, or phone
    const existingUser = await User.findOne({
      $or: [
        { email: cleanEmail },
        { username: finalUsername },
        { phone: cleanPhone }
      ]
    });

    if (existingUser) {
      let field = 'user';
      if (existingUser.email === cleanEmail) field = 'email';
      else if (existingUser.username === finalUsername) field = 'username';
      else if (existingUser.phone === cleanPhone) field = 'phone number';

      return res.status(409).json({
        success: false,
        message: `User with this ${field} already exists`
      });
    }

    // Create new user
    const user = new User({
      username: finalUsername,
      name: finalName,
      email: cleanEmail,
      phone: cleanPhone,
      password // hashed by pre-save hook in User model
    });

    // Save user
    await user.save();

    // Generate token
    const token = user.generateToken();

    // Prepare user data for response
    const userData = {
      id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt
    };

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: userData
    });

  } catch (error) {
    console.error('Signup error:', error);

    // Mongoose validation error
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: errors[0]
      });
    }

    // Duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const fieldName = field === 'username' ? 'username' :
                        field === 'email' ? 'email' :
                        field === 'phone' ? 'phone number' : field;
      return res.status(409).json({
        success: false,
        message: `User with this ${fieldName} already exists`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
};

module.exports = { signup };
