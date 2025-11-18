const { pool } = require('../config/database');

class NotificationController {
  // Helper để parse JSON an toàn
  safeParseJSON(value) {
    if (value === null || value === undefined) return null;
    if (typeof value === 'object') return value;
    try {
      return JSON.parse(value);
    } catch (error) {
      console.warn('⚠️  Invalid notification data JSON, returning raw value:', value);
      return value;
    }
  }

  // Lấy tất cả thông báo (Admin)
  async getAllNotifications(req, res) {
    try {
      const { page = 1, limit = 50, user_id, type, is_read } = req.query;
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.max(1, parseInt(limit) || 50);
      const offset = (pageNum - 1) * limitNum;

      let whereConditions = [];
      let params = [];

      if (user_id) {
        whereConditions.push('n.user_id = ?');
        params.push(user_id);
      }

      if (type) {
        whereConditions.push('n.type = ?');
        params.push(type);
      }

      if (is_read !== undefined) {
        whereConditions.push('n.is_read = ?');
        params.push(is_read === 'true');
      }

      const whereClause = whereConditions.length > 0 
        ? 'WHERE ' + whereConditions.join(' AND ')
        : '';

      const [notifications] = await pool.execute(`
        SELECT 
          n.id,
          n.user_id,
          n.title,
          n.message,
          n.type,
          n.is_read,
          n.data,
          n.created_at,
          u.email as user_email,
          u.full_name as user_name
        FROM notifications n
        LEFT JOIN users u ON n.user_id = u.id
        ${whereClause}
        ORDER BY n.created_at DESC
        LIMIT ${limitNum} OFFSET ${offset}
      `, params);

      const [totalCount] = await pool.execute(`
        SELECT COUNT(*) as total
        FROM notifications n
        ${whereClause}
      `, params);

      res.json({
        success: true,
        data: {
          notifications: notifications.map(notif => ({
            id: notif.id,
            user_id: notif.user_id,
            user_email: notif.user_email,
            user_name: notif.user_name,
            title: notif.title,
            message: notif.message,
            type: notif.type,
            is_read: notif.is_read,
            data: this.safeParseJSON(notif.data),
            created_at: notif.created_at,
          })),
          pagination: {
            page: pageNum,
            limit: limitNum,
            total: totalCount[0].total,
            pages: Math.ceil(totalCount[0].total / limitNum)
          }
        }
      });
    } catch (error) {
      console.error('Get all notifications error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Tạo thông báo mới (Admin)
  async createNotification(req, res) {
    try {
      const { user_id, title, message, type, data } = req.body;

      if (!title || !message || !type) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
        });
      }

      const validTypes = ['order', 'promotion', 'product', 'system'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          success: false,
          message: 'Loại thông báo không hợp lệ'
        });
      }

      // Nếu có user_id, kiểm tra user có tồn tại không
      if (user_id) {
        const [users] = await pool.execute('SELECT id FROM users WHERE id = ?', [user_id]);
        if (users.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'Người dùng không tồn tại'
          });
        }
      }

      const [result] = await pool.execute(
        'INSERT INTO notifications (user_id, title, message, type, data) VALUES (?, ?, ?, ?, ?)',
        [user_id || null, title, message, type, data ? JSON.stringify(data) : null]
      );

      const [newNotification] = await pool.execute('SELECT * FROM notifications WHERE id = ?', [result.insertId]);

      res.status(201).json({
        success: true,
        message: 'Tạo thông báo thành công',
        data: {
          ...newNotification[0],
          data: this.safeParseJSON(newNotification[0].data)
        }
      });
    } catch (error) {
      console.error('Create notification error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Cập nhật thông báo (Admin)
  async updateNotification(req, res) {
    try {
      const { id } = req.params;
      const { title, message, type, is_read, data } = req.body;

      // Kiểm tra thông báo có tồn tại không
      const [notifications] = await pool.execute('SELECT id FROM notifications WHERE id = ?', [id]);
      if (notifications.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Thông báo không tồn tại'
        });
      }

      const updateFields = [];
      const updateValues = [];

      if (title !== undefined) {
        updateFields.push('title = ?');
        updateValues.push(title);
      }
      if (message !== undefined) {
        updateFields.push('message = ?');
        updateValues.push(message);
      }
      if (type !== undefined) {
        const validTypes = ['order', 'promotion', 'product', 'system'];
        if (!validTypes.includes(type)) {
          return res.status(400).json({
            success: false,
            message: 'Loại thông báo không hợp lệ'
          });
        }
        updateFields.push('type = ?');
        updateValues.push(type);
      }
      if (is_read !== undefined) {
        updateFields.push('is_read = ?');
        updateValues.push(is_read);
      }
      if (data !== undefined) {
        updateFields.push('data = ?');
        updateValues.push(data ? JSON.stringify(data) : null);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Không có dữ liệu để cập nhật'
        });
      }

      updateValues.push(id);

      await pool.execute(
        `UPDATE notifications SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );

      const [updatedNotification] = await pool.execute('SELECT * FROM notifications WHERE id = ?', [id]);

      res.json({
        success: true,
        message: 'Cập nhật thông báo thành công',
        data: {
          ...updatedNotification[0],
          data: this.safeParseJSON(updatedNotification[0].data)
        }
      });
    } catch (error) {
      console.error('Update notification error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Xóa thông báo (Admin)
  async deleteNotification(req, res) {
    try {
      const { id } = req.params;

      // Kiểm tra thông báo có tồn tại không
      const [notifications] = await pool.execute('SELECT id FROM notifications WHERE id = ?', [id]);
      if (notifications.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Thông báo không tồn tại'
        });
      }

      await pool.execute('DELETE FROM notifications WHERE id = ?', [id]);

      res.json({
        success: true,
        message: 'Xóa thông báo thành công'
      });
    } catch (error) {
      console.error('Delete notification error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }
}

module.exports = new NotificationController();

