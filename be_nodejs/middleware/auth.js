const jwt = require('jsonwebtoken');
const config = require('../config/config');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  console.log('🔐 Auth Middleware - Request URL:', req.url);
  console.log('🔐 Auth Middleware - Authorization header:', authHeader);
  console.log('🔐 Auth Middleware - Extracted token:', token ? `${token.substring(0, 20)}...` : 'null');
  console.log('🔐 Auth Middleware - Request method:', req.method);
  console.log('🔐 Auth Middleware - Request body:', req.body);

  if (!token) {
    console.log('❌ Auth Middleware - No token found');
    return res.status(401).json({ 
      success: false, 
      message: 'Access token is required' 
    });
  }

  jwt.verify(token, config.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('❌ Auth Middleware - Token verification failed:', err.message);
      console.log('❌ Auth Middleware - Error type:', err.name);
      console.log('❌ Auth Middleware - Token expired at:', err.expiredAt);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired token',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
    console.log('✅ Auth Middleware - Token verified successfully, user:', user);
    req.user = user;
    next();
  });
};

const generateToken = (payload) => {
  return jwt.sign(payload, config.JWT_SECRET, { 
    expiresIn: config.JWT_EXPIRES_IN 
  });
};

const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  next();
};

module.exports = {
  authenticateToken,
  generateToken,
  requireAdmin
};

