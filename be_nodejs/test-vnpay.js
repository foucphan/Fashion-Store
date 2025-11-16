const vnpayService = require('./utils/vnpayService');

console.log('Testing VNPay Service...');

try {
  // Test data
  const testData = {
    orderId: 'TEST123456',
    amount: 50000, // 50,000 VND
    orderDescription: 'Test payment',
    bankCode: ''
  };

  console.log('Test data:', testData);
  
  // Create payment URL
  const result = vnpayService.createPaymentUrl(testData);
  
  console.log('VNPay URL created successfully:');
  console.log('URL:', result.url);
  console.log('Order ID:', result.orderId);
  console.log('Amount:', result.amount);
  
} catch (error) {
  console.error('VNPay Error:', error.message);
  console.error('Stack:', error.stack);
}
