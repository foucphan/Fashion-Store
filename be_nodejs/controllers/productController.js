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

      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.max(1, parseInt(limit) || 12);
      const offset = (pageNum - 1) * limitNum;
      
      // Validate sort_by và sort_order để tránh SQL injection
      const allowedSortFields = ['created_at', 'name', 'price', 'sale_price', 'updated_at'];
      const allowedSortOrders = ['ASC', 'DESC'];
      const safeSortBy = allowedSortFields.includes(sort_by) ? sort_by : 'created_at';
      const safeSortOrder = allowedSortOrders.includes(sort_order.toUpperCase()) ? sort_order.toUpperCase() : 'DESC';
      
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
        ORDER BY p.${safeSortBy} ${safeSortOrder}
        LIMIT ${limitNum} OFFSET ${offset}
      `;

      const [products] = await pool.execute(mainQuery, queryParams);

      // Đếm tổng số sản phẩm
      const countQuery = `
        SELECT COUNT(*) as total
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN brands b ON p.brand_id = b.id
        ${whereClause}
      `;

      const [countResult] = await pool.execute(countQuery, queryParams);
      const total = countResult[0].total;

      res.json({
        success: true,
        data: {
          products,
          pagination: {
            current_page: pageNum,
            per_page: limitNum,
            total: total,
            total_pages: Math.ceil(total / limitNum)
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

  // Lấy tất cả inventory (Admin only)
  async getAllInventory(req, res) {
    try {
      const { page = 1, limit = 50, product_id, low_stock } = req.query;
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.max(1, parseInt(limit) || 50);
      const offset = (pageNum - 1) * limitNum;

      let whereConditions = [];
      let params = [];

      if (product_id) {
        whereConditions.push('pa.product_id = ?');
        params.push(product_id);
      }

      if (low_stock === 'true') {
        whereConditions.push('pa.stock_quantity <= 10');
      }

      const whereClause = whereConditions.length > 0 
        ? 'WHERE ' + whereConditions.join(' AND ')
        : '';

      const [inventory] = await pool.execute(`
        SELECT 
          pa.id,
          pa.product_id,
          pa.size,
          pa.color,
          pa.stock_quantity,
          pa.sku_variant,
          p.name as product_name,
          p.sku as product_sku,
          p.price,
          p.sale_price
        FROM product_attributes pa
        LEFT JOIN products p ON pa.product_id = p.id
        ${whereClause}
        ORDER BY p.name ASC, pa.size ASC, pa.color ASC
        LIMIT ${limitNum} OFFSET ${offset}
      `, params);

      const [totalCount] = await pool.execute(`
        SELECT COUNT(*) as total
        FROM product_attributes pa
        ${whereClause}
      `, params);

      res.json({
        success: true,
        data: {
          inventory: inventory.map(item => ({
            id: item.id,
            product_id: item.product_id,
            product_name: item.product_name,
            product_sku: item.product_sku,
            size: item.size,
            color: item.color,
            stock_quantity: item.stock_quantity,
            sku_variant: item.sku_variant,
            price: parseFloat(item.price),
            sale_price: item.sale_price ? parseFloat(item.sale_price) : null,
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
      console.error('Get all inventory error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Cập nhật stock quantity (Admin only)
  async updateStockQuantity(req, res) {
    try {
      const { id } = req.params;
      const { stock_quantity } = req.body;

      if (stock_quantity === undefined || stock_quantity < 0) {
        return res.status(400).json({
          success: false,
          message: 'Số lượng tồn kho không hợp lệ'
        });
      }

      // Kiểm tra attribute có tồn tại không
      const [attributes] = await pool.execute(
        'SELECT id FROM product_attributes WHERE id = ?',
        [id]
      );

      if (attributes.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Thuộc tính sản phẩm không tồn tại'
        });
      }

      // Cập nhật stock quantity
      await pool.execute(
        'UPDATE product_attributes SET stock_quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [parseInt(stock_quantity), id]
      );

      // Lấy thông tin đã cập nhật
      const [updated] = await pool.execute(
        'SELECT * FROM product_attributes WHERE id = ?',
        [id]
      );

      res.json({
        success: true,
        message: 'Cập nhật số lượng tồn kho thành công',
        data: updated[0]
      });
    } catch (error) {
      console.error('Update stock quantity error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Lấy tất cả ảnh của sản phẩm
  async getProductImages(req, res) {
    try {
      const { id } = req.params;

      const [images] = await pool.execute(
        'SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC',
        [id]
      );

      res.json({
        success: true,
        data: images
      });
    } catch (error) {
      console.error('Get product images error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Upload ảnh sản phẩm
  async uploadProductImage(req, res) {
    try {
      const { id } = req.params;
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          message: 'Không có file được upload'
        });
      }

      // Kiểm tra sản phẩm có tồn tại không
      const [products] = await pool.execute('SELECT id FROM products WHERE id = ?', [id]);
      if (products.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Sản phẩm không tồn tại'
        });
      }

      // Tạo URL ảnh (relative path từ public folder)
      const imageUrl = `/images/products/${file.filename}`;
      const { is_primary = false, alt_text = '', sort_order = 0 } = req.body;

      // Nếu đặt làm ảnh chính, bỏ is_primary của các ảnh khác
      if (is_primary === 'true' || is_primary === true) {
        await pool.execute(
          'UPDATE product_images SET is_primary = 0 WHERE product_id = ?',
          [id]
        );
      }

      // Thêm ảnh vào database
      const [result] = await pool.execute(
        'INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES (?, ?, ?, ?, ?)',
        [id, imageUrl, alt_text || null, is_primary === 'true' || is_primary === true, parseInt(sort_order) || 0]
      );

      const [newImage] = await pool.execute('SELECT * FROM product_images WHERE id = ?', [result.insertId]);

      res.status(201).json({
        success: true,
        message: 'Upload ảnh thành công',
        data: newImage[0]
      });
    } catch (error) {
      console.error('Upload product image error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Cập nhật thông tin ảnh sản phẩm
  async updateProductImage(req, res) {
    try {
      const { id, imageId } = req.params;
      const { alt_text, is_primary, sort_order } = req.body;

      // Kiểm tra ảnh có tồn tại không
      const [images] = await pool.execute(
        'SELECT * FROM product_images WHERE id = ? AND product_id = ?',
        [imageId, id]
      );

      if (images.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Ảnh không tồn tại'
        });
      }

      const updateFields = [];
      const updateValues = [];

      if (alt_text !== undefined) {
        updateFields.push('alt_text = ?');
        updateValues.push(alt_text);
      }

      if (is_primary !== undefined) {
        // Nếu đặt làm ảnh chính, bỏ is_primary của các ảnh khác
        if (is_primary === 'true' || is_primary === true) {
          await pool.execute(
            'UPDATE product_images SET is_primary = 0 WHERE product_id = ? AND id != ?',
            [id, imageId]
          );
        }
        updateFields.push('is_primary = ?');
        updateValues.push(is_primary === 'true' || is_primary === true);
      }

      if (sort_order !== undefined) {
        updateFields.push('sort_order = ?');
        updateValues.push(parseInt(sort_order) || 0);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Không có dữ liệu để cập nhật'
        });
      }

      updateValues.push(imageId);

      await pool.execute(
        `UPDATE product_images SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );

      const [updatedImage] = await pool.execute('SELECT * FROM product_images WHERE id = ?', [imageId]);

      res.json({
        success: true,
        message: 'Cập nhật ảnh thành công',
        data: updatedImage[0]
      });
    } catch (error) {
      console.error('Update product image error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Xóa ảnh sản phẩm
  async deleteProductImage(req, res) {
    try {
      const { id, imageId } = req.params;
      const fs = require('fs');
      const path = require('path');

      // Kiểm tra ảnh có tồn tại không
      const [images] = await pool.execute(
        'SELECT * FROM product_images WHERE id = ? AND product_id = ?',
        [imageId, id]
      );

      if (images.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Ảnh không tồn tại'
        });
      }

      const image = images[0];
      const imagePath = path.join(__dirname, '../../fe_reactjs/public', image.image_url);

      // Xóa file ảnh từ filesystem
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      // Xóa record từ database
      await pool.execute('DELETE FROM product_images WHERE id = ?', [imageId]);

      res.json({
        success: true,
        message: 'Xóa ảnh thành công'
      });
    } catch (error) {
      console.error('Delete product image error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }
}

module.exports = new ProductController();
