const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');
const config = require('./config/config');

const app = express();

// Middleware
app.use(cors({
  origin: config.CORS_ORIGIN, // Frontend URL from config
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));

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
});

module.exports = app;
