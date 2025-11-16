const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for avatar upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/avatars';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `avatar-${req.user.id}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Lấy thông tin profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Lấy thông tin user
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = users[0];

    // Lấy địa chỉ mặc định của user
    const [addresses] = await pool.execute(
      'SELECT * FROM user_addresses WHERE user_id = ? AND is_default = TRUE LIMIT 1',
      [userId]
    );

    // Lấy lịch sử đơn hàng gần nhất
    const [orders] = await pool.execute(
      `SELECT o.*, oi.product_name, oi.quantity, oi.price 
       FROM orders o 
       LEFT JOIN order_items oi ON o.id = oi.order_id 
       WHERE o.user_id = ? 
       ORDER BY o.created_at DESC 
       LIMIT 5`,
      [userId]
    );
    
    // Format response - map database fields to frontend expected fields
    const defaultAddress = addresses[0];
    const profile = {
      id: user.id,
      email: user.email,
      first_name: user.full_name ? user.full_name.split(' ')[0] : '',
      last_name: user.full_name ? user.full_name.split(' ').slice(1).join(' ') : '',
      phone: user.phone,
      // Địa chỉ từ user_addresses
      address: defaultAddress ? defaultAddress.address : '',
      city: defaultAddress ? defaultAddress.province : '',
      district: defaultAddress ? defaultAddress.district : '',
      ward: defaultAddress ? defaultAddress.ward : '',
      postal_code: defaultAddress ? defaultAddress.postal_code : '',
      country: 'Vietnam', // Mặc định
      date_of_birth: '', // Không có trong schema
      gender: '', // Không có trong schema
      avatar: user.avatar,
      is_email_verified: user.email_verified,
      created_at: user.created_at,
      updated_at: user.updated_at,
      // Thêm lịch sử đơn hàng
      recent_orders: orders.map(order => ({
        id: order.id,
        order_code: order.order_code,
        status: order.order_status,
        total_amount: order.total_amount,
        product_name: order.product_name,
        quantity: order.quantity,
        price: order.price,
        created_at: order.created_at
      }))
    };

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
};

// Cập nhật thông tin profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      first_name,
      last_name,
      phone,
      address,
      city,
      district,
      ward,
      postal_code,
      country,
      date_of_birth,
      gender,
      avatar
    } = req.body;

    // Validate required fields
    if (!first_name || !last_name) {
      return res.status(400).json({
        success: false,
        message: 'Họ và tên là bắt buộc'
      });
    }

    // Update user profile - only update fields that exist in database schema
    const full_name = `${first_name} ${last_name}`.trim();
    
    await pool.execute(`
      UPDATE users SET 
        full_name = ?,
        phone = ?,
        avatar = ?,
        updated_at = NOW()
      WHERE id = ?
    `, [
      full_name,
      phone || null,
      avatar || null,
      userId
    ]);

    // Update or create user address
    if (address && city) {
      // Check if user has existing default address
      const [existingAddresses] = await pool.execute(
        'SELECT id FROM user_addresses WHERE user_id = ? AND is_default = TRUE',
        [userId]
      );

      if (existingAddresses.length > 0) {
        // Update existing address
        await pool.execute(`
          UPDATE user_addresses SET 
            full_name = ?,
            phone = ?,
            address = ?,
            ward = ?,
            district = ?,
            province = ?,
            postal_code = ?,
            updated_at = NOW()
          WHERE user_id = ? AND is_default = TRUE
        `, [
          full_name,
          phone || '',
          address,
          ward || '',
          district || '',
          city,
          postal_code || '',
          userId
        ]);
      } else {
        // Create new default address
        await pool.execute(`
          INSERT INTO user_addresses (
            user_id, full_name, phone, address, ward, district, province, postal_code, is_default
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          userId,
          full_name,
          phone || '',
          address,
          ward || '',
          district || '',
          city,
          postal_code || '',
          true
        ]);
      }
    }

    // Get updated profile with address and orders
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    const user = users[0];

    // Get updated address
    const [addresses] = await pool.execute(
      'SELECT * FROM user_addresses WHERE user_id = ? AND is_default = TRUE LIMIT 1',
      [userId]
    );

    // Get recent orders
    const [orders] = await pool.execute(
      `SELECT o.*, oi.product_name, oi.quantity, oi.price 
       FROM orders o 
       LEFT JOIN order_items oi ON o.id = oi.order_id 
       WHERE o.user_id = ? 
       ORDER BY o.created_at DESC 
       LIMIT 5`,
      [userId]
    );

    const defaultAddress = addresses[0];
    const profile = {
      id: user.id,
      email: user.email,
      first_name: user.full_name ? user.full_name.split(' ')[0] : '',
      last_name: user.full_name ? user.full_name.split(' ').slice(1).join(' ') : '',
      phone: user.phone,
      address: defaultAddress ? defaultAddress.address : '',
      city: defaultAddress ? defaultAddress.province : '',
      district: defaultAddress ? defaultAddress.district : '',
      ward: defaultAddress ? defaultAddress.ward : '',
      postal_code: defaultAddress ? defaultAddress.postal_code : '',
      country: 'Vietnam',
      date_of_birth: '',
      gender: '',
      avatar: user.avatar,
      is_email_verified: user.email_verified,
      created_at: user.created_at,
      updated_at: user.updated_at,
      recent_orders: orders.map(order => ({
        id: order.id,
        order_code: order.order_code,
        status: order.order_status,
        total_amount: order.total_amount,
        product_name: order.product_name,
        quantity: order.quantity,
        price: order.price,
        created_at: order.created_at
      }))
    };

    res.json({
      success: true,
      data: profile,
      message: 'Cập nhật thông tin thành công'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
};

// Đổi mật khẩu
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { current_password, new_password, confirm_password } = req.body;

    // Validate input
    if (!current_password || !new_password || !confirm_password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin'
      });
    }

    if (new_password !== confirm_password) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu xác nhận không khớp'
      });
    }

    if (new_password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự'
      });
    }

    // Get current user
    const [users] = await pool.execute(
      'SELECT password FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(current_password, users[0].password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu hiện tại không đúng'
      });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(new_password, saltRounds);

    // Update password
    await pool.execute(
      'UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?',
      [hashedNewPassword, userId]
    );

    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
};

// Upload avatar
const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Không có file được tải lên'
      });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    // Update user avatar
    await pool.execute(
      'UPDATE users SET avatar = ?, updated_at = NOW() WHERE id = ?',
      [avatarUrl, userId]
    );

    res.json({
      success: true,
      data: {
        avatar_url: avatarUrl
      },
      message: 'Tải lên ảnh đại diện thành công'
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
};

// Xóa avatar
const deleteAvatar = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get current avatar
    const [users] = await pool.execute(
      'SELECT avatar FROM users WHERE id = ?',
      [userId]
    );

    if (users.length > 0 && users[0].avatar) {
      // Delete file from filesystem
      const avatarPath = path.join(__dirname, '..', users[0].avatar);
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }

    // Update user avatar to null
    await pool.execute(
      'UPDATE users SET avatar = NULL, updated_at = NOW() WHERE id = ?',
      [userId]
    );

    res.json({
      success: true,
      message: 'Xóa ảnh đại diện thành công'
    });
  } catch (error) {
    console.error('Delete avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
};

// Gửi email xác thực
const sendVerificationEmail = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user email
    const [users] = await pool.execute(
      'SELECT email, is_email_verified FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (users[0].is_email_verified) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được xác thực'
      });
    }

    // TODO: Implement email verification logic
    // For now, just return success
    res.json({
      success: true,
      message: 'Email xác thực đã được gửi'
    });
  } catch (error) {
    console.error('Send verification email error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
};

// Xác thực email
const verifyEmail = async (req, res) => {
  try {
    const userId = req.user.id;
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token xác thực không hợp lệ'
      });
    }

    // TODO: Implement email verification logic
    // For now, just mark as verified
    await pool.execute(
      'UPDATE users SET is_email_verified = 1, updated_at = NOW() WHERE id = ?',
      [userId]
    );

    res.json({
      success: true,
      message: 'Xác thực email thành công'
    });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
};

// Xóa tài khoản
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập mật khẩu để xác nhận'
      });
    }

    // Get current user
    const [users] = await pool.execute(
      'SELECT password FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, users[0].password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu không đúng'
      });
    }

    // Delete user account
    await pool.execute('DELETE FROM users WHERE id = ?', [userId]);

    res.json({
      success: true,
      message: 'Tài khoản đã được xóa thành công'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
  deleteAvatar,
  sendVerificationEmail,
  verifyEmail,
  deleteAccount,
  upload, // Export multer upload middleware
};
