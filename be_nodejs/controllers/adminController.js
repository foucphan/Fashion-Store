const { pool } = require('../config/database');

class AdminController {
  // Lấy thống kê tổng quan
  async getStats(req, res) {
    try {
      // Tổng số sản phẩm
      const [productsCount] = await pool.execute(
        'SELECT COUNT(*) as total FROM products WHERE status = "active"'
      );

      // Tổng số đơn hàng
      const [ordersCount] = await pool.execute(
        'SELECT COUNT(*) as total FROM orders'
      );

      // Tổng số người dùng
      const [usersCount] = await pool.execute(
        'SELECT COUNT(*) as total FROM users WHERE role = "user"'
      );

      // Tổng doanh thu (từ các đơn hàng đã hoàn thành)
      const [revenueResult] = await pool.execute(
        `SELECT COALESCE(SUM(final_amount), 0) as total 
         FROM orders 
         WHERE order_status = 'completed' AND payment_status = 'paid'`
      );

      res.json({
        success: true,
        data: {
          totalProducts: productsCount[0].total,
          totalOrders: ordersCount[0].total,
          totalUsers: usersCount[0].total,
          totalRevenue: parseFloat(revenueResult[0].total) || 0,
        }
      });
    } catch (error) {
      console.error('Get admin stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Lấy tất cả đơn hàng (admin)
  async getAllOrders(req, res) {
    try {
      const { page = 1, limit = 20, status, payment_status } = req.query;
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.max(1, parseInt(limit) || 20);
      const offset = (pageNum - 1) * limitNum;

      let whereConditions = [];
      let params = [];

      if (status) {
        whereConditions.push('o.order_status = ?');
        params.push(status);
      }

      if (payment_status) {
        whereConditions.push('o.payment_status = ?');
        params.push(payment_status);
      }

      const whereClause = whereConditions.length > 0 
        ? 'WHERE ' + whereConditions.join(' AND ')
        : '';

      const [orders] = await pool.execute(`
        SELECT 
          o.id,
          o.order_code,
          o.user_id,
          o.order_status,
          o.total_amount,
          o.shipping_fee,
          o.discount_amount,
          o.final_amount,
          o.payment_method,
          o.payment_status,
          o.created_at,
          o.updated_at,
          u.full_name as user_name,
          u.email as user_email,
          ua.full_name as shipping_name,
          ua.phone as shipping_phone,
          ua.address as shipping_address,
          COUNT(oi.id) as item_count
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        LEFT JOIN user_addresses ua ON o.user_address_id = ua.id
        LEFT JOIN order_items oi ON o.id = oi.order_id
        ${whereClause}
        GROUP BY o.id
        ORDER BY o.created_at DESC
        LIMIT ${limitNum} OFFSET ${offset}
      `, params);

      const [totalCount] = await pool.execute(`
        SELECT COUNT(DISTINCT o.id) as total
        FROM orders o
        ${whereClause}
      `, params);

      res.json({
        success: true,
        data: {
          orders: orders.map(order => ({
            id: order.id,
            order_code: order.order_code,
            user_id: order.user_id,
            user_name: order.user_name,
            user_email: order.user_email,
            order_status: order.order_status,
            total_amount: parseFloat(order.total_amount),
            shipping_fee: parseFloat(order.shipping_fee),
            discount_amount: parseFloat(order.discount_amount),
            final_amount: parseFloat(order.final_amount),
            payment_method: order.payment_method,
            payment_status: order.payment_status,
            shipping_name: order.shipping_name,
            shipping_phone: order.shipping_phone,
            shipping_address: order.shipping_address,
            item_count: order.item_count,
            created_at: order.created_at,
            updated_at: order.updated_at
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
      console.error('Get all orders error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Cập nhật trạng thái đơn hàng (admin)
  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['pending', 'confirmed', 'processing', 'shipping', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Trạng thái không hợp lệ'
        });
      }

      await pool.execute(
        'UPDATE orders SET order_status = ?, updated_at = NOW() WHERE id = ?',
        [status, id]
      );

      res.json({
        success: true,
        message: 'Cập nhật trạng thái đơn hàng thành công'
      });
    } catch (error) {
      console.error('Update order status error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Cập nhật trạng thái thanh toán (admin)
  async updatePaymentStatus(req, res) {
    try {
      const { id } = req.params;
      const { payment_status } = req.body;

      const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
      if (!validPaymentStatuses.includes(payment_status)) {
        return res.status(400).json({
          success: false,
          message: 'Trạng thái thanh toán không hợp lệ'
        });
      }

      await pool.execute(
        'UPDATE orders SET payment_status = ?, updated_at = NOW() WHERE id = ?',
        [payment_status, id]
      );

      res.json({
        success: true,
        message: 'Cập nhật trạng thái thanh toán thành công'
      });
    } catch (error) {
      console.error('Update payment status error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Lấy tất cả người dùng (admin)
  async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 20, role, is_active } = req.query;
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.max(1, parseInt(limit) || 20);
      const offset = (pageNum - 1) * limitNum;

      let whereConditions = [];
      let params = [];

      if (role) {
        whereConditions.push('role = ?');
        params.push(role);
      }

      if (is_active !== undefined) {
        whereConditions.push('is_active = ?');
        params.push(is_active === 'true');
      }

      const whereClause = whereConditions.length > 0 
        ? 'WHERE ' + whereConditions.join(' AND ')
        : '';

      const [users] = await pool.execute(`
        SELECT 
          id,
          username,
          email,
          full_name,
          phone,
          avatar,
          role,
          is_active,
          email_verified,
          created_at,
          updated_at
        FROM users
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT ${limitNum} OFFSET ${offset}
      `, params);

      const [totalCount] = await pool.execute(`
        SELECT COUNT(*) as total
        FROM users
        ${whereClause}
      `, params);

      res.json({
        success: true,
        data: {
          users: users.map(user => ({
            ...user,
            password: undefined // Không trả về password
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
      console.error('Get all users error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Lấy chi tiết người dùng (admin)
  async getUserById(req, res) {
    try {
      const { id } = req.params;

      const [users] = await pool.execute(
        'SELECT id, username, email, full_name, phone, avatar, role, is_active, email_verified, created_at, updated_at FROM users WHERE id = ?',
        [id]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy người dùng'
        });
      }

      res.json({
        success: true,
        data: users[0]
      });
    } catch (error) {
      console.error('Get user by id error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Cập nhật người dùng (admin)
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { full_name, phone, role, is_active, email_verified } = req.body;

      // Kiểm tra user có tồn tại không
      const [users] = await pool.execute('SELECT id FROM users WHERE id = ?', [id]);
      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy người dùng'
        });
      }

      const updateFields = [];
      const updateValues = [];

      if (full_name !== undefined) {
        updateFields.push('full_name = ?');
        updateValues.push(full_name);
      }

      if (phone !== undefined) {
        updateFields.push('phone = ?');
        updateValues.push(phone);
      }

      if (role !== undefined) {
        updateFields.push('role = ?');
        updateValues.push(role);
      }

      if (is_active !== undefined) {
        updateFields.push('is_active = ?');
        updateValues.push(is_active);
      }

      if (email_verified !== undefined) {
        updateFields.push('email_verified = ?');
        updateValues.push(email_verified);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Không có dữ liệu để cập nhật'
        });
      }

      updateFields.push('updated_at = NOW()');
      updateValues.push(id);

      await pool.execute(
        `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );

      res.json({
        success: true,
        message: 'Cập nhật người dùng thành công'
      });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Xóa người dùng (admin)
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      // Không cho phép xóa chính mình
      if (parseInt(id) === req.user.id) {
        return res.status(400).json({
          success: false,
          message: 'Không thể xóa chính mình'
        });
      }

      // Kiểm tra user có tồn tại không
      const [users] = await pool.execute('SELECT id FROM users WHERE id = ?', [id]);
      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy người dùng'
        });
      }

      // Soft delete: set is_active = false thay vì xóa
      await pool.execute(
        'UPDATE users SET is_active = false, updated_at = NOW() WHERE id = ?',
        [id]
      );

      res.json({
        success: true,
        message: 'Xóa người dùng thành công'
      });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }
}

module.exports = new AdminController();

