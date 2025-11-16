const { pool } = require('../config/database');

class CategoryController {
  // Lấy tất cả danh mục
  async getAllCategories(req, res) {
    try {
      const [categories] = await pool.execute(
        `SELECT c.*, 
         COUNT(p.id) as product_count,
         (SELECT image_url FROM product_images pi 
          JOIN products p2 ON pi.product_id = p2.id 
          WHERE p2.category_id = c.id AND pi.is_primary = 1 
          LIMIT 1) as featured_image
         FROM categories c 
         LEFT JOIN products p ON c.id = p.category_id 
         WHERE c.is_active = 1 
         GROUP BY c.id 
         ORDER BY c.sort_order ASC, c.name ASC`
      );

      res.json({
        success: true,
        data: categories
      });

    } catch (error) {
      console.error('Get all categories error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Lấy danh mục theo ID
  async getCategoryById(req, res) {
    try {
      const { id } = req.params;

      const [categories] = await pool.execute(
        `SELECT c.*, 
         COUNT(p.id) as product_count
         FROM categories c 
         LEFT JOIN products p ON c.id = p.category_id 
         WHERE c.id = ? AND c.is_active = 1 
         GROUP BY c.id`,
        [id]
      );

      if (categories.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Danh mục không tồn tại'
        });
      }

      res.json({
        success: true,
        data: categories[0]
      });

    } catch (error) {
      console.error('Get category by id error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Tạo danh mục mới (Admin only)
  async createCategory(req, res) {
    try {
      const { name, slug, description, image, parent_id, sort_order } = req.body;

      // Kiểm tra slug đã tồn tại chưa
      const [existingCategory] = await pool.execute(
        'SELECT id FROM categories WHERE slug = ?',
        [slug]
      );

      if (existingCategory.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Slug đã tồn tại'
        });
      }

      // Tạo danh mục mới
      const [result] = await pool.execute(
        'INSERT INTO categories (name, slug, description, image, parent_id, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
        [name, slug, description || null, image || null, parent_id || null, sort_order || 0]
      );

      const categoryId = result.insertId;

      // Lấy thông tin danh mục vừa tạo
      const [newCategory] = await pool.execute(
        'SELECT * FROM categories WHERE id = ?',
        [categoryId]
      );

      res.status(201).json({
        success: true,
        message: 'Tạo danh mục thành công',
        data: newCategory[0]
      });

    } catch (error) {
      console.error('Create category error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Cập nhật danh mục (Admin only)
  async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const { name, slug, description, image, parent_id, sort_order, is_active } = req.body;

      // Kiểm tra danh mục có tồn tại không
      const [existingCategory] = await pool.execute(
        'SELECT id FROM categories WHERE id = ?',
        [id]
      );

      if (existingCategory.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Danh mục không tồn tại'
        });
      }

      // Kiểm tra slug đã tồn tại chưa (trừ danh mục hiện tại)
      if (slug) {
        const [slugCheck] = await pool.execute(
          'SELECT id FROM categories WHERE slug = ? AND id != ?',
          [slug, id]
        );

        if (slugCheck.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'Slug đã tồn tại'
          });
        }
      }

      // Cập nhật danh mục
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
      if (description !== undefined) {
        updateFields.push('description = ?');
        updateValues.push(description);
      }
      if (image !== undefined) {
        updateFields.push('image = ?');
        updateValues.push(image);
      }
      if (parent_id !== undefined) {
        updateFields.push('parent_id = ?');
        updateValues.push(parent_id);
      }
      if (sort_order !== undefined) {
        updateFields.push('sort_order = ?');
        updateValues.push(sort_order);
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
        `UPDATE categories SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );

      // Lấy thông tin danh mục đã cập nhật
      const [updatedCategory] = await pool.execute(
        'SELECT * FROM categories WHERE id = ?',
        [id]
      );

      res.json({
        success: true,
        message: 'Cập nhật danh mục thành công',
        data: updatedCategory[0]
      });

    } catch (error) {
      console.error('Update category error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Xóa danh mục (Admin only)
  async deleteCategory(req, res) {
    try {
      const { id } = req.params;

      // Kiểm tra danh mục có tồn tại không
      const [existingCategory] = await pool.execute(
        'SELECT id FROM categories WHERE id = ?',
        [id]
      );

      if (existingCategory.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Danh mục không tồn tại'
        });
      }

      // Kiểm tra có sản phẩm nào thuộc danh mục này không
      const [products] = await pool.execute(
        'SELECT id FROM products WHERE category_id = ?',
        [id]
      );

      if (products.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Không thể xóa danh mục có sản phẩm'
        });
      }

      // Xóa danh mục
      await pool.execute('DELETE FROM categories WHERE id = ?', [id]);

      res.json({
        success: true,
        message: 'Xóa danh mục thành công'
      });

    } catch (error) {
      console.error('Delete category error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }
}

module.exports = new CategoryController();
