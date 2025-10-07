const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { generateToken } = require('../middleware/auth');
const config = require('../config/config');

class AuthController {
  // Đăng ký
  async register(req, res) {
    try {
      const { username, email, password, full_name, phone } = req.body;

      // Kiểm tra email đã tồn tại
      const [existingUser] = await pool.execute(
        'SELECT id FROM users WHERE email = ? OR username = ?',
        [email, username]
      );

      if (existingUser.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Email hoặc username đã tồn tại'
        });
      }

      // Mã hóa mật khẩu
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Tạo user mới
      const [result] = await pool.execute(
        'INSERT INTO users (username, email, password, full_name, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
        [username, email, hashedPassword, full_name, phone || null, 'user']
      );

      const userId = result.insertId;

      // Tạo token
      const token = generateToken({ 
        id: userId, 
        email, 
        role: 'user' 
      });

      // Lấy thông tin user
      const [newUser] = await pool.execute(
        'SELECT id, username, email, full_name, phone, role, created_at FROM users WHERE id = ?',
        [userId]
      );

      res.status(201).json({
        success: true,
        message: 'Đăng ký thành công',
        user: newUser[0],
        token
      });

    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Đăng nhập
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Tìm user
      const [users] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Email hoặc mật khẩu không đúng'
        });
      }

      const user = users[0];

      // Kiểm tra mật khẩu
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Email hoặc mật khẩu không đúng'
        });
      }

      // Kiểm tra tài khoản có bị khóa không
      if (!user.is_active) {
        return res.status(401).json({
          success: false,
          message: 'Tài khoản đã bị khóa'
        });
      }

      // Tạo token
      const token = generateToken({ 
        id: user.id, 
        email: user.email, 
        role: user.role 
      });

      // Xóa password khỏi response
      delete user.password;

      res.json({
        success: true,
        message: 'Đăng nhập thành công',
        user,
        token
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Lấy thông tin user hiện tại
  async getCurrentUser(req, res) {
    try {
      const userId = req.user.id;

      const [users] = await pool.execute(
        'SELECT id, username, email, full_name, phone, avatar, role, is_active, email_verified, created_at FROM users WHERE id = ?',
        [userId]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User không tồn tại'
        });
      }

      res.json({
        success: true,
        user: users[0]
      });

    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Quên mật khẩu
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      // Kiểm tra email có tồn tại không
      const [users] = await pool.execute(
        'SELECT id, email FROM users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Email không tồn tại'
        });
      }

      // Tạo reset token (trong thực tế sẽ gửi email)
      const resetToken = generateToken({ 
        id: users[0].id, 
        email: users[0].email,
        type: 'password_reset'
      });

      // TODO: Gửi email với reset token
      console.log(`Reset token for ${email}: ${resetToken}`);

      res.json({
        success: true,
        message: 'Email khôi phục mật khẩu đã được gửi',
        // Trong development, trả về token để test
        resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
      });

    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Đặt lại mật khẩu
  async resetPassword(req, res) {
    try {
      const { token, password } = req.body;

      // Verify token
      const decoded = jwt.verify(token, config.JWT_SECRET);
      
      if (decoded.type !== 'password_reset') {
        return res.status(400).json({
          success: false,
          message: 'Token không hợp lệ'
        });
      }

      // Mã hóa mật khẩu mới
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Cập nhật mật khẩu
      await pool.execute(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, decoded.id]
      );

      res.json({
        success: true,
        message: 'Mật khẩu đã được đặt lại thành công'
      });

    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn'
      });
    }
  }
}

module.exports = new AuthController();