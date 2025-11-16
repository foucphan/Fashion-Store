const db = require('./config/database');

async function checkAndCreateCartTable() {
  try {
    // Kiểm tra xem bảng cart có tồn tại không
    const [tables] = await db.execute("SHOW TABLES LIKE 'cart'");
    
    if (tables.length === 0) {
      console.log('Bảng cart không tồn tại, đang tạo...');
      
      // Tạo bảng cart theo schema
      await db.execute(`
        CREATE TABLE cart (
          id INT PRIMARY KEY AUTO_INCREMENT,
          user_id INT NOT NULL,
          product_id INT NOT NULL,
          product_attribute_id INT NULL,
          quantity INT NOT NULL DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
          FOREIGN KEY (product_attribute_id) REFERENCES product_attributes(id) ON DELETE SET NULL,
          UNIQUE KEY unique_cart_item (user_id, product_id, product_attribute_id)
        )
      `);
      
      console.log('✅ Đã tạo bảng cart thành công');
    } else {
      console.log('✅ Bảng cart đã tồn tại');
    }
    
    // Kiểm tra xem bảng product_attributes có tồn tại không
    const [attrTables] = await db.execute("SHOW TABLES LIKE 'product_attributes'");
    
    if (attrTables.length === 0) {
      console.log('Bảng product_attributes không tồn tại, đang tạo...');
      
      // Tạo bảng product_attributes theo schema
      await db.execute(`
        CREATE TABLE product_attributes (
          id INT PRIMARY KEY AUTO_INCREMENT,
          product_id INT NOT NULL,
          size VARCHAR(20),
          color VARCHAR(50),
          stock_quantity INT DEFAULT 0,
          sku_variant VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
          UNIQUE KEY unique_product_variant (product_id, size, color)
        )
      `);
      
      console.log('✅ Đã tạo bảng product_attributes thành công');
    } else {
      console.log('✅ Bảng product_attributes đã tồn tại');
    }
    
    // Kiểm tra xem bảng product_images có tồn tại không
    const [imgTables] = await db.execute("SHOW TABLES LIKE 'product_images'");
    
    if (imgTables.length === 0) {
      console.log('Bảng product_images không tồn tại, đang tạo...');
      
      // Tạo bảng product_images theo schema
      await db.execute(`
        CREATE TABLE product_images (
          id INT PRIMARY KEY AUTO_INCREMENT,
          product_id INT NOT NULL,
          image_url VARCHAR(255) NOT NULL,
          alt_text VARCHAR(200),
          is_primary BOOLEAN DEFAULT FALSE,
          sort_order INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        )
      `);
      
      console.log('✅ Đã tạo bảng product_images thành công');
    } else {
      console.log('✅ Bảng product_images đã tồn tại');
    }
    
    console.log('🎉 Kiểm tra và tạo bảng hoàn tất!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
}

checkAndCreateCartTable();
