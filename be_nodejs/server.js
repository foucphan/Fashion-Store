const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');
const config = require('./config/config');
const emailService = require('./utils/emailService');

const app = express();

// Middleware
app.use(cors({
  origin: config.CORS_ORIGIN, // Frontend URL from config
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url}`);
  console.log('📡 Headers:', req.headers);
  next();
});

// Serve static files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/categories', require('./routes/category'));
app.use('/api/brands', require('./routes/brand'));
app.use('/api/products', require('./routes/product'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/orders', require('./routes/order'));
app.use('/api/vnpay', require('./routes/vnpay'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler (Express 5): remove wildcard path, use default handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
const PORT = config.PORT;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: http://localhost:5173`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);
  
  // Test database connection
  await testConnection();
  
  // Test email service connection
  console.log('📧 Testing email service...');
  const emailConnected = await emailService.verifyConnection();
  if (emailConnected) {
    console.log('✅ Email service is ready');
  } else {
    console.log('❌ Email service connection failed - check EMAIL_USER and EMAIL_PASS in .env');
  }
});

module.exports = app;

