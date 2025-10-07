// Load environment variables
require('dotenv').config();

module.exports = {
  // Database Configuration
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'ban_quan_ao_db',
  DB_PORT: parseInt(process.env.DB_PORT) || 3306,

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_in_production_123456789',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // Server Configuration
  PORT: parseInt(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // CORS Configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',

  // Email Configuration
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT) || 587,
  EMAIL_USER: process.env.EMAIL_USER || 'your_email@gmail.com',
  EMAIL_PASS: process.env.EMAIL_PASS || 'your_app_password',
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@fashionstore.com',

  // Security Configuration
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS) || 10,
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
};
