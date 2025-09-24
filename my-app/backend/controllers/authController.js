const { signup } = require('./signupController');
const { login } = require('./loginController');

// Get user profile (protected route)
const getProfile = (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
};

// Logout route (optional - mainly for client-side token removal)
const logout = (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
};

module.exports = {
  signup,
  login,
  getProfile,
  logout
};