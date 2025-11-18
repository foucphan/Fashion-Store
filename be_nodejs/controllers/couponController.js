const { pool } = require('../config/database');

class CouponController {
  // Lấy tất cả mã giảm giá (Admin)
  async getAllCoupons(req, res) {
    try {
      const { page = 1, limit = 50, is_active } = req.query;
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.max(1, parseInt(limit) || 50);
      const offset = (pageNum - 1) * limitNum;

      let whereConditions = [];
      let params = [];

      if (is_active !== undefined) {
        const now = new Date();
        if (is_active === 'true') {
          whereConditions.push('is_active = 1');
          whereConditions.push('start_date <= ?');
          whereConditions.push('end_date >= ?');
          params.push(now, now);
        } else {
          whereConditions.push('(is_active = 0 OR start_date > ? OR end_date < ?)');
          params.push(now, now);
        }
      }

      const whereClause = whereConditions.length > 0 
        ? 'WHERE ' + whereConditions.join(' AND ')
        : '';

      const [coupons] = await pool.execute(`
        SELECT 
          id,
          code,
          name,
          description,
          type,
          value,
          min_order_amount,
          max_discount_amount,
          usage_limit,
          used_count,
          start_date,
          end_date,
          is_active,
          created_at,
          updated_at
        FROM coupons
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT ${limitNum} OFFSET ${offset}
      `, params);

      const [totalCount] = await pool.execute(`
        SELECT COUNT(*) as total
        FROM coupons
        ${whereClause}
      `, params);

      res.json({
        success: true,
        data: {
          coupons: coupons.map(coupon => ({
            id: coupon.id,
            code: coupon.code,
            name: coupon.name,
            description: coupon.description,
            type: coupon.type,
            value: parseFloat(coupon.value),
            min_order_amount: parseFloat(coupon.min_order_amount),
            max_discount_amount: coupon.max_discount_amount ? parseFloat(coupon.max_discount_amount) : null,
            usage_limit: coupon.usage_limit,
            used_count: coupon.used_count,
            start_date: coupon.start_date,
            end_date: coupon.end_date,
            is_active: coupon.is_active,
            created_at: coupon.created_at,
            updated_at: coupon.updated_at,
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
      console.error('Get all coupons error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Lấy mã giảm giá theo ID (Admin)
  async getCouponById(req, res) {
    try {
      const { id } = req.params;

      const [coupons] = await pool.execute('SELECT * FROM coupons WHERE id = ?', [id]);

      if (coupons.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Mã giảm giá không tồn tại'
        });
      }

      const coupon = coupons[0];
      res.json({
        success: true,
        data: {
          ...coupon,
          value: parseFloat(coupon.value),
          min_order_amount: parseFloat(coupon.min_order_amount),
          max_discount_amount: coupon.max_discount_amount ? parseFloat(coupon.max_discount_amount) : null,
        }
      });
    } catch (error) {
      console.error('Get coupon by id error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Tạo mã giảm giá mới (Admin)
  async createCoupon(req, res) {
    try {
      const {
        code,
        name,
        description,
        type,
        value,
        min_order_amount,
        max_discount_amount,
        usage_limit,
        start_date,
        end_date,
        is_active
      } = req.body;

      if (!code || !name || !type || value === undefined || !start_date || !end_date) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
        });
      }

      // Kiểm tra code đã tồn tại chưa
      const [existingCoupon] = await pool.execute('SELECT id FROM coupons WHERE code = ?', [code]);
      if (existingCoupon.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Mã giảm giá đã tồn tại'
        });
      }

      // Chỉ chấp nhận loại percentage
      if (type !== 'percentage') {
        return res.status(400).json({
          success: false,
          message: 'Chỉ hỗ trợ mã giảm giá theo phần trăm (%)'
        });
      }

      // Validate dates
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);
      if (endDate <= startDate) {
        return res.status(400).json({
          success: false,
          message: 'Ngày kết thúc phải sau ngày bắt đầu'
        });
      }

      const [result] = await pool.execute(
        `INSERT INTO coupons (code, name, description, type, value, min_order_amount, 
         max_discount_amount, usage_limit, start_date, end_date, is_active) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          code.toUpperCase(),
          name,
          description || null,
          type,
          value,
          min_order_amount || 0,
          max_discount_amount || null,
          usage_limit || null,
          start_date,
          end_date,
          is_active !== undefined ? is_active : true
        ]
      );

      const [newCoupon] = await pool.execute('SELECT * FROM coupons WHERE id = ?', [result.insertId]);

      res.status(201).json({
        success: true,
        message: 'Tạo mã giảm giá thành công',
        data: {
          ...newCoupon[0],
          value: parseFloat(newCoupon[0].value),
          min_order_amount: parseFloat(newCoupon[0].min_order_amount),
          max_discount_amount: newCoupon[0].max_discount_amount ? parseFloat(newCoupon[0].max_discount_amount) : null,
        }
      });
    } catch (error) {
      console.error('Create coupon error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Cập nhật mã giảm giá (Admin)
  async updateCoupon(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Kiểm tra mã giảm giá có tồn tại không
      const [existingCoupon] = await pool.execute('SELECT id FROM coupons WHERE id = ?', [id]);
      if (existingCoupon.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Mã giảm giá không tồn tại'
        });
      }

      // Kiểm tra code đã tồn tại chưa (trừ mã hiện tại)
      if (updateData.code) {
        const [codeCheck] = await pool.execute(
          'SELECT id FROM coupons WHERE code = ? AND id != ?',
          [updateData.code.toUpperCase(), id]
        );
        if (codeCheck.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'Mã giảm giá đã tồn tại'
          });
        }
      }

      // Chỉ chấp nhận loại percentage
      if (updateData.type && updateData.type !== 'percentage') {
        return res.status(400).json({
          success: false,
          message: 'Chỉ hỗ trợ mã giảm giá theo phần trăm (%)'
        });
      }

      // Validate dates nếu có
      if (updateData.start_date && updateData.end_date) {
        const startDate = new Date(updateData.start_date);
        const endDate = new Date(updateData.end_date);
        if (endDate <= startDate) {
          return res.status(400).json({
            success: false,
            message: 'Ngày kết thúc phải sau ngày bắt đầu'
          });
        }
      }

      const allowedFields = [
        'code', 'name', 'description', 'type', 'value', 'min_order_amount',
        'max_discount_amount', 'usage_limit', 'start_date', 'end_date', 'is_active'
      ];

      const updateFields = [];
      const updateValues = [];

      Object.keys(updateData).forEach(key => {
        if (allowedFields.includes(key) && updateData[key] !== undefined) {
          if (key === 'code') {
            updateFields.push(`${key} = ?`);
            updateValues.push(updateData[key].toUpperCase());
          } else {
            updateFields.push(`${key} = ?`);
            updateValues.push(updateData[key]);
          }
        }
      });

      if (updateFields.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Không có dữ liệu để cập nhật'
        });
      }

      updateFields.push('updated_at = CURRENT_TIMESTAMP');
      updateValues.push(id);

      await pool.execute(
        `UPDATE coupons SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );

      const [updatedCoupon] = await pool.execute('SELECT * FROM coupons WHERE id = ?', [id]);

      res.json({
        success: true,
        message: 'Cập nhật mã giảm giá thành công',
        data: {
          ...updatedCoupon[0],
          value: parseFloat(updatedCoupon[0].value),
          min_order_amount: parseFloat(updatedCoupon[0].min_order_amount),
          max_discount_amount: updatedCoupon[0].max_discount_amount ? parseFloat(updatedCoupon[0].max_discount_amount) : null,
        }
      });
    } catch (error) {
      console.error('Update coupon error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Xóa mã giảm giá (Admin)
  async deleteCoupon(req, res) {
    try {
      const { id } = req.params;

      // Kiểm tra mã giảm giá có tồn tại không
      const [existingCoupon] = await pool.execute('SELECT id FROM coupons WHERE id = ?', [id]);
      if (existingCoupon.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Mã giảm giá không tồn tại'
        });
      }

      await pool.execute('DELETE FROM coupons WHERE id = ?', [id]);

      res.json({
        success: true,
        message: 'Xóa mã giảm giá thành công'
      });
    } catch (error) {
      console.error('Delete coupon error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }
}

module.exports = new CouponController();

