const { pool } = require('../config/database');
const XLSX = require('xlsx');

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

      // Tổng doanh thu (từ các đơn hàng đã hoàn thành và đã thanh toán)
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

  // Lấy dữ liệu doanh thu theo thời gian (cho biểu đồ)
  async getRevenueChart(req, res) {
    try {
      const { period = '30' } = req.query; // Mặc định 30 ngày gần nhất
      const days = parseInt(period) || 30;

      // Lấy doanh thu theo ngày từ các đơn hàng đã hoàn thành và đã thanh toán
      const [revenueData] = await pool.execute(`
        SELECT 
          DATE(created_at) as date,
          COALESCE(SUM(final_amount), 0) as revenue,
          COUNT(*) as order_count
        FROM orders
        WHERE order_status = 'completed' 
          AND payment_status = 'paid'
          AND created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `, [days]);

      // Tạo mảng đầy đủ các ngày (kể cả ngày không có đơn hàng)
      const result = [];
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(startDate.getDate() - days);

      // Tạo map từ dữ liệu database
      const revenueMap = {};
      revenueData.forEach(item => {
        const dateStr = new Date(item.date).toISOString().split('T')[0];
        revenueMap[dateStr] = {
          revenue: parseFloat(item.revenue) || 0,
          orderCount: item.order_count || 0
        };
      });

      // Tạo mảng đầy đủ các ngày
      for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        result.push({
          date: dateStr,
          dateLabel: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
          revenue: revenueMap[dateStr]?.revenue || 0,
          orderCount: revenueMap[dateStr]?.orderCount || 0
        });
      }

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Get revenue chart error:', error);
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

  // Báo cáo tồn kho
  async getInventoryReport(req, res) {
    try {
      const { date } = req.query; // Format: YYYY-MM-DD hoặc YYYY-MM hoặc YYYY

      let dateCondition = '';
      let params = [];

      if (date) {
        if (date.length === 4) {
          // Năm
          dateCondition = 'WHERE YEAR(pa.updated_at) = ?';
          params.push(date);
        } else if (date.length === 7) {
          // Tháng
          dateCondition = 'WHERE DATE_FORMAT(pa.updated_at, "%Y-%m") = ?';
          params.push(date);
        } else if (date.length === 10) {
          // Ngày
          dateCondition = 'WHERE DATE(pa.updated_at) = ?';
          params.push(date);
        }
      }

      const [inventory] = await pool.execute(`
        SELECT 
          p.id as product_id,
          p.name as product_name,
          p.sku as product_sku,
          pa.size,
          pa.color,
          pa.stock_quantity,
          pa.sku_variant,
          p.price,
          p.sale_price,
          pa.updated_at
        FROM product_attributes pa
        LEFT JOIN products p ON pa.product_id = p.id
        ${dateCondition}
        ORDER BY p.name ASC, pa.size ASC, pa.color ASC
      `, params);

      res.json({
        success: true,
        data: inventory.map(item => ({
          product_id: item.product_id,
          product_name: item.product_name,
          product_sku: item.product_sku,
          size: item.size || '-',
          color: item.color || '-',
          stock_quantity: item.stock_quantity,
          sku_variant: item.sku_variant || '-',
          price: parseFloat(item.price),
          sale_price: item.sale_price ? parseFloat(item.sale_price) : null,
          updated_at: item.updated_at,
        }))
      });
    } catch (error) {
      console.error('Get inventory report error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Báo cáo doanh thu
  async getRevenueReport(req, res) {
    try {
      const { date } = req.query; // Format: YYYY-MM-DD hoặc YYYY-MM hoặc YYYY

      let dateCondition = '';
      let params = [];
      let groupBy = '';

      if (date) {
        if (date.length === 4) {
          // Năm - nhóm theo tháng
          dateCondition = 'WHERE YEAR(o.created_at) = ?';
          groupBy = 'GROUP BY DATE_FORMAT(o.created_at, "%Y-%m")';
          params.push(date);
        } else if (date.length === 7) {
          // Tháng - nhóm theo ngày
          dateCondition = 'WHERE DATE_FORMAT(o.created_at, "%Y-%m") = ?';
          groupBy = 'GROUP BY DATE(o.created_at)';
          params.push(date);
        } else if (date.length === 10) {
          // Ngày - nhóm theo giờ
          dateCondition = 'WHERE DATE(o.created_at) = ?';
          groupBy = 'GROUP BY HOUR(o.created_at)';
          params.push(date);
        }
      } else {
        // Mặc định nhóm theo ngày
        groupBy = 'GROUP BY DATE(o.created_at)';
      }

      const [revenue] = await pool.execute(`
        SELECT 
          ${date && date.length === 10 
            ? 'HOUR(o.created_at) as period, CONCAT(HOUR(o.created_at), ":00") as period_label'
            : date && date.length === 4
            ? 'DATE_FORMAT(o.created_at, "%Y-%m") as period, DATE_FORMAT(o.created_at, "%m/%Y") as period_label'
            : 'DATE(o.created_at) as period, DATE_FORMAT(o.created_at, "%d/%m/%Y") as period_label'
          },
          COUNT(*) as order_count,
          SUM(o.final_amount) as total_revenue,
          SUM(o.total_amount) as total_amount,
          SUM(o.discount_amount) as total_discount,
          SUM(o.shipping_fee) as total_shipping
        FROM orders o
        WHERE o.order_status = 'completed' AND o.payment_status = 'paid'
        ${dateCondition ? 'AND ' + dateCondition.replace('WHERE', '') : ''}
        ${groupBy}
        ORDER BY period ASC
      `, params);

      res.json({
        success: true,
        data: revenue.map(item => ({
          period: item.period,
          period_label: item.period_label,
          order_count: item.order_count,
          total_revenue: parseFloat(item.total_revenue) || 0,
          total_amount: parseFloat(item.total_amount) || 0,
          total_discount: parseFloat(item.total_discount) || 0,
          total_shipping: parseFloat(item.total_shipping) || 0,
        }))
      });
    } catch (error) {
      console.error('Get revenue report error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Xuất Excel báo cáo tồn kho
  async exportInventoryExcel(req, res) {
    try {
      const { date } = req.query;

      // Lấy dữ liệu báo cáo tồn kho
      let dateCondition = '';
      let params = [];

      if (date) {
        if (date.length === 4) {
          dateCondition = 'WHERE YEAR(pa.updated_at) = ?';
          params.push(date);
        } else if (date.length === 7) {
          dateCondition = 'WHERE DATE_FORMAT(pa.updated_at, "%Y-%m") = ?';
          params.push(date);
        } else if (date.length === 10) {
          dateCondition = 'WHERE DATE(pa.updated_at) = ?';
          params.push(date);
        }
      }

      const [inventory] = await pool.execute(`
        SELECT 
          p.name as 'Tên sản phẩm',
          p.sku as 'SKU',
          COALESCE(pa.size, '-') as 'Size',
          COALESCE(pa.color, '-') as 'Màu',
          pa.stock_quantity as 'Số lượng tồn',
          COALESCE(pa.sku_variant, '-') as 'SKU biến thể',
          p.price as 'Giá',
          COALESCE(p.sale_price, '-') as 'Giá khuyến mãi',
          DATE_FORMAT(pa.updated_at, '%d/%m/%Y %H:%i') as 'Cập nhật lúc'
        FROM product_attributes pa
        LEFT JOIN products p ON pa.product_id = p.id
        ${dateCondition}
        ORDER BY p.name ASC, pa.size ASC, pa.color ASC
      `, params);

      // Tạo workbook
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(inventory);

      // Điều chỉnh độ rộng cột
      const colWidths = [
        { wch: 30 }, // Tên sản phẩm
        { wch: 15 }, // SKU
        { wch: 10 }, // Size
        { wch: 15 }, // Màu
        { wch: 15 }, // Số lượng tồn
        { wch: 15 }, // SKU biến thể
        { wch: 15 }, // Giá
        { wch: 15 }, // Giá khuyến mãi
        { wch: 20 }, // Cập nhật lúc
      ];
      worksheet['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Báo cáo tồn kho');

      // Tạo buffer
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      // Tên file
      const fileName = `bao_cao_ton_kho_${date || 'all'}_${Date.now()}.xlsx`;

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.send(buffer);
    } catch (error) {
      console.error('Export inventory Excel error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Xuất Excel báo cáo doanh thu
  async exportRevenueExcel(req, res) {
    try {
      const { date } = req.query;

      let dateCondition = '';
      let params = [];
      let groupBy = '';

      if (date) {
        if (date.length === 4) {
          dateCondition = 'WHERE YEAR(o.created_at) = ?';
          groupBy = 'GROUP BY DATE_FORMAT(o.created_at, "%Y-%m")';
          params.push(date);
        } else if (date.length === 7) {
          dateCondition = 'WHERE DATE_FORMAT(o.created_at, "%Y-%m") = ?';
          groupBy = 'GROUP BY DATE(o.created_at)';
          params.push(date);
        } else if (date.length === 10) {
          dateCondition = 'WHERE DATE(o.created_at) = ?';
          groupBy = 'GROUP BY HOUR(o.created_at)';
          params.push(date);
        }
      } else {
        groupBy = 'GROUP BY DATE(o.created_at)';
      }

      const [revenue] = await pool.execute(`
        SELECT 
          ${date && date.length === 10 
            ? 'CONCAT(HOUR(o.created_at), ":00") as \'Thời gian\''
            : date && date.length === 4
            ? 'DATE_FORMAT(o.created_at, "%m/%Y") as \'Tháng\''
            : 'DATE_FORMAT(o.created_at, "%d/%m/%Y") as \'Ngày\''
          },
          COUNT(*) as 'Số đơn hàng',
          SUM(o.final_amount) as 'Tổng doanh thu',
          SUM(o.total_amount) as 'Tổng giá trị',
          SUM(o.discount_amount) as 'Tổng giảm giá',
          SUM(o.shipping_fee) as 'Tổng phí vận chuyển'
        FROM orders o
        WHERE o.order_status = 'completed' AND o.payment_status = 'paid'
        ${dateCondition ? 'AND ' + dateCondition.replace('WHERE', '') : ''}
        ${groupBy}
        ORDER BY ${date && date.length === 10 ? 'HOUR(o.created_at)' : date && date.length === 4 ? 'DATE_FORMAT(o.created_at, "%Y-%m")' : 'DATE(o.created_at)'} ASC
      `, params);

      // Tạo workbook
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(revenue);

      // Điều chỉnh độ rộng cột
      const colWidths = [
        { wch: 15 }, // Thời gian/Ngày/Tháng
        { wch: 15 }, // Số đơn hàng
        { wch: 20 }, // Tổng doanh thu
        { wch: 20 }, // Tổng giá trị
        { wch: 20 }, // Tổng giảm giá
        { wch: 20 }, // Tổng phí vận chuyển
      ];
      worksheet['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Báo cáo doanh thu');

      // Tạo buffer
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      // Tên file
      const fileName = `bao_cao_doanh_thu_${date || 'all'}_${Date.now()}.xlsx`;

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.send(buffer);
    } catch (error) {
      console.error('Export revenue Excel error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }
}

module.exports = new AdminController();

