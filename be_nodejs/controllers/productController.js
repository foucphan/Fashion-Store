const { pool } = require('../config/database');

class ProductController {
  // Lấy tất cả sản phẩm với phân trang và lọc
  async getAllProducts(req, res) {
    try {
      const {
        page = 1,
        limit = 12,
        category_id,
        brand_id,
        gender,
        min_price,
        max_price,
        search,
        sort_by = 'created_at',
        sort_order = 'DESC',
        featured
      } = req.query;

      const offset = (page - 1) * limit;
      let whereConditions = ['p.status = "active"'];
      let queryParams = [];

      // Lọc theo danh mục
      if (category_id) {
        whereConditions.push('p.category_id = ?');
        queryParams.push(category_id);
      }

      // Lọc theo thương hiệu
      if (brand_id) {
        whereConditions.push('p.brand_id = ?');
        queryParams.push(brand_id);
      }

      // Lọc theo giới tính
      if (gender) {
        whereConditions.push('p.gender = ?');
        queryParams.push(gender);
      }

      // Lọc theo giá
      if (min_price) {
        whereConditions.push('p.price >= ?');
        queryParams.push(min_price);
      }
      if (max_price) {
        whereConditions.push('p.price <= ?');
        queryParams.push(max_price);
      }

      // Tìm kiếm theo tên
      if (search) {
        whereConditions.push('(p.name LIKE ? OR p.description LIKE ?)');
        queryParams.push(`%${search}%`, `%${search}%`);
      }

      // Lọc sản phẩm nổi bật
      if (featured === 'true') {
        whereConditions.push('p.featured = 1');
      }

      // Xây dựng query
      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
      
      // Query chính
      const mainQuery = `
        SELECT p.*, 
               c.name as category_name,
               c.slug as category_slug,
               b.name as brand_name,
               b.slug as brand_slug,
               (SELECT image_url FROM product_images pi 
                WHERE pi.product_id = p.id AND pi.is_primary = 1 
                LIMIT 1) as primary_image,
               (SELECT COUNT(*) FROM product_attributes pa 
                WHERE pa.product_id = p.id AND pa.stock_quantity > 0) as available_variants
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN brands b ON p.brand_id = b.id
        ${whereClause}
        ORDER BY p.${sort_by} ${sort_order}
        LIMIT ? OFFSET ?
      `;

      queryParams.push(parseInt(limit), offset);

      const [products] = await pool.execute(mainQuery, queryParams);

      // Đếm tổng số sản phẩm
      const countQuery = `
        SELECT COUNT(*) as total
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN brands b ON p.brand_id = b.id
        ${whereClause}
      `;

      const [countResult] = await pool.execute(countQuery, queryParams.slice(0, -2));
      const total = countResult[0].total;

      res.json({
        success: true,
        data: {
          products,
          pagination: {
            current_page: parseInt(page),
            per_page: parseInt(limit),
            total: total,
            total_pages: Math.ceil(total / limit)
          }
        }
      });

    } catch (error) {
      console.error('Get all products error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Lấy sản phẩm theo ID
  async getProductById(req, res) {
    try {
      const { id } = req.params;

      // Lấy thông tin sản phẩm
      const [products] = await pool.execute(
        `SELECT p.*, 
         c.name as category_name,
         c.slug as category_slug,
         b.name as brand_name,
         b.slug as brand_slug
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         LEFT JOIN brands b ON p.brand_id = b.id
         WHERE p.id = ? AND p.status = "active"`,
        [id]
      );

      if (products.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Sản phẩm không tồn tại'
        });
      }

      const product = products[0];

      // Lấy hình ảnh sản phẩm
      const [images] = await pool.execute(
        'SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC',
        [id]
      );

      // Lấy thuộc tính sản phẩm (size, color, stock)
      const [attributes] = await pool.execute(
        'SELECT * FROM product_attributes WHERE product_id = ? ORDER BY size, color',
        [id]
      );

      // Lấy đánh giá sản phẩm
      const [reviews] = await pool.execute(
        `SELECT pr.*, u.full_name, u.avatar
         FROM product_reviews pr
         LEFT JOIN users u ON pr.user_id = u.id
         WHERE pr.product_id = ? AND pr.is_approved = 1
         ORDER BY pr.created_at DESC`,
        [id]
      );

      // Tính rating trung bình
      const [ratingStats] = await pool.execute(
        'SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews FROM product_reviews WHERE product_id = ? AND is_approved = 1',
        [id]
      );

      res.json({
        success: true,
        data: {
          ...product,
          images,
          attributes,
          reviews,
          rating_stats: ratingStats[0]
        }
      });

    } catch (error) {
      console.error('Get product by id error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Lấy sản phẩm liên quan
  async getRelatedProducts(req, res) {
    try {
      const { id } = req.params;
      const { limit = 8 } = req.query;

      // Lấy thông tin sản phẩm hiện tại
      const [currentProduct] = await pool.execute(
        'SELECT category_id, brand_id FROM products WHERE id = ?',
        [id]
      );

      if (currentProduct.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Sản phẩm không tồn tại'
        });
      }

      const { category_id, brand_id } = currentProduct[0];

      // Lấy sản phẩm liên quan (cùng danh mục hoặc thương hiệu)
      const [relatedProducts] = await pool.execute(
        `SELECT p.*, 
         c.name as category_name,
         b.name as brand_name,
         (SELECT image_url FROM product_images pi 
          WHERE pi.product_id = p.id AND pi.is_primary = 1 
          LIMIT 1) as primary_image
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         LEFT JOIN brands b ON p.brand_id = b.id
         WHERE p.id != ? AND p.status = "active" 
         AND (p.category_id = ? OR p.brand_id = ?)
         ORDER BY RAND()
         LIMIT ?`,
        [id, category_id, brand_id, parseInt(limit)]
      );

      res.json({
        success: true,
        data: relatedProducts
      });

    } catch (error) {
      console.error('Get related products error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Tạo sản phẩm mới (Admin only)
  async createProduct(req, res) {
    try {
      const {
        name,
        slug,
        description,
        short_description,
        sku,
        price,
        sale_price,
        category_id,
        brand_id,
        gender,
        featured,
        meta_title,
        meta_description
      } = req.body;

      // Kiểm tra slug đã tồn tại chưa
      const [existingProduct] = await pool.execute(
        'SELECT id FROM products WHERE slug = ?',
        [slug]
      );

      if (existingProduct.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Slug đã tồn tại'
        });
      }

      // Kiểm tra SKU đã tồn tại chưa
      const [existingSku] = await pool.execute(
        'SELECT id FROM products WHERE sku = ?',
        [sku]
      );

      if (existingSku.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'SKU đã tồn tại'
        });
      }

      // Tạo sản phẩm mới
      const [result] = await pool.execute(
        `INSERT INTO products (name, slug, description, short_description, sku, price, sale_price, 
         category_id, brand_id, gender, featured, meta_title, meta_description) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name, slug, description || null, short_description || null, sku, price,
          sale_price || null, category_id, brand_id || null, gender || 'unisex',
          featured || false, meta_title || null, meta_description || null
        ]
      );

      const productId = result.insertId;

      // Lấy thông tin sản phẩm vừa tạo
      const [newProduct] = await pool.execute(
        'SELECT * FROM products WHERE id = ?',
        [productId]
      );

      res.status(201).json({
        success: true,
        message: 'Tạo sản phẩm thành công',
        data: newProduct[0]
      });

    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Cập nhật sản phẩm (Admin only)
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Kiểm tra sản phẩm có tồn tại không
      const [existingProduct] = await pool.execute(
        'SELECT id FROM products WHERE id = ?',
        [id]
      );

      if (existingProduct.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Sản phẩm không tồn tại'
        });
      }

      // Kiểm tra slug đã tồn tại chưa (trừ sản phẩm hiện tại)
      if (updateData.slug) {
        const [slugCheck] = await pool.execute(
          'SELECT id FROM products WHERE slug = ? AND id != ?',
          [updateData.slug, id]
        );

        if (slugCheck.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'Slug đã tồn tại'
          });
        }
      }

      // Kiểm tra SKU đã tồn tại chưa (trừ sản phẩm hiện tại)
      if (updateData.sku) {
        const [skuCheck] = await pool.execute(
          'SELECT id FROM products WHERE sku = ? AND id != ?',
          [updateData.sku, id]
        );

        if (skuCheck.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'SKU đã tồn tại'
          });
        }
      }

      // Cập nhật sản phẩm
      const allowedFields = [
        'name', 'slug', 'description', 'short_description', 'sku', 'price', 'sale_price',
        'category_id', 'brand_id', 'gender', 'status', 'featured', 'meta_title', 'meta_description'
      ];

      const updateFields = [];
      const updateValues = [];

      Object.keys(updateData).forEach(key => {
        if (allowedFields.includes(key) && updateData[key] !== undefined) {
          updateFields.push(`${key} = ?`);
          updateValues.push(updateData[key]);
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
        `UPDATE products SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );

      // Lấy thông tin sản phẩm đã cập nhật
      const [updatedProduct] = await pool.execute(
        'SELECT * FROM products WHERE id = ?',
        [id]
      );

      res.json({
        success: true,
        message: 'Cập nhật sản phẩm thành công',
        data: updatedProduct[0]
      });

    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Xóa sản phẩm (Admin only)
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;

      // Kiểm tra sản phẩm có tồn tại không
      const [existingProduct] = await pool.execute(
        'SELECT id FROM products WHERE id = ?',
        [id]
      );

      if (existingProduct.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Sản phẩm không tồn tại'
        });
      }

      // Kiểm tra có đơn hàng nào chứa sản phẩm này không
      const [orderItems] = await pool.execute(
        'SELECT id FROM order_items WHERE product_id = ?',
        [id]
      );

      if (orderItems.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Không thể xóa sản phẩm đã có trong đơn hàng'
        });
      }

      // Xóa sản phẩm (sẽ xóa cascade các bảng liên quan)
      await pool.execute('DELETE FROM products WHERE id = ?', [id]);

      res.json({
        success: true,
        message: 'Xóa sản phẩm thành công'
      });

    } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Lấy attributes của sản phẩm
  async getProductAttributes(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Product ID is required'
        });
      }

      const [attributes] = await pool.execute(
        'SELECT id, size, color, stock_quantity, sku_variant FROM product_attributes WHERE product_id = ? ORDER BY size, color',
        [id]
      );

      res.json({
        success: true,
        data: attributes
      });

    } catch (error) {
      console.error('Get product attributes error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }
}

module.exports = new ProductController();
