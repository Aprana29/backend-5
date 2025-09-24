
const User = require('../models/User');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    console.log(`Login attempt for email: ${email}`); // Debug log

    // Find user by email (case insensitive)
    const user = await User.findOne({ 
      email: email.toLowerCase().trim(),
      isActive: true 
    });

    if (!user) {
      console.log(`User not found: ${email}`); // Debug log
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log(`Invalid password for user: ${email}`); // Debug log
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login in database
    try {
      await User.findByIdAndUpdate(user._id, {
        lastLogin: new Date()
      });
      console.log(`Updated lastLogin for user: ${user.email}`); // Debug log
    } catch (updateError) {
      console.warn('Failed to update lastLogin:', updateError.message);
      // Don't fail the login for this
    }

    // Generate JWT token
    const token = user.generateToken();

    // Prepare user data for frontend (consistent with what frontend expects)
    const userData = {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      address: user.address || {},
      isActive: user.isActive,
      createdAt: user.createdAt,
      lastLogin: new Date() // Use current time since we just updated it
    };

    console.log(`Successful login for user: ${user.email}, name: ${user.name}`); // Debug log

    // Send response with consistent data structure
    res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      user: userData,
      token: token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = { login };

// ============================================================================
