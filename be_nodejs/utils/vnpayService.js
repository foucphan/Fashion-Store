const config = require('../config/config');

class VNPayService {
  constructor() {
    // VNPay Configuration from config file
    this.config = {
      tmnCode: config.VNPAY_TMN_CODE,
      secretKey: config.VNPAY_SECRET_KEY,
      vnpUrl: config.VNPAY_URL,
      returnUrl: config.VNPAY_RETURN_URL
    };
    
    console.log('VNPay Config:', this.config);
  }

  // Tạo URL thanh toán VNPay
  createPaymentUrl(orderData) {
    try {
      console.log('VNPayService.createPaymentUrl called with:', orderData);
      
      const {
        orderId,
        amount,
        orderDescription,
        orderType = 'other',
        bankCode = '',
        language = 'vn',
        ipAddr = '127.0.0.1'
      } = orderData;

    // Sử dụng timezone GMT+7 (Vietnam timezone)
    const now = new Date();
    const vietnamTime = new Date(now.getTime() + (7 * 60 * 60 * 1000)); // GMT+7
    
    // Format: YYYYMMDDHHmmss theo timezone Vietnam
    const createDate = vietnamTime.toISOString().replace(/[-:T]/g, '').replace(/\..+/, '');
    
    // Sử dụng thời gian expire từ config
    const expireMinutes = config.VNPAY_EXPIRE_MINUTES || 30;
    const expireTime = new Date(vietnamTime.getTime() + expireMinutes * 60 * 1000);
    const expireDate = expireTime.toISOString().replace(/[-:T]/g, '').replace(/\..+/, '');
    
    console.log('Vietnam Time (GMT+7):', vietnamTime.toISOString());
    console.log('Create Date (YYYYMMDDHHmmss):', createDate);
    console.log('Expire Date (YYYYMMDDHHmmss):', expireDate);
    console.log('Expire Minutes:', expireMinutes);
    console.log('Time difference (minutes):', (new Date(expireDate) - new Date(createDate)) / (1000 * 60));
    console.log('Current Vietnam time:', vietnamTime.toISOString());
    console.log('Expire Vietnam time:', expireTime.toISOString());
    
    // Validate amount (sandbox limit)
    if (amount > 1000000) { // 1M VND limit for sandbox testing
      throw new Error('Số tiền vượt quá giới hạn sandbox (1,000,000 VND)');
    }
    
    console.log('VNPay createPaymentUrl - Amount:', amount, 'VND');
    
    // Ensure amount is a number and convert to cents
    const amountInCents = Math.round(Number(amount) * 100);
    console.log('Amount in cents:', amountInCents);

    // Tạo order info theo format VNPay
    const orderInfo = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.config.tmnCode,
      vnp_Amount: amountInCents, // VNPay yêu cầu số tiền tính bằng xu
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId.toString(),
      vnp_OrderInfo: Buffer.from(orderDescription, 'utf-8').toString('base64'),
      vnp_OrderType: orderType,
      vnp_Locale: language,
      vnp_ReturnUrl: this.config.returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
      vnp_ExpireDate: expireDate
    };

    if (bankCode) {
      orderInfo.vnp_BankCode = bankCode;
    }

    // Sắp xếp các tham số theo thứ tự alphabet
    const sortedParams = Object.keys(orderInfo)
      .sort()
      .reduce((result, key) => {
        result[key] = orderInfo[key];
        return result;
      }, {});

    // Tạo chuỗi để ký
    const querystring = require('querystring');
    const signData = querystring.stringify(sortedParams, null, null, { encodeURIComponent: false });
    
    // Tạo chữ ký
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha512', this.config.secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    
    // Thêm chữ ký vào parameters
    orderInfo.vnp_SecureHash = signed;

    // Tạo URL cuối cùng với encoding đúng
    const vnpayUrl = this.config.vnpUrl + '?' + querystring.stringify(orderInfo, null, null, { encodeURIComponent: true });
    
    console.log('VNPay URL created:', {
      orderId,
      amount,
      amountInCents,
      signData,
      signed,
      url: vnpayUrl,
      orderInfo: orderInfo
    });
    
    // Log each parameter for debugging
    console.log('VNPay Parameters:');
    Object.keys(orderInfo).forEach(key => {
      console.log(`  ${key}: ${orderInfo[key]}`);
    });
    
    // Test URL để debug
    const testUrl = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Version=2.1.0&vnp_Command=pay&vnp_TmnCode=2QXUI4J4&vnp_Amount=5000000&vnp_CurrCode=VND&vnp_TxnRef=TEST123&vnp_OrderInfo=Test&vnp_OrderType=other&vnp_Locale=vn&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A5173%2Fpayment%2Fvnpay%2Freturn&vnp_IpAddr=127.0.0.1&vnp_CreateDate=20251012T140000&vnp_ExpireDate=20251012T141500&vnp_SecureHash=test`;
    
    console.log('Test URL for debugging:', testUrl);
    
    return {
      url: vnpayUrl,
      orderId: orderId,
      amount: amount,
      description: orderDescription
    };
    
    } catch (error) {
      console.error('VNPayService.createPaymentUrl error:', error);
      throw new Error(`Lỗi tạo URL thanh toán VNPay: ${error.message}`);
    }
  }

  // Xác thực kết quả thanh toán từ VNPay
  verifyReturnUrl(query) {
    const crypto = require('crypto');
    const querystring = require('querystring');
    
    console.log('🔐 VNPay Verify - Original query:', query);
    console.log('🔐 VNPay Verify - Secret key:', this.config.secretKey);
    
    const secureHash = query.vnp_SecureHash;
    delete query.vnp_SecureHash;
    delete query.vnp_SecureHashType;

    const signData = querystring.stringify(query, null, null, { encodeURIComponent: false });
    console.log('🔐 VNPay Verify - Sign data:', signData);
    
    const hmac = crypto.createHmac('sha512', this.config.secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    
    console.log('🔐 VNPay Verify - Generated hash:', signed);
    console.log('🔐 VNPay Verify - Received hash:', secureHash);
    console.log('🔐 VNPay Verify - Hash match:', signed === secureHash);

    const result = {
      isValid: signed === secureHash,
      orderId: query.vnp_TxnRef,
      amount: parseInt(query.vnp_Amount) / 100,
      responseCode: query.vnp_ResponseCode,
      transactionNo: query.vnp_TransactionNo,
      bankCode: query.vnp_BankCode,
      payDate: query.vnp_PayDate
    };
    
    console.log('🔐 VNPay Verify - Result:', result);
    return result;
  }

  // Lấy danh sách ngân hàng hỗ trợ
  getSupportedBanks() {
    return [
      { code: 'NCB', name: 'Ngân hàng Quốc Dân (NCB)' },
      { code: 'VIETCOMBANK', name: 'Ngân hàng TMCP Ngoại Thương Việt Nam' },
      { code: 'VIETINBANK', name: 'Ngân hàng TMCP Công Thương Việt Nam' },
      { code: 'BIDV', name: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam' },
      { code: 'AGRIBANK', name: 'Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam' },
      { code: 'SACOMBANK', name: 'Ngân hàng TMCP Sài Gòn Thương Tín' },
      { code: 'TECHCOMBANK', name: 'Ngân hàng TMCP Kỹ thương Việt Nam' },
      { code: 'ACB', name: 'Ngân hàng TMCP Á Châu' },
      { code: 'DONGABANK', name: 'Ngân hàng TMCP Đông Á' },
      { code: 'EXIMBANK', name: 'Ngân hàng TMCP Xuất Nhập khẩu Việt Nam' },
      { code: 'HDBANK', name: 'Ngân hàng TMCP Phát triển Thành phố Hồ Chí Minh' },
      { code: 'MBBANK', name: 'Ngân hàng TMCP Quân đội' },
      { code: 'OCB', name: 'Ngân hàng TMCP Phương Đông' },
      { code: 'TPBANK', name: 'Ngân hàng TMCP Tiên Phong' },
      { code: 'VIB', name: 'Ngân hàng TMCP Quốc tế Việt Nam' },
      { code: 'VPBANK', name: 'Ngân hàng TMCP Việt Nam Thịnh Vượng' }
    ];
  }
}

module.exports = new VNPayService();
