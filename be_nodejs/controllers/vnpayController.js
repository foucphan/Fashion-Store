const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const vnpayService = require('../utils/vnpayService');

// Tạo URL thanh toán VNPay
const createPaymentUrl = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId, amount, orderDescription, bankCode } = req.body;

    console.log('VNPay createPaymentUrl request:', { userId, orderId, amount, orderDescription, bankCode });

    if (!orderId || !amount || !orderDescription) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc'
      });
    }

    // Kiểm tra đơn hàng có tồn tại không
    const [orders] = await pool.execute(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [orderId, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Đơn hàng không tồn tại'
      });
    }

    const order = orders[0];

    // Tạo URL thanh toán VNPay
    const paymentData = {
      orderId: order.order_code,
      amount: amount,
      orderDescription: orderDescription,
      bankCode: bankCode || ''
    };

    console.log('Creating VNPay payment URL with data:', paymentData);
    const paymentUrl = vnpayService.createPaymentUrl(paymentData);
    console.log('VNPay payment URL created:', paymentUrl);

    // Lưu thông tin thanh toán vào database (tùy chọn)
    await pool.execute(
      'UPDATE orders SET payment_method = ?, payment_status = ? WHERE id = ?',
      ['vnpay', 'pending', orderId]
    );

    res.json({
      success: true,
      data: {
        paymentUrl: paymentUrl.url,
        orderId: paymentUrl.orderId,
        amount: paymentUrl.amount,
        description: paymentUrl.description
      },
      message: 'Tạo URL thanh toán thành công'
    });

  } catch (error) {
    console.error('Create VNPay payment URL error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo URL thanh toán'
    });
  }
};

// Xử lý kết quả thanh toán từ VNPay
const handlePaymentReturn = async (req, res) => {
  try {
    const query = req.query;
    
    console.log('🔐 VNPay Return - Query params:', query);
    console.log('🔐 VNPay Return - ResponseCode:', query.vnp_ResponseCode);
    console.log('🔐 VNPay Return - TxnRef:', query.vnp_TxnRef);
    console.log('🔐 VNPay Return - Amount:', query.vnp_Amount);
    console.log('🔐 VNPay Return - TransactionNo:', query.vnp_TransactionNo);
    console.log('🔐 VNPay Return - SecureHash:', query.vnp_SecureHash);
    
    // Xác thực kết quả thanh toán
    const result = vnpayService.verifyReturnUrl(query);
    console.log('🔐 VNPay Return - Verification result:', result);

    if (!result.isValid) {
      console.log('❌ VNPay Return - Invalid signature');
      return res.status(400).json({
        success: false,
        message: 'Chữ ký không hợp lệ'
      });
    }

    // Tìm đơn hàng theo order_code
    const [orders] = await pool.execute(
      'SELECT * FROM orders WHERE order_code = ?',
      [result.orderId]
    );

    console.log('🔐 VNPay Return - Found orders:', orders.length);

    if (orders.length === 0) {
      console.log('❌ VNPay Return - Order not found:', result.orderId);
      return res.status(404).json({
        success: false,
        message: 'Đơn hàng không tồn tại'
      });
    }

    const order = orders[0];
    console.log('🔐 VNPay Return - Order found:', order);

    // Cập nhật trạng thái thanh toán
    if (result.responseCode === '00') {
      console.log('✅ VNPay Return - Payment successful, updating order status');
      // Thanh toán thành công
      await pool.execute(
        'UPDATE orders SET payment_status = ?, order_status = ? WHERE id = ?',
        ['paid', 'confirmed', order.id]
      );

      console.log('✅ VNPay Return - Order status updated successfully');

      res.json({
        success: true,
        message: 'Thanh toán thành công',
        data: {
          orderId: result.orderId,
          amount: result.amount,
          transactionNo: result.transactionNo,
          bankCode: result.bankCode,
          payDate: result.payDate
        }
      });
    } else {
      console.log('❌ VNPay Return - Payment failed, response code:', result.responseCode);
      // Thanh toán thất bại
      await pool.execute(
        'UPDATE orders SET payment_status = ? WHERE id = ?',
        ['failed', order.id]
      );

      res.json({
        success: false,
        message: 'Thanh toán thất bại',
        data: {
          orderId: result.orderId,
          responseCode: result.responseCode
        }
      });
    }

  } catch (error) {
    console.error('❌ Handle VNPay payment return error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xử lý kết quả thanh toán'
    });
  }
};

// Lấy danh sách ngân hàng hỗ trợ VNPay
const getSupportedBanks = async (req, res) => {
  try {
    const banks = vnpayService.getSupportedBanks();
    
    res.json({
      success: true,
      data: banks
    });
  } catch (error) {
    console.error('Get supported banks error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách ngân hàng'
    });
  }
};

// Kiểm tra trạng thái thanh toán
const checkPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const [orders] = await pool.execute(
      'SELECT * FROM orders WHERE order_code = ? AND user_id = ?',
      [orderId, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Đơn hàng không tồn tại'
      });
    }

    const order = orders[0];

    res.json({
      success: true,
      data: {
        orderId: order.order_code,
        paymentStatus: order.payment_status,
        orderStatus: order.order_status,
        amount: order.final_amount,
        paymentMethod: order.payment_method
      }
    });

  } catch (error) {
    console.error('Check payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi kiểm tra trạng thái thanh toán'
    });
  }
};

module.exports = {
  createPaymentUrl,
  handlePaymentReturn,
  getSupportedBanks,
  checkPaymentStatus
};