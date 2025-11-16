const { pool } = require('../config/database');

class BrandController {
  // Lấy tất cả thương hiệu
  async getAllBrands(req, res) {
    try {
      const [brands] = await pool.execute(
        `SELECT b.*, 
         COUNT(p.id) as product_count
         FROM brands b 
         LEFT JOIN products p ON b.id = p.brand_id 
         WHERE b.is_active = 1 
         GROUP BY b.id 
         ORDER BY b.name ASC`
      );

      res.json({
        success: true,
        data: brands
      });

    } catch (error) {
      console.error('Get all brands error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Lấy thương hiệu theo ID
  async getBrandById(req, res) {
    try {
      const { id } = req.params;

      const [brands] = await pool.execute(
        `SELECT b.*, 
         COUNT(p.id) as product_count
         FROM brands b 
         LEFT JOIN products p ON b.id = p.brand_id 
         WHERE b.id = ? AND b.is_active = 1 
         GROUP BY b.id`,
        [id]
      );

      if (brands.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Thương hiệu không tồn tại'
        });
      }

      res.json({
        success: true,
        data: brands[0]
      });

    } catch (error) {
      console.error('Get brand by id error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Tạo thương hiệu mới (Admin only)
  async createBrand(req, res) {
    try {
      const { name, slug, logo, description, website } = req.body;

      // Kiểm tra slug đã tồn tại chưa
      const [existingBrand] = await pool.execute(
        'SELECT id FROM brands WHERE slug = ?',
        [slug]
      );

      if (existingBrand.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Slug đã tồn tại'
        });
      }

      // Tạo thương hiệu mới
      const [result] = await pool.execute(
        'INSERT INTO brands (name, slug, logo, description, website) VALUES (?, ?, ?, ?, ?)',
        [name, slug, logo || null, description || null, website || null]
      );

      const brandId = result.insertId;

      // Lấy thông tin thương hiệu vừa tạo
      const [newBrand] = await pool.execute(
        'SELECT * FROM brands WHERE id = ?',
        [brandId]
      );

      res.status(201).json({
        success: true,
        message: 'Tạo thương hiệu thành công',
        data: newBrand[0]
      });

    } catch (error) {
      console.error('Create brand error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Cập nhật thương hiệu (Admin only)
  async updateBrand(req, res) {
    try {
      const { id } = req.params;
      const { name, slug, logo, description, website, is_active } = req.body;

      // Kiểm tra thương hiệu có tồn tại không
      const [existingBrand] = await pool.execute(
        'SELECT id FROM brands WHERE id = ?',
        [id]
      );

      if (existingBrand.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Thương hiệu không tồn tại'
        });
      }

      // Kiểm tra slug đã tồn tại chưa (trừ thương hiệu hiện tại)
      if (slug) {
        const [slugCheck] = await pool.execute(
          'SELECT id FROM brands WHERE slug = ? AND id != ?',
          [slug, id]
        );

        if (slugCheck.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'Slug đã tồn tại'
          });
        }
      }

      // Cập nhật thương hiệu
      const updateFields = [];
      const updateValues = [];

      if (name !== undefined) {
        updateFields.push('name = ?');
        updateValues.push(name);
      }
      if (slug !== undefined) {
        updateFields.push('slug = ?');
        updateValues.push(slug);
      }
      if (logo !== undefined) {
        updateFields.push('logo = ?');
        updateValues.push(logo);
      }
      if (description !== undefined) {
        updateFields.push('description = ?');
        updateValues.push(description);
      }
      if (website !== undefined) {
        updateFields.push('website = ?');
        updateValues.push(website);
      }
      if (is_active !== undefined) {
        updateFields.push('is_active = ?');
        updateValues.push(is_active);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Không có dữ liệu để cập nhật'
        });
      }

      updateFields.push('updated_at = CURRENT_TIMESTAMP');
      updateValues.push(id);

      await pool.execute(
        `UPDATE brands SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );

      // Lấy thông tin thương hiệu đã cập nhật
      const [updatedBrand] = await pool.execute(
        'SELECT * FROM brands WHERE id = ?',
        [id]
      );

      res.json({
        success: true,
        message: 'Cập nhật thương hiệu thành công',
        data: updatedBrand[0]
      });

    } catch (error) {
      console.error('Update brand error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Xóa thương hiệu (Admin only)
  async deleteBrand(req, res) {
    try {
      const { id } = req.params;

      // Kiểm tra thương hiệu có tồn tại không
      const [existingBrand] = await pool.execute(
        'SELECT id FROM brands WHERE id = ?',
        [id]
      );

      if (existingBrand.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Thương hiệu không tồn tại'
        });
      }

      // Kiểm tra có sản phẩm nào thuộc thương hiệu này không
      const [products] = await pool.execute(
        'SELECT id FROM products WHERE brand_id = ?',
        [id]
      );

      if (products.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Không thể xóa thương hiệu có sản phẩm'
        });
      }

      // Xóa thương hiệu
      await pool.execute('DELETE FROM brands WHERE id = ?', [id]);

      res.json({
        success: true,
        message: 'Xóa thương hiệu thành công'
      });

    } catch (error) {
      console.error('Delete brand error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }
}

module.exports = new BrandController();
