const jwt = require('jsonwebtoken');

module.exports = {
  // Generate JWT token
  generateToken: (payload) => {
    return jwt.sign(
      payload, 
      process.env.JWT_SECRET || 'default_secret', 
      { expiresIn: '1h' }
    );
  },

  // Verify JWT token
  verifyToken: (token) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    } catch (error) {
      return null;
    }
  }
};