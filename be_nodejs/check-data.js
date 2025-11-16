const { pool } = require('./config/database');

async function checkData() {
  try {
    console.log('🔍 Checking database data...');
    
    // 1. Kiểm tra products
    console.log('\n1. Products:');
    const [products] = await pool.execute('SELECT id, name FROM products LIMIT 10');
    console.log(products);
    
    // 2. Kiểm tra product_attributes
    console.log('\n2. Product attributes:');
    const [attributes] = await pool.execute('SELECT id, product_id, size, color FROM product_attributes LIMIT 10');
    console.log(attributes);
    
    // 3. Kiểm tra cụ thể product_id = 5
    console.log('\n3. Product ID 5 attributes:');
    const [product5Attributes] = await pool.execute(
      'SELECT id, product_id, size, color, stock_quantity FROM product_attributes WHERE product_id = 5'
    );
    console.log(product5Attributes);
    
    // 4. Kiểm tra attribute_id = 2
    console.log('\n4. Attribute ID 2:');
    const [attribute2] = await pool.execute(
      'SELECT id, product_id, size, color, stock_quantity FROM product_attributes WHERE id = 2'
    );
    console.log(attribute2);
    
    // 5. Kiểm tra users
    console.log('\n5. Users:');
    const [users] = await pool.execute('SELECT id, username, email FROM users LIMIT 5');
    console.log(users);
    
    // 6. Kiểm tra cart hiện tại
    console.log('\n6. Current cart for user 7:');
    const [cart] = await pool.execute('SELECT * FROM cart WHERE user_id = 7');
    console.log(cart);
    
  } catch (error) {
    console.error('❌ Error checking data:', error);
  } finally {
    process.exit(0);
  }
}

checkData();
