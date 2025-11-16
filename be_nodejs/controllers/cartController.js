const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Lấy giỏ hàng của user
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // Lấy tất cả items trong giỏ hàng
    const [items] = await pool.execute(`
      SELECT 
        ci.id,
        ci.user_id,
        ci.product_id,
        ci.product_attribute_id,
        ci.quantity,
        ci.created_at,
        ci.updated_at,
        p.name as product_name,
        p.slug as product_slug,
        p.price as product_price,
        p.sale_price as product_sale_price,
        pi.image_url as product_primary_image,
        pa.size,
        pa.color,
        pa.stock_quantity
      FROM cart ci
      LEFT JOIN products p ON ci.product_id = p.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
      LEFT JOIN product_attributes pa ON ci.product_attribute_id = pa.id
      WHERE ci.user_id = ?
      ORDER BY ci.created_at DESC
    `, [userId]);

    // Tính tổng
    let totalItems = 0;
    let totalAmount = 0;
    let shippingFee = 0;
    let discountAmount = 0;

    items.forEach(item => {
      const price = item.product_sale_price || item.product_price || 0;
      const itemTotal = price * item.quantity;
      
      totalItems += item.quantity;
      totalAmount += itemTotal;
    });

    // Tính phí vận chuyển (miễn phí từ 500k)
    if (totalAmount < 500000) {
      shippingFee = 30000; // 30k phí ship
    }

    // Tính giảm giá (có thể thêm logic giảm giá ở đây)
    const finalAmount = totalAmount + shippingFee - discountAmount;

    const cart = {
      items: items.map(item => ({
        id: item.id,
        user_id: item.user_id,
        product_id: item.product_id,
        product_attribute_id: item.product_attribute_id,
        quantity: item.quantity,
        created_at: item.created_at,
        updated_at: item.updated_at,
        product: {
          id: item.product_id,
          name: item.product_name,
          slug: item.product_slug,
          price: item.product_price,
          sale_price: item.product_sale_price,
          primary_image: item.product_primary_image,
          available_variants: item.product_available_variants,
        },
        product_attribute: item.product_attribute_id ? {
          id: item.product_attribute_id,
          size: item.size,
          color: item.color,
          stock_quantity: item.stock_quantity,
        } : null,
      })),
      total_items: totalItems,
      total_amount: totalAmount,
      shipping_fee: shippingFee,
      discount_amount: discountAmount,
      final_amount: finalAmount,
    };

    res.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
};

// Thêm sản phẩm vào giỏ hàng
const addToCart = async (req, res) => {
  try {
    console.log('AddToCart - Request headers:', req.headers);
    console.log('AddToCart - Request body:', req.body);
    console.log('AddToCart - Request user:', req.user);
    
    const userId = req.user.id;
    const { product_id, product_attribute_id, quantity } = req.body;

    console.log('Add to cart request:', { userId, product_id, product_attribute_id, quantity });

    // Validate input
    if (!product_id || !quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
      });
    }

    // Kiểm tra sản phẩm tồn tại
    const [products] = await pool.execute(
      'SELECT id, name, price, sale_price FROM products WHERE id = ?',
      [product_id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Sản phẩm không tồn tại',
      });
    }

    // Kiểm tra product attribute nếu có
    if (product_attribute_id) {
      console.log('Checking product attribute:', { product_attribute_id, product_id });
      const [attributes] = await pool.execute(
        'SELECT id, stock_quantity FROM product_attributes WHERE id = ? AND product_id = ?',
        [product_attribute_id, product_id]
      );

      console.log('Product attributes found:', attributes);

      if (attributes.length === 0) {
        return res.status(404).json({
          success: false,
          message: `Biến thể sản phẩm không tồn tại. Product ID: ${product_id}, Attribute ID: ${product_attribute_id}`,
        });
      }

      if (attributes[0].stock_quantity < quantity) {
        return res.status(400).json({
          success: false,
          message: 'Không đủ hàng trong kho',
        });
      }
    }

    // Kiểm tra item đã tồn tại trong giỏ hàng
    let existingItems;
    if (product_attribute_id) {
      console.log('Checking existing cart item with attribute:', { userId, product_id, product_attribute_id });
      [existingItems] = await pool.execute(
        'SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ? AND product_attribute_id = ?',
        [userId, product_id, product_attribute_id]
      );
    } else {
      console.log('Checking existing cart item without attribute:', { userId, product_id });
      [existingItems] = await pool.execute(
        'SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ? AND product_attribute_id IS NULL',
        [userId, product_id]
      );
    }
    
    console.log('Existing items found:', existingItems);

    if (existingItems.length > 0) {
      // Cập nhật số lượng
      const newQuantity = existingItems[0].quantity + quantity;
      await pool.execute(
        'UPDATE cart SET quantity = ?, updated_at = NOW() WHERE id = ?',
        [newQuantity, existingItems[0].id]
      );

      // Lấy item đã cập nhật
      const [updatedItem] = await pool.execute(
        'SELECT * FROM cart WHERE id = ?',
        [existingItems[0].id]
      );

      return res.json({
        success: true,
        data: updatedItem[0],
        message: 'Đã cập nhật số lượng sản phẩm trong giỏ hàng',
      });
    } else {
      // Thêm mới
      const [result] = await pool.execute(
        'INSERT INTO cart (user_id, product_id, product_attribute_id, quantity) VALUES (?, ?, ?, ?)',
        [userId, product_id, product_attribute_id || null, quantity]
      );

      const [newItem] = await pool.execute(
        'SELECT * FROM cart WHERE id = ?',
        [result.insertId]
      );

      return res.json({
        success: true,
        data: newItem[0],
        message: 'Đã thêm sản phẩm vào giỏ hàng',
      });
    }
  } catch (error) {
    console.error('Add to cart error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const itemId = req.params.id;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Số lượng không hợp lệ',
      });
    }

    // Kiểm tra item thuộc về user
    const [items] = await pool.execute(
      'SELECT * FROM cart WHERE id = ? AND user_id = ?',
      [itemId, userId]
    );

    if (items.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Sản phẩm không tồn tại trong giỏ hàng',
      });
    }

    // Kiểm tra stock nếu có product attribute
    if (items[0].product_attribute_id) {
      const [attributes] = await pool.execute(
        'SELECT stock_quantity FROM product_attributes WHERE id = ?',
        [items[0].product_attribute_id]
      );

      if (attributes.length > 0 && attributes[0].stock_quantity < quantity) {
        return res.status(400).json({
          success: false,
          message: 'Không đủ hàng trong kho',
        });
      }
    }

    // Cập nhật
    await pool.execute(
      'UPDATE cart SET quantity = ?, updated_at = NOW() WHERE id = ?',
      [quantity, itemId]
    );

    // Lấy thông tin đầy đủ của item sau khi update
    const [updatedItems] = await pool.execute(`
      SELECT
        ci.id,
        ci.user_id,
        ci.product_id,
        ci.product_attribute_id,
        ci.quantity,
        ci.created_at,
        ci.updated_at,
        p.name as product_name,
        p.slug as product_slug,
        p.price as product_price,
        p.sale_price as product_sale_price,
        pi.image_url as product_primary_image,
        pa.size,
        pa.color,
        pa.stock_quantity
      FROM cart ci
      LEFT JOIN products p ON ci.product_id = p.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
      LEFT JOIN product_attributes pa ON ci.product_attribute_id = pa.id
      WHERE ci.id = ?
    `, [itemId]);

    const item = updatedItems[0];
    const updatedItem = {
      id: item.id,
      user_id: item.user_id,
      product_id: item.product_id,
      product_attribute_id: item.product_attribute_id,
      quantity: item.quantity,
      created_at: item.created_at,
      updated_at: item.updated_at,
      product: {
        id: item.product_id,
        name: item.product_name,
        slug: item.product_slug,
        price: item.product_price,
        sale_price: item.product_sale_price,
        primary_image: item.product_primary_image,
      },
      product_attribute: item.product_attribute_id ? {
        id: item.product_attribute_id,
        size: item.size,
        color: item.color,
        stock_quantity: item.stock_quantity,
      } : null,
    };

    res.json({
      success: true,
      data: updatedItem,
      message: 'Đã cập nhật số lượng sản phẩm',
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const itemId = req.params.id;

    // Kiểm tra item thuộc về user
    const [items] = await pool.execute(
      'SELECT * FROM cart WHERE id = ? AND user_id = ?',
      [itemId, userId]
    );

    if (items.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Sản phẩm không tồn tại trong giỏ hàng',
      });
    }

    // Xóa
    await pool.execute(
      'DELETE FROM cart WHERE id = ?',
      [itemId]
    );

    res.json({
      success: true,
      message: 'Đã xóa sản phẩm khỏi giỏ hàng',
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
};

// Xóa tất cả sản phẩm khỏi giỏ hàng
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    await pool.execute(
      'DELETE FROM cart WHERE user_id = ?',
      [userId]
    );

    res.json({
      success: true,
      message: 'Đã xóa tất cả sản phẩm khỏi giỏ hàng',
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
};

// Lấy tổng kết giỏ hàng
const getCartSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const [items] = await pool.execute(`
      SELECT 
        ci.quantity,
        p.price,
        p.sale_price
      FROM cart ci
      LEFT JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
    `, [userId]);

    let totalItems = 0;
    let totalAmount = 0;

    items.forEach(item => {
      const price = item.sale_price || item.price || 0;
      totalItems += item.quantity;
      totalAmount += price * item.quantity;
    });

    const shippingFee = totalAmount < 500000 ? 30000 : 0;
    const discountAmount = 0; // Có thể thêm logic giảm giá
    const finalAmount = totalAmount + shippingFee - discountAmount;

    res.json({
      success: true,
      data: {
        total_items: totalItems,
        total_amount: totalAmount,
        shipping_fee: shippingFee,
        discount_amount: discountAmount,
        final_amount: finalAmount,
      },
    });
  } catch (error) {
    console.error('Get cart summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartSummary,
};
