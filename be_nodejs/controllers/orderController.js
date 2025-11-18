const { pool } = require('../config/database');

// Tạo đơn hàng mới
const createOrder = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const userId = req.user.id;
    const { 
      items, 
      shipping_info, 
      payment_info, 
      total_amount, 
      shipping_fee, 
      discount_amount 
    } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Giỏ hàng không được trống'
      });
    }

    if (!shipping_info || !shipping_info.fullName || !shipping_info.phone || !shipping_info.address) {
      return res.status(400).json({
        success: false,
        message: 'Thông tin giao hàng không đầy đủ'
      });
    }

    await connection.beginTransaction();

    try {
      // Tạo mã đơn hàng
      const orderCode = `ORD${Date.now()}`;
      
      // Tạo địa chỉ giao hàng mới
      const [addressResult] = await connection.execute(`
        INSERT INTO user_addresses (
          user_id,
          full_name,
          phone,
          address,
          ward,
          district,
          province,
          is_default
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        userId,
        shipping_info.fullName,
        shipping_info.phone,
        shipping_info.address,
        shipping_info.ward,
        shipping_info.district,
        shipping_info.city,
        false // Không phải địa chỉ mặc định
      ]);
      
      const userAddressId = addressResult.insertId;
      
      // Tạo đơn hàng
      const [orderResult] = await connection.execute(`
        INSERT INTO orders (
          order_code,
          user_id, 
          user_address_id,
          total_amount, 
          shipping_fee, 
          discount_amount, 
          final_amount,
          payment_method,
          payment_status,
          order_status,
          notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        orderCode,
        userId,
        userAddressId,
        total_amount,
        shipping_fee || 0,
        discount_amount || 0,
        total_amount + (shipping_fee || 0) - (discount_amount || 0),
        payment_info.method,
        payment_info.method === 'cod' ? 'pending' : 'pending',
        'pending',
        shipping_info.note || ''
      ]);

      const orderId = orderResult.insertId;

      // Tạo chi tiết đơn hàng
      for (const item of items) {
        const itemPrice = item.product?.sale_price || item.product?.price || 0;
        const itemTotal = itemPrice * item.quantity;
        
        await connection.execute(`
          INSERT INTO order_items (
            order_id,
            product_id,
            product_attribute_id,
            product_name,
            product_sku,
            product_image,
            price,
            quantity,
            total_amount
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          orderId,
          item.product_id,
          item.product_attribute_id,
          item.product?.name || 'Sản phẩm',
          item.product?.sku || `SKU-${item.product_id}`,
          item.product?.primary_image || '',
          itemPrice,
          item.quantity,
          itemTotal
        ]);
      }

      // Xóa giỏ hàng sau khi tạo đơn hàng thành công
      await connection.execute(
        'DELETE FROM cart WHERE user_id = ?',
        [userId]
      );

      await connection.commit();

      // Lấy thông tin đơn hàng vừa tạo
      const [orderDetails] = await connection.execute(`
        SELECT 
          o.*,
          ua.full_name,
          ua.phone,
          ua.address,
          ua.ward,
          ua.district,
          ua.province,
          oi.id as item_id,
          oi.product_id,
          oi.product_attribute_id,
          oi.quantity,
          oi.price,
          oi.product_name,
          oi.product_sku,
          oi.product_image,
          pa.size,
          pa.color
        FROM orders o
        LEFT JOIN user_addresses ua ON o.user_address_id = ua.id
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN product_attributes pa ON oi.product_attribute_id = pa.id
        WHERE o.id = ?
        ORDER BY oi.id
      `, [orderId]);

      // Format response
      const order = {
        id: orderDetails[0].id,
        order_number: orderDetails[0].order_code,
        status: orderDetails[0].order_status,
        total_amount: orderDetails[0].total_amount,
        shipping_fee: orderDetails[0].shipping_fee,
        discount_amount: orderDetails[0].discount_amount,
        final_amount: orderDetails[0].final_amount,
        payment_method: orderDetails[0].payment_method,
        payment_status: orderDetails[0].payment_status,
        shipping_info: {
          name: orderDetails[0].full_name,
          phone: orderDetails[0].phone,
          address: orderDetails[0].address,
          city: orderDetails[0].province,
          district: orderDetails[0].district,
          ward: orderDetails[0].ward,
          note: orderDetails[0].notes
        },
        items: orderDetails.map(item => ({
          id: item.item_id,
          product_id: item.product_id,
          product_attribute_id: item.product_attribute_id,
          quantity: item.quantity,
          price: item.price,
          product: {
            name: item.product_name,
            sku: item.product_sku,
            image: item.product_image
          },
          product_attribute: item.product_attribute_id ? {
            size: item.size,
            color: item.color
          } : null
        })),
        created_at: orderDetails[0].created_at
      };

      res.json({
        success: true,
        data: order,
        message: 'Đặt hàng thành công'
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    }

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo đơn hàng'
    });
  } finally {
    connection.release();
  }
};

// Lấy danh sách đơn hàng của user
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE o.user_id = ?';
    let params = [userId];

    if (status) {
      whereClause += ' AND o.order_status = ?';
      params.push(status);
    }

    const [orders] = await pool.execute(`
      SELECT 
        o.id,
        o.order_code,
        o.order_status,
        o.total_amount,
        o.shipping_fee,
        o.discount_amount,
        o.final_amount,
        o.payment_method,
        o.payment_status,
        o.notes,
        o.created_at,
        ua.full_name,
        ua.phone,
        ua.address,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN user_addresses ua ON o.user_address_id = ua.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      ${whereClause}
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), offset]);

    const [totalCount] = await pool.execute(`
      SELECT COUNT(*) as total
      FROM orders o
      ${whereClause}
    `, params);

    res.json({
      success: true,
      data: {
        orders: orders.map(order => ({
          id: order.id,
          order_number: order.order_code,
          status: order.order_status,
          total_amount: order.total_amount,
          shipping_fee: order.shipping_fee,
          discount_amount: order.discount_amount,
          final_amount: order.final_amount,
          payment_method: order.payment_method,
          payment_status: order.payment_status,
          notes: order.notes,
          shipping_name: order.full_name,
          shipping_phone: order.phone,
          shipping_address: order.address,
          item_count: order.item_count,
          created_at: order.created_at
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount[0].total,
          pages: Math.ceil(totalCount[0].total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// Lấy chi tiết đơn hàng
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [orderDetails] = await pool.execute(`
      SELECT 
        o.*,
        ua.full_name,
        ua.phone,
        ua.address,
        ua.ward,
        ua.district,
        ua.province,
        oi.id as item_id,
        oi.product_id,
        oi.product_attribute_id,
        oi.quantity,
        oi.price,
        oi.product_name,
        oi.product_sku,
        oi.product_image,
        pa.size,
        pa.color
      FROM orders o
      LEFT JOIN user_addresses ua ON o.user_address_id = ua.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN product_attributes pa ON oi.product_attribute_id = pa.id
      WHERE o.id = ? AND o.user_id = ?
      ORDER BY oi.id
    `, [id, userId]);

    if (orderDetails.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    // Format response
    const order = {
      id: orderDetails[0].id,
      order_number: orderDetails[0].order_code,
      status: orderDetails[0].order_status,
      total_amount: orderDetails[0].total_amount,
      shipping_fee: orderDetails[0].shipping_fee,
      discount_amount: orderDetails[0].discount_amount,
      final_amount: orderDetails[0].final_amount,
      payment_method: orderDetails[0].payment_method,
      payment_status: orderDetails[0].payment_status,
      notes: orderDetails[0].notes,
      shipping_info: {
        name: orderDetails[0].full_name,
        phone: orderDetails[0].phone,
        address: orderDetails[0].address,
        city: orderDetails[0].province,
        district: orderDetails[0].district,
        ward: orderDetails[0].ward,
        note: orderDetails[0].notes
      },
      items: orderDetails.map(item => ({
        id: item.item_id,
        product_id: item.product_id,
        product_attribute_id: item.product_attribute_id,
        quantity: item.quantity,
        price: item.price,
        product: {
          name: item.product_name,
          sku: item.product_sku,
          image: item.product_image
        },
        product_attribute: item.product_attribute_id ? {
          size: item.size,
          color: item.color
        } : null
      })),
      created_at: orderDetails[0].created_at,
      updated_at: orderDetails[0].updated_at
    };

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Get order by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// Hủy đơn hàng
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [result] = await pool.execute(`
      UPDATE orders 
      SET order_status = 'cancelled', updated_at = NOW()
      WHERE id = ? AND user_id = ? AND order_status = 'pending'
    `, [id, userId]);

    if (result.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không thể hủy đơn hàng này'
      });
    }

    res.json({
      success: true,
      message: 'Đã hủy đơn hàng'
    });

  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder
};
