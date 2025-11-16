const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
  deleteAvatar,
  sendVerificationEmail,
  verifyEmail,
  deleteAccount,
  upload,
} = require('../controllers/profileController');

// Tất cả routes đều cần authentication
router.use(authenticateToken);

// GET /api/profile - Lấy thông tin profile
router.get('/', getProfile);

// PUT /api/profile - Cập nhật thông tin profile
router.put('/', updateProfile);

// PUT /api/profile/password - Đổi mật khẩu
router.put('/password', changePassword);

// POST /api/profile/avatar - Upload avatar
router.post('/avatar', upload.single('avatar'), uploadAvatar);

// DELETE /api/profile/avatar - Xóa avatar
router.delete('/avatar', deleteAvatar);

// POST /api/profile/send-verification - Gửi email xác thực
router.post('/send-verification', sendVerificationEmail);

// POST /api/profile/verify-email - Xác thực email
router.post('/verify-email', verifyEmail);

// DELETE /api/profile - Xóa tài khoản
router.delete('/', deleteAccount);

module.exports = router;
