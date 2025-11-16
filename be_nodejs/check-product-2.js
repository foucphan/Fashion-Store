const { pool } = require('./config/database');

async function checkProduct2() {
  try {
    console.log('🔍 Checking Product ID 2 attributes...');
    
    // Kiểm tra product 2
    const [product] = await pool.execute('SELECT id, name FROM products WHERE id = 2');
    console.log('Product 2:', product);
    
    // Kiểm tra attributes của product 2
    const [attributes] = await pool.execute(
      'SELECT id, product_id, size, color, stock_quantity FROM product_attributes WHERE product_id = 2'
    );
    console.log('Product 2 attributes:', attributes);
    
    // Kiểm tra attribute ID 2 thuộc về product nào
    const [attribute2] = await pool.execute(
      'SELECT id, product_id, size, color FROM product_attributes WHERE id = 2'
    );
    console.log('Attribute ID 2 belongs to:', attribute2);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

checkProduct2();
