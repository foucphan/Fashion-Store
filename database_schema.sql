/*
 Navicat Premium Dump SQL

 Source Server         : mysq8
 Source Server Type    : MySQL
 Source Server Version : 80403 (8.4.3)
 Source Host           : localhost:3318
 Source Schema         : ban_quan_ao_db

 Target Server Type    : MySQL
 Target Server Version : 80403 (8.4.3)
 File Encoding         : 65001

 Date: 18/11/2025 10:46:36
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for activity_logs
-- ----------------------------
DROP TABLE IF EXISTS `activity_logs`;
CREATE TABLE `activity_logs`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NULL DEFAULT NULL,
  `action` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `table_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `record_id` int NULL DEFAULT NULL,
  `old_values` json NULL,
  `new_values` json NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of activity_logs
-- ----------------------------
INSERT INTO `activity_logs` VALUES (1, 2, 'CREATE', 'users', 2, NULL, '{\"email\": \"john@example.com\", \"username\": \"john_doe\"}', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2025-11-13 10:52:28');
INSERT INTO `activity_logs` VALUES (2, 2, 'CREATE', 'cart', 1, NULL, '{\"quantity\": 2, \"product_id\": 1}', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2025-11-13 10:52:28');
INSERT INTO `activity_logs` VALUES (3, 2, 'CREATE', 'orders', 1, NULL, '{\"order_code\": \"ORD001\", \"total_amount\": 760000}', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2025-11-13 10:52:28');
INSERT INTO `activity_logs` VALUES (4, 3, 'CREATE', 'orders', 2, NULL, '{\"order_code\": \"ORD002\", \"total_amount\": 1300000}', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '2025-11-13 10:52:28');
INSERT INTO `activity_logs` VALUES (5, 3, 'CREATE', 'product_reviews', 1, NULL, '{\"rating\": 4, \"product_id\": 1}', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '2025-11-13 10:52:28');
INSERT INTO `activity_logs` VALUES (6, 4, 'UPDATE', 'users', 4, '{\"phone\": \"0369852147\"}', '{\"phone\": \"0369852148\"}', '192.168.1.102', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36', '2025-11-13 10:52:28');
INSERT INTO `activity_logs` VALUES (7, 4, 'CREATE', 'wishlist', 9, NULL, '{\"product_id\": 1}', '192.168.1.102', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36', '2025-11-13 10:52:28');
INSERT INTO `activity_logs` VALUES (8, 5, 'CREATE', 'orders', 4, NULL, '{\"order_code\": \"ORD004\", \"total_amount\": 450000}', '192.168.1.103', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15', '2025-11-13 10:52:28');
INSERT INTO `activity_logs` VALUES (9, 6, 'CREATE', 'orders', 5, NULL, '{\"order_code\": \"ORD005\", \"total_amount\": 2000000}', '192.168.1.104', 'Mozilla/5.0 (Android 10; Mobile; rv:68.0) Gecko/68.0 Firefox/68.0', '2025-11-13 10:52:28');
INSERT INTO `activity_logs` VALUES (10, 1, 'UPDATE', 'products', 1, '{\"price\": 450000}', '{\"price\": 380000}', '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '2025-11-13 10:52:28');

-- ----------------------------
-- Table structure for brands
-- ----------------------------
DROP TABLE IF EXISTS `brands`;
CREATE TABLE `brands`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `slug` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `logo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `website` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `is_active` tinyint(1) NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `slug`(`slug` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of brands
-- ----------------------------
INSERT INTO `brands` VALUES (1, 'Nike', 'nike', 'https://via.placeholder.com/150x80/FF6B6B/FFFFFF?text=Nike', 'Thương hiệu thể thao hàng đầu thế giới', 'https://nike.com', 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `brands` VALUES (2, 'Adidas', 'adidas', 'https://via.placeholder.com/150x80/4ECDC4/FFFFFF?text=Adidas', 'Thương hiệu thể thao nổi tiếng', 'https://adidas.com', 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `brands` VALUES (3, 'Uniqlo', 'uniqlo', 'https://via.placeholder.com/150x80/45B7D1/FFFFFF?text=Uniqlo', 'Thương hiệu thời trang Nhật Bản', 'https://uniqlo.com', 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `brands` VALUES (4, 'Zara', 'zara', 'https://via.placeholder.com/150x80/96CEB4/FFFFFF?text=Zara', 'Thương hiệu thời trang Tây Ban Nha', 'https://zara.com', 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `brands` VALUES (5, 'H&M', 'hm', 'https://via.placeholder.com/150x80/FFEAA7/FFFFFF?text=H%26M', 'Thương hiệu thời trang Thụy Điển', 'https://hm.com', 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `brands` VALUES (6, 'Gucci', 'gucci', 'https://via.placeholder.com/150x80/DDA0DD/FFFFFF?text=Gucci', 'Thương hiệu thời trang cao cấp', 'https://gucci.com', 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `brands` VALUES (7, 'Louis Vuitton', 'louis-vuitton', 'https://via.placeholder.com/150x80/82E0AA/FFFFFF?text=LV', 'Thương hiệu thời trang xa xỉ', 'https://louisvuitton.com', 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `brands` VALUES (8, 'Chanel', 'chanel', 'https://via.placeholder.com/150x80/F8C471/FFFFFF?text=Chanel', 'Thương hiệu thời trang cao cấp', 'https://chanel.com', 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');

-- ----------------------------
-- Table structure for cart
-- ----------------------------
DROP TABLE IF EXISTS `cart`;
CREATE TABLE `cart`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `product_attribute_id` int NULL DEFAULT NULL,
  `quantity` int NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique_cart_item`(`user_id` ASC, `product_id` ASC, `product_attribute_id` ASC) USING BTREE,
  INDEX `product_id`(`product_id` ASC) USING BTREE,
  INDEX `product_attribute_id`(`product_attribute_id` ASC) USING BTREE,
  INDEX `idx_cart_user`(`user_id` ASC) USING BTREE,
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `cart_ibfk_3` FOREIGN KEY (`product_attribute_id`) REFERENCES `product_attributes` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of cart
-- ----------------------------
INSERT INTO `cart` VALUES (3, 3, 5, 13, 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `cart` VALUES (4, 3, 6, 19, 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `cart` VALUES (5, 3, 15, 35, 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `cart` VALUES (6, 4, 9, 25, 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `cart` VALUES (7, 4, 19, 45, 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `cart` VALUES (8, 5, 12, 32, 2, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `cart` VALUES (9, 5, 16, 42, 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `cart` VALUES (10, 6, 18, 48, 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `cart` VALUES (11, 6, 20, 54, 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');

-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `slug` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `parent_id` int NULL DEFAULT NULL,
  `is_active` tinyint(1) NULL DEFAULT 1,
  `sort_order` int NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `slug`(`slug` ASC) USING BTREE,
  INDEX `parent_id`(`parent_id` ASC) USING BTREE,
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 21 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of categories
-- ----------------------------
INSERT INTO `categories` VALUES (1, 'Áo Nam', 'ao-nams', 'Các loại áo dành cho nam giới', 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Ao+Nam', NULL, 1, 1, '2025-11-13 10:52:28', '2025-11-13 11:25:14');
INSERT INTO `categories` VALUES (2, 'Áo Nữ', 'ao-nu', 'Các loại áo dành cho nữ giới', 'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Ao+Nu', NULL, 1, 2, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `categories` VALUES (3, 'Quần Nam', 'quan-nam', 'Các loại quần dành cho nam giới', 'https://via.placeholder.com/300x200/45B7D1/FFFFFF?text=Quan+Nam', NULL, 1, 3, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `categories` VALUES (4, 'Quần Nữ', 'quan-nu', 'Các loại quần dành cho nữ giới', 'https://via.placeholder.com/300x200/96CEB4/FFFFFF?text=Quan+Nu', NULL, 1, 4, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `categories` VALUES (5, 'Váy', 'vay', 'Các loại váy dành cho nữ giới', 'https://via.placeholder.com/300x200/FFEAA7/FFFFFF?text=Vay', NULL, 1, 5, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `categories` VALUES (6, 'Phụ Kiện', 'phu-kien', 'Các phụ kiện thời trang', 'https://via.placeholder.com/300x200/DDA0DD/FFFFFF?text=Phu+Kien', NULL, 1, 6, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `categories` VALUES (7, 'Áo Thun Nam', 'ao-thun-nam', 'Áo thun dành cho nam', 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Ao+Thun+Nam', 1, 1, 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `categories` VALUES (8, 'Áo Sơ Mi Nam', 'ao-so-mi-nam', 'Áo sơ mi dành cho nam', 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Ao+So+Mi+Nam', 1, 1, 2, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `categories` VALUES (9, 'Áo Hoodie Nam', 'ao-hoodie-nam', 'Áo hoodie dành cho nam', 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Ao+Hoodie+Nam', 1, 1, 3, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `categories` VALUES (10, 'Áo Thun Nữ', 'ao-thun-nu', 'Áo thun dành cho nữ', 'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Ao+Thun+Nu', 2, 1, 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `categories` VALUES (11, 'Áo Blouse Nữ', 'ao-blouse-nu', 'Áo blouse dành cho nữ', 'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Ao+Blouse+Nu', 2, 1, 2, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `categories` VALUES (12, 'Áo Len Nữ', 'ao-len-nu', 'Áo len dành cho nữ', 'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Ao+Len+Nu', 2, 1, 3, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `categories` VALUES (13, 'Quần Jeans Nam', 'quan-jeans-nam', 'Quần jeans dành cho nam', 'https://via.placeholder.com/300x200/45B7D1/FFFFFF?text=Quan+Jeans+Nam', 3, 1, 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `categories` VALUES (14, 'Quần Short Nam', 'quan-short-nam', 'Quần short dành cho nam', 'https://via.placeholder.com/300x200/45B7D1/FFFFFF?text=Quan+Short+Nam', 3, 1, 2, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `categories` VALUES (15, 'Quần Jeans Nữ', 'quan-jeans-nu', 'Quần jeans dành cho nữ', 'https://via.placeholder.com/300x200/96CEB4/FFFFFF?text=Quan+Jeans+Nu', 4, 1, 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `categories` VALUES (16, 'Quần Short Nữ', 'quan-short-nu', 'Quần short dành cho nữ', 'https://via.placeholder.com/300x200/96CEB4/FFFFFF?text=Quan+Short+Nu', 4, 1, 2, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `categories` VALUES (17, 'Váy Dài', 'vay-dai', 'Váy dài dành cho nữ', 'https://via.placeholder.com/300x200/FFEAA7/FFFFFF?text=Vay+Dai', 5, 1, 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `categories` VALUES (18, 'Váy Ngắn', 'vay-ngan', 'Váy ngắn dành cho nữ', 'https://via.placeholder.com/300x200/FFEAA7/FFFFFF?text=Vay+Ngan', 5, 1, 2, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `categories` VALUES (19, 'Túi Xách', 'tui-xach', 'Túi xách thời trang', 'https://via.placeholder.com/300x200/DDA0DD/FFFFFF?text=Tui+Xach', 6, 1, 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `categories` VALUES (20, 'Giày Dép', 'giay-dep', 'Giày dép thời trang', 'https://via.placeholder.com/300x200/DDA0DD/FFFFFF?text=Giay+Dep', 6, 1, 2, '2025-11-13 10:52:28', '2025-11-13 10:52:28');

-- ----------------------------
-- Table structure for coupons
-- ----------------------------
DROP TABLE IF EXISTS `coupons`;
CREATE TABLE `coupons`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `type` enum('percentage','fixed_amount','free_shipping') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `value` decimal(10, 2) NOT NULL,
  `min_order_amount` decimal(10, 2) NULL DEFAULT 0.00,
  `max_discount_amount` decimal(10, 2) NULL DEFAULT NULL,
  `usage_limit` int NULL DEFAULT NULL,
  `used_count` int NULL DEFAULT 0,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `is_active` tinyint(1) NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `code`(`code` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of coupons
-- ----------------------------
INSERT INTO `coupons` VALUES (1, 'WELCOME10', 'Chào mừng khách hàng mới', 'Giảm 10% cho đơn hàng đầu tiên của khách hàng mới', 'percentage', 10.00, 500000.00, 100000.00, 100, 5, '2025-11-13 10:52:28', '2025-12-13 10:52:28', 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `coupons` VALUES (2, 'FREESHIP', 'Miễn phí vận chuyển', 'Miễn phí vận chuyển cho đơn hàng từ 300k', 'free_shipping', 0.00, 300000.00, NULL, 50, 12, '2025-11-13 10:52:28', '2025-11-28 10:52:28', 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `coupons` VALUES (3, 'SAVE50K', 'Tiết kiệm 50k', 'Giảm 50k cho đơn hàng từ 1 triệu', 'fixed_amount', 50000.00, 1000000.00, 50000.00, 20, 3, '2025-11-13 10:52:28', '2025-11-20 10:52:28', 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `coupons` VALUES (4, 'SUMMER20', 'Giảm giá mùa hè', 'Giảm 20% cho tất cả sản phẩm mùa hè', 'percentage', 20.00, 0.00, 200000.00, 200, 25, '2025-11-13 10:52:28', '2026-01-12 10:52:28', 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `coupons` VALUES (5, 'VIP15', 'Khách hàng VIP', 'Giảm 15% cho khách hàng VIP', 'percentage', 15.00, 2000000.00, 300000.00, 10, 2, '2025-11-13 10:52:28', '2026-02-11 10:52:28', 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `coupons` VALUES (6, 'NEWYEAR30', 'Chào năm mới', 'Giảm 30% cho đơn hàng năm mới', 'percentage', 30.00, 1000000.00, 500000.00, 50, 8, '2025-11-13 10:52:28', '2025-12-28 10:52:28', 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');

-- ----------------------------
-- Table structure for notifications
-- ----------------------------
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NULL DEFAULT NULL,
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `type` enum('order','promotion','product','system') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `is_read` tinyint(1) NULL DEFAULT 0,
  `data` json NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_notifications_user`(`user_id` ASC) USING BTREE,
  INDEX `idx_notifications_read`(`is_read` ASC) USING BTREE,
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of notifications
-- ----------------------------
INSERT INTO `notifications` VALUES (1, 2, 'Chào mừng bạn đến với cửa hàng!', 'Cảm ơn bạn đã đăng ký tài khoản. Chúc bạn mua sắm vui vẻ!', 'system', 0, '{\"welcome\": true}', '2025-11-13 10:52:28');
INSERT INTO `notifications` VALUES (2, 3, 'Đơn hàng đã được xác nhận', 'Đơn hàng #ORD002 của bạn đã được xác nhận và đang được chuẩn bị.', 'order', 0, '{\"order_id\": 2, \"order_code\": \"ORD002\"}', '2025-11-13 10:52:28');
INSERT INTO `notifications` VALUES (3, 4, 'Sản phẩm yêu thích đang giảm giá', 'Quần jeans Nike mà bạn yêu thích đang được giảm giá 20%!', 'product', 0, '{\"discount\": 20, \"product_id\": 9}', '2025-11-13 10:52:28');
INSERT INTO `notifications` VALUES (4, 5, 'Khuyến mãi mùa hè', 'Tất cả sản phẩm mùa hè đang được giảm giá lên đến 30%!', 'promotion', 0, '{\"discount\": 30, \"promotion_id\": \"SUMMER20\"}', '2025-11-13 10:52:28');
INSERT INTO `notifications` VALUES (5, 6, 'Sản phẩm mới', 'Bộ sưu tập mới của Gucci đã có mặt tại cửa hàng!', 'product', 0, '{\"brand\": \"Gucci\", \"new_collection\": true}', '2025-11-13 10:52:28');
INSERT INTO `notifications` VALUES (6, 2, 'Đơn hàng đã giao thành công', 'Đơn hàng #ORD001 của bạn đã được giao thành công. Cảm ơn bạn!', 'order', 1, '{\"order_id\": 1, \"order_code\": \"ORD001\"}', '2025-11-13 10:52:28');
INSERT INTO `notifications` VALUES (7, 3, 'Đánh giá sản phẩm', 'Bạn đã mua sản phẩm này. Hãy đánh giá để giúp khách hàng khác!', 'product', 0, '{\"product_id\": 6, \"review_request\": true}', '2025-11-13 10:52:28');
INSERT INTO `notifications` VALUES (8, 4, 'Thanh toán thành công', 'Thanh toán cho đơn hàng #ORD003 đã thành công.', 'order', 0, '{\"order_id\": 3, \"order_code\": \"ORD003\"}', '2025-11-13 10:52:28');
INSERT INTO `notifications` VALUES (9, 5, 'Đơn hàng đã giao thành công', 'Đơn hàng #ORD004 của bạn đã được giao thành công.', 'order', 1, '{\"order_id\": 4, \"order_code\": \"ORD004\"}', '2025-11-13 10:52:28');
INSERT INTO `notifications` VALUES (10, 6, 'Đơn hàng đang vận chuyển', 'Đơn hàng #ORD005 của bạn đang được vận chuyển.', 'order', 0, '{\"order_id\": 5, \"order_code\": \"ORD005\"}', '2025-11-13 10:52:28');

-- ----------------------------
-- Table structure for order_items
-- ----------------------------
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `product_attribute_id` int NULL DEFAULT NULL,
  `product_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `product_sku` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `product_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `price` decimal(10, 2) NOT NULL,
  `quantity` int NOT NULL,
  `total_amount` decimal(10, 2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `order_id`(`order_id` ASC) USING BTREE,
  INDEX `product_id`(`product_id` ASC) USING BTREE,
  INDEX `product_attribute_id`(`product_attribute_id` ASC) USING BTREE,
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `order_items_ibfk_3` FOREIGN KEY (`product_attribute_id`) REFERENCES `product_attributes` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 20 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of order_items
-- ----------------------------
INSERT INTO `order_items` VALUES (1, 1, 1, 2, 'Áo Thun Nam Nike Dri-FIT', 'NIKE-AT-001', 'https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Nike+T-Shirt+1', 380000.00, 2, 760000.00, '2025-11-13 10:52:28');
INSERT INTO `order_items` VALUES (2, 2, 6, 19, 'Áo Blouse Nữ Zara', 'ZARA-ABN-001', 'https://via.placeholder.com/400x400/DDA0DD/FFFFFF?text=Zara+Blouse+1', 650000.00, 1, 650000.00, '2025-11-13 10:52:28');
INSERT INTO `order_items` VALUES (3, 2, 15, 35, 'Váy Dài Nữ Gucci', 'GUCCI-VDN-001', 'https://via.placeholder.com/400x400/F9E79F/FFFFFF?text=Gucci+Dress+1', 2500000.00, 1, 2500000.00, '2025-11-13 10:52:28');
INSERT INTO `order_items` VALUES (4, 3, 9, 25, 'Quần Jeans Nam Nike', 'NIKE-QJ-001', 'https://via.placeholder.com/400x400/85C1E9/FFFFFF?text=Nike+Jeans+1', 500000.00, 1, 500000.00, '2025-11-13 10:52:28');
INSERT INTO `order_items` VALUES (5, 3, 19, 45, 'Giày Sneaker Nam Nike', 'NIKE-GSN-001', 'https://via.placeholder.com/400x400/85C1E9/FFFFFF?text=Nike+Sneaker+1', 1000000.00, 1, 1000000.00, '2025-11-13 10:52:28');
INSERT INTO `order_items` VALUES (6, 4, 5, 13, 'Áo Thun Nữ H&M Basic', 'HM-ATN-001', 'https://via.placeholder.com/400x400/FFEAA7/FFFFFF?text=H%26M+T-Shirt+1', 150000.00, 3, 450000.00, '2025-11-13 10:52:28');
INSERT INTO `order_items` VALUES (7, 5, 18, 48, 'Túi Xách Nữ Louis Vuitton', 'LV-TXN-001', 'https://via.placeholder.com/400x400/BB8FCE/FFFFFF?text=LV+Bag+1', 12000000.00, 1, 12000000.00, '2025-11-13 10:52:28');
INSERT INTO `order_items` VALUES (8, 5, 20, 54, 'Giày Cao Gót Nữ Chanel', 'CHANEL-GCGN-001', 'https://via.placeholder.com/400x400/F8C471/FFFFFF?text=Chanel+Heels+1', 6500000.00, 1, 6500000.00, '2025-11-13 10:52:28');
INSERT INTO `order_items` VALUES (9, 6, 2, 12, 'Áo Sơ Mi Nam Uniqlo', 'UNIQLO-ASM-001', 'https://via.placeholder.com/400x400/4ECDC4/FFFFFF?text=Uniqlo+Shirt+1', 280000.00, 1, 280000.00, '2025-11-13 10:52:28');
INSERT INTO `order_items` VALUES (10, 6, 10, 28, 'Quần Short Nam Adidas', 'ADIDAS-QS-001', 'https://via.placeholder.com/400x400/BB8FCE/FFFFFF?text=Adidas+Shorts+1', 250000.00, 1, 250000.00, '2025-11-13 10:52:28');
INSERT INTO `order_items` VALUES (11, 7, 12, 32, 'Quần Jeans Nữ H&M', 'HM-QJN-001', 'https://via.placeholder.com/400x400/AED6F1/FFFFFF?text=H%26M+Jeans+1', 320000.00, 2, 640000.00, '2025-11-13 10:52:28');
INSERT INTO `order_items` VALUES (12, 7, 16, 42, 'Váy Ngắn Nữ H&M', 'HM-VNN-001', 'https://via.placeholder.com/400x400/D5F4E6/FFFFFF?text=H%26M+Dress+1', 200000.00, 2, 400000.00, '2025-11-13 10:52:28');
INSERT INTO `order_items` VALUES (13, 8, 3, 16, 'Áo Hoodie Nam Adidas', 'ADIDAS-AH-001', 'https://via.placeholder.com/400x400/45B7D1/FFFFFF?text=Adidas+Hoodie+1', 550000.00, 1, 550000.00, '2025-11-13 10:52:28');
INSERT INTO `order_items` VALUES (14, 8, 11, 30, 'Quần Kaki Nam Uniqlo', 'UNIQLO-QK-001', 'https://via.placeholder.com/400x400/F7DC6F/FFFFFF?text=Uniqlo+Kaki+1', 320000.00, 1, 320000.00, '2025-11-13 10:52:28');
INSERT INTO `order_items` VALUES (15, 13, 1, NULL, 'Sản phẩm', 'SKU-1', '', 380000.00, 1, 380000.00, '2025-11-13 13:58:05');
INSERT INTO `order_items` VALUES (16, 13, 1, 3, 'Sản phẩm', 'SKU-1', '', 380000.00, 1, 380000.00, '2025-11-13 13:58:05');
INSERT INTO `order_items` VALUES (17, 13, 1, 2, 'Sản phẩm', 'SKU-1', '', 380000.00, 2, 760000.00, '2025-11-13 13:58:05');
INSERT INTO `order_items` VALUES (18, 13, 4, 13, 'Sản phẩm', 'SKU-4', '', 450000.00, 1, 450000.00, '2025-11-13 13:58:05');
INSERT INTO `order_items` VALUES (19, 14, 2, 16, 'Sản phẩm', 'SKU-2', '', 280000.00, 2, 560000.00, '2025-11-13 14:15:20');

-- ----------------------------
-- Table structure for orders
-- ----------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `user_id` int NOT NULL,
  `user_address_id` int NOT NULL,
  `total_amount` decimal(10, 2) NOT NULL,
  `shipping_fee` decimal(10, 2) NULL DEFAULT 0.00,
  `discount_amount` decimal(10, 2) NULL DEFAULT 0.00,
  `final_amount` decimal(10, 2) NOT NULL,
  `payment_method` enum('cod','bank_transfer','vnpay') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'cod',
  `payment_status` enum('pending','paid','failed','refunded') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'pending',
  `order_status` enum('pending','confirmed','shipping','delivered','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'pending',
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `order_code`(`order_code` ASC) USING BTREE,
  INDEX `user_address_id`(`user_address_id` ASC) USING BTREE,
  INDEX `idx_orders_user`(`user_id` ASC) USING BTREE,
  INDEX `idx_orders_status`(`order_status` ASC) USING BTREE,
  INDEX `idx_orders_payment_status`(`payment_status` ASC) USING BTREE,
  INDEX `idx_orders_created_at`(`created_at` ASC) USING BTREE,
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`user_address_id`) REFERENCES `user_addresses` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of orders
-- ----------------------------
INSERT INTO `orders` VALUES (1, 'ORD001', 2, 1, 760000.00, 30000.00, 76000.00, 714000.00, 'cod', 'paid', 'delivered', 'Giao hàng trong giờ hành chính', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `orders` VALUES (2, 'ORD002', 3, 3, 1300000.00, 0.00, 130000.00, 1170000.00, 'vnpay', 'paid', 'shipping', 'Giao hàng nhanh', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `orders` VALUES (3, 'ORD003', 4, 5, 900000.00, 30000.00, 0.00, 930000.00, 'bank_transfer', 'pending', 'confirmed', 'Thanh toán chuyển khoản', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `orders` VALUES (4, 'ORD004', 5, 6, 450000.00, 30000.00, 45000.00, 435000.00, 'cod', 'paid', 'delivered', 'Giao hàng tận nơi', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `orders` VALUES (5, 'ORD005', 6, 7, 2000000.00, 0.00, 200000.00, 1800000.00, 'vnpay', 'paid', 'shipping', 'Đơn hàng cao cấp', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `orders` VALUES (6, 'ORD006', 2, 2, 600000.00, 30000.00, 0.00, 630000.00, 'cod', 'pending', 'pending', 'Chờ xác nhận', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `orders` VALUES (7, 'ORD007', 3, 4, 1200000.00, 0.00, 120000.00, 1080000.00, 'vnpay', 'paid', 'delivered', 'Giao hàng thành công', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `orders` VALUES (8, 'ORD008', 4, 5, 800000.00, 30000.00, 80000.00, 750000.00, 'bank_transfer', 'paid', 'confirmed', 'Đang chuẩn bị hàng', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `orders` VALUES (13, 'ORD1763017085292', 2, 12, 1970000.00, 0.00, 0.00, 1970000.00, 'vnpay', 'pending', 'pending', 'fsd', '2025-11-13 13:58:05', '2025-11-13 13:58:05');
INSERT INTO `orders` VALUES (14, 'ORD1763018120624', 2, 13, 560000.00, 0.00, 0.00, 560000.00, 'vnpay', 'paid', 'confirmed', 'sa', '2025-11-13 14:15:20', '2025-11-13 14:16:05');

-- ----------------------------
-- Table structure for product_attributes
-- ----------------------------
DROP TABLE IF EXISTS `product_attributes`;
CREATE TABLE `product_attributes`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `size` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `color` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `stock_quantity` int NULL DEFAULT 0,
  `sku_variant` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique_product_variant`(`product_id` ASC, `size` ASC, `color` ASC) USING BTREE,
  CONSTRAINT `product_attributes_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 130 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of product_attributes
-- ----------------------------
INSERT INTO `product_attributes` VALUES (1, 1, 'S', 'Trắng', 50, 'NIKE-AT-001-S-WHITE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (2, 1, 'M', 'Trắng', 75, 'NIKE-AT-001-M-WHITE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (3, 1, 'L', 'Trắng', 60, 'NIKE-AT-001-L-WHITE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (4, 1, 'XL', 'Trắng', 40, 'NIKE-AT-001-XL-WHITE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (5, 1, 'S', 'Đen', 45, 'NIKE-AT-001-S-BLACK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (6, 1, 'M', 'Đen', 70, 'NIKE-AT-001-M-BLACK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (7, 1, 'L', 'Đen', 55, 'NIKE-AT-001-L-BLACK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (8, 1, 'XL', 'Đen', 35, 'NIKE-AT-001-XL-BLACK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (9, 1, 'M', 'Xanh Navy', 30, 'NIKE-AT-001-M-NAVY', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (10, 1, 'L', 'Xanh Navy', 25, 'NIKE-AT-001-L-NAVY', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (11, 2, 'S', 'Xanh Navy', 30, 'UNIQLO-ASM-001-S-NAVY', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (12, 2, 'M', 'Xanh Navy', 45, 'UNIQLO-ASM-001-M-NAVY', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (13, 2, 'L', 'Xanh Navy', 40, 'UNIQLO-ASM-001-L-NAVY', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (14, 2, 'XL', 'Xanh Navy', 25, 'UNIQLO-ASM-001-XL-NAVY', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (15, 2, 'S', 'Trắng', 35, 'UNIQLO-ASM-001-S-WHITE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (16, 2, 'M', 'Trắng', 50, 'UNIQLO-ASM-001-M-WHITE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (17, 2, 'L', 'Trắng', 45, 'UNIQLO-ASM-001-L-WHITE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (18, 2, 'XL', 'Trắng', 30, 'UNIQLO-ASM-001-XL-WHITE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (19, 3, 'S', 'Xám', 20, 'ADIDAS-AH-001-S-GRAY', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (20, 3, 'M', 'Xám', 30, 'ADIDAS-AH-001-M-GRAY', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (21, 3, 'L', 'Xám', 25, 'ADIDAS-AH-001-L-GRAY', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (22, 3, 'XL', 'Xám', 15, 'ADIDAS-AH-001-XL-GRAY', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (23, 3, 'M', 'Đen', 25, 'ADIDAS-AH-001-M-BLACK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (24, 3, 'L', 'Đen', 20, 'ADIDAS-AH-001-L-BLACK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (25, 4, 'S', 'Trắng', 40, 'NIKE-AP-001-S-WHITE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (26, 4, 'M', 'Trắng', 50, 'NIKE-AP-001-M-WHITE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (27, 4, 'L', 'Trắng', 45, 'NIKE-AP-001-L-WHITE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (28, 4, 'XL', 'Trắng', 30, 'NIKE-AP-001-XL-WHITE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (29, 4, 'M', 'Xanh', 35, 'NIKE-AP-001-M-BLUE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (30, 4, 'L', 'Xanh', 30, 'NIKE-AP-001-L-BLUE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (31, 5, 'S', 'Hồng', 60, 'HM-ATN-001-S-PINK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (32, 5, 'M', 'Hồng', 80, 'HM-ATN-001-M-PINK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (33, 5, 'L', 'Hồng', 70, 'HM-ATN-001-L-PINK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (34, 5, 'S', 'Trắng', 55, 'HM-ATN-001-S-WHITE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (35, 5, 'M', 'Trắng', 75, 'HM-ATN-001-M-WHITE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (36, 5, 'L', 'Trắng', 65, 'HM-ATN-001-L-WHITE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (37, 5, 'S', 'Xanh', 40, 'HM-ATN-001-S-BLUE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (38, 5, 'M', 'Xanh', 50, 'HM-ATN-001-M-BLUE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (39, 6, 'S', 'Đen', 25, 'ZARA-ABN-001-S-BLACK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (40, 6, 'M', 'Đen', 35, 'ZARA-ABN-001-M-BLACK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (41, 6, 'L', 'Đen', 300, 'ZARA-ABN-001-L-BLACK', '2025-11-13 10:52:28', '2025-11-18 00:02:02');
INSERT INTO `product_attributes` VALUES (42, 6, 'S', 'Xanh', 20, 'ZARA-ABN-001-S-BLUE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (43, 6, 'M', 'Xanh', 30, 'ZARA-ABN-001-M-BLUE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (44, 6, 'L', 'Xanh', 25, 'ZARA-ABN-001-L-BLUE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (45, 6, 'M', 'Trắng', 15, 'ZARA-ABN-001-M-WHITE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (46, 6, 'L', 'Trắng', 12, 'ZARA-ABN-001-L-WHITE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (47, 7, 'S', 'Đỏ', 10, 'GUCCI-ALN-001-S-RED', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (48, 7, 'M', 'Đỏ', 15, 'GUCCI-ALN-001-M-RED', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (49, 7, 'L', 'Đỏ', 12, 'GUCCI-ALN-001-L-RED', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (50, 7, 'M', 'Đen', 8, 'GUCCI-ALN-001-M-BLACK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (51, 7, 'L', 'Đen', 6, 'GUCCI-ALN-001-L-BLACK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (52, 8, 'S', 'Hồng', 35, 'HM-ATT-001-S-PINK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (53, 8, 'M', 'Hồng', 45, 'HM-ATT-001-M-PINK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (54, 8, 'L', 'Hồng', 40, 'HM-ATT-001-L-PINK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (55, 8, 'S', 'Trắng', 30, 'HM-ATT-001-S-WHITE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (56, 8, 'M', 'Trắng', 40, 'HM-ATT-001-M-WHITE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (57, 9, '28', 'Xanh', 40, 'NIKE-QJ-001-28-BLUE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (58, 9, '30', 'Xanh', 50, 'NIKE-QJ-001-30-BLUE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (59, 9, '32', 'Xanh', 45, 'NIKE-QJ-001-32-BLUE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (60, 9, '34', 'Xanh', 35, 'NIKE-QJ-001-34-BLUE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (61, 9, '36', 'Xanh', 25, 'NIKE-QJ-001-36-BLUE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (62, 9, '30', 'Đen', 30, 'NIKE-QJ-001-30-BLACK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (63, 9, '32', 'Đen', 25, 'NIKE-QJ-001-32-BLACK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (64, 9, '34', 'Đen', 20, 'NIKE-QJ-001-34-BLACK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (65, 10, 'S', 'Đen', 30, 'ADIDAS-QS-001-S-BLACK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (66, 10, 'M', 'Đen', 40, 'ADIDAS-QS-001-M-BLACK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (67, 10, 'L', 'Đen', 35, 'ADIDAS-QS-001-L-BLACK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (68, 10, 'XL', 'Đen', 20, 'ADIDAS-QS-001-XL-BLACK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (69, 10, 'M', 'Xám', 25, 'ADIDAS-QS-001-M-GRAY', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (70, 10, 'L', 'Xám', 20, 'ADIDAS-QS-001-L-GRAY', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (71, 11, 'S', 'Be', 25, 'UNIQLO-QK-001-S-BEIGE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (72, 11, 'M', 'Be', 35, 'UNIQLO-QK-001-M-BEIGE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (73, 11, 'L', 'Be', 30, 'UNIQLO-QK-001-L-BEIGE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (74, 11, 'XL', 'Be', 20, 'UNIQLO-QK-001-XL-BEIGE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (75, 11, 'M', 'Xanh Navy', 30, 'UNIQLO-QK-001-M-NAVY', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (76, 11, 'L', 'Xanh Navy', 25, 'UNIQLO-QK-001-L-NAVY', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (77, 12, 'S', 'Xanh', 50, 'HM-QJN-001-S-BLUE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (78, 12, 'M', 'Xanh', 60, 'HM-QJN-001-M-BLUE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (79, 12, 'L', 'Xanh', 55, 'HM-QJN-001-L-BLUE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (80, 12, 'S', 'Đen', 45, 'HM-QJN-001-S-BLACK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (81, 12, 'M', 'Đen', 55, 'HM-QJN-001-M-BLACK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (82, 12, 'L', 'Đen', 50, 'HM-QJN-001-L-BLACK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (83, 12, 'S', 'Trắng', 30, 'HM-QJN-001-S-WHITE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (84, 12, 'M', 'Trắng', 35, 'HM-QJN-001-M-WHITE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (85, 13, 'S', 'Trắng', 35, 'ZARA-QSN-001-S-WHITE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (86, 13, 'M', 'Trắng', 45, 'ZARA-QSN-001-M-WHITE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (87, 13, 'L', 'Trắng', 40, 'ZARA-QSN-001-L-WHITE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (88, 13, 'S', 'Hồng', 25, 'ZARA-QSN-001-S-PINK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (89, 13, 'M', 'Hồng', 30, 'ZARA-QSN-001-M-PINK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (90, 14, 'S', 'Đen', 40, 'NIKE-QLN-001-S-BLACK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (91, 14, 'M', 'Đen', 50, 'NIKE-QLN-001-M-BLACK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (92, 14, 'L', 'Đen', 45, 'NIKE-QLN-001-L-BLACK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (93, 14, 'S', 'Xám', 30, 'NIKE-QLN-001-S-GRAY', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (94, 14, 'M', 'Xám', 35, 'NIKE-QLN-001-M-GRAY', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (95, 15, 'S', 'Đen', 8, 'GUCCI-VDN-001-S-BLACK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (96, 15, 'M', 'Đen', 12, 'GUCCI-VDN-001-M-BLACK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (97, 15, 'L', 'Đen', 10, 'GUCCI-VDN-001-L-BLACK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (98, 15, 'M', 'Đỏ', 6, 'GUCCI-VDN-001-M-RED', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (99, 15, 'L', 'Đỏ', 5, 'GUCCI-VDN-001-L-RED', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (100, 16, 'S', 'Hồng', 40, 'HM-VNN-001-S-PINK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (101, 16, 'M', 'Hồng', 50, 'HM-VNN-001-M-PINK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (102, 16, 'L', 'Hồng', 45, 'HM-VNN-001-L-PINK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (103, 16, 'S', 'Xanh', 35, 'HM-VNN-001-S-BLUE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (104, 16, 'M', 'Xanh', 45, 'HM-VNN-001-M-BLUE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (105, 16, 'L', 'Xanh', 40, 'HM-VNN-001-L-BLUE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (106, 16, 'S', 'Trắng', 30, 'HM-VNN-001-S-WHITE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (107, 16, 'M', 'Trắng', 35, 'HM-VNN-001-M-WHITE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (108, 17, 'S', 'Xanh', 25, 'ZARA-VMN-001-S-BLUE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (109, 17, 'M', 'Xanh', 30, 'ZARA-VMN-001-M-BLUE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (110, 17, 'L', 'Xanh', 25, 'ZARA-VMN-001-L-BLUE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (111, 17, 'M', 'Hồng', 20, 'ZARA-VMN-001-M-PINK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (112, 17, 'L', 'Hồng', 18, 'ZARA-VMN-001-L-PINK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (113, 18, 'One Size', 'Nâu', 5, 'LV-TXN-001-OS-BROWN', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (114, 18, 'One Size', 'Đen', 4, 'LV-TXN-001-OS-BLACK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (115, 18, 'One Size', 'Đỏ', 3, 'LV-TXN-001-OS-RED', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (116, 19, '40', 'Trắng', 30, 'NIKE-GSN-001-40-WHITE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (117, 19, '41', 'Trắng', 35, 'NIKE-GSN-001-41-WHITE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (118, 19, '42', 'Trắng', 40, 'NIKE-GSN-001-42-WHITE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (119, 19, '43', 'Trắng', 35, 'NIKE-GSN-001-43-WHITE', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (120, 19, '40', 'Đen', 25, 'NIKE-GSN-001-40-BLACK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (121, 19, '41', 'Đen', 30, 'NIKE-GSN-001-41-BLACK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (122, 19, '42', 'Đen', 35, 'NIKE-GSN-001-42-BLACK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (123, 19, '43', 'Đen', 30, 'NIKE-GSN-001-43-BLACK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (124, 20, '36', 'Đen', 8, 'CHANEL-GCGN-001-36-BLACK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (125, 20, '37', 'Đen', 10, 'CHANEL-GCGN-001-37-BLACK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (126, 20, '38', 'Đen', 12, 'CHANEL-GCGN-001-38-BLACK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (127, 20, '39', 'Đen', 8, 'CHANEL-GCGN-001-39-BLACK', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (128, 20, '37', 'Đỏ', 5, 'CHANEL-GCGN-001-37-RED', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_attributes` VALUES (129, 20, '38', 'Đỏ', 6, 'CHANEL-GCGN-001-38-RED', '2025-11-13 10:52:28', '2025-11-13 10:52:28');

-- ----------------------------
-- Table structure for product_images
-- ----------------------------
DROP TABLE IF EXISTS `product_images`;
CREATE TABLE `product_images`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `alt_text` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `is_primary` tinyint(1) NULL DEFAULT 0,
  `sort_order` int NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `product_id`(`product_id` ASC) USING BTREE,
  CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 34 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of product_images
-- ----------------------------
INSERT INTO `product_images` VALUES (4, 2, 'https://via.placeholder.com/400x400/4ECDC4/FFFFFF?text=Uniqlo+Shirt+1', 'Áo sơ mi nam Uniqlo - Mặt trước', 1, 1, '2025-11-13 10:52:28');
INSERT INTO `product_images` VALUES (5, 2, 'https://via.placeholder.com/400x400/4ECDC4/FFFFFF?text=Uniqlo+Shirt+2', 'Áo sơ mi nam Uniqlo - Mặt sau', 0, 2, '2025-11-13 10:52:28');
INSERT INTO `product_images` VALUES (6, 3, 'https://via.placeholder.com/400x400/45B7D1/FFFFFF?text=Adidas+Hoodie+1', 'Áo hoodie nam Adidas - Mặt trước', 1, 1, '2025-11-13 10:52:28');
INSERT INTO `product_images` VALUES (7, 3, 'https://via.placeholder.com/400x400/45B7D1/FFFFFF?text=Adidas+Hoodie+2', 'Áo hoodie nam Adidas - Mặt sau', 0, 2, '2025-11-13 10:52:28');
INSERT INTO `product_images` VALUES (8, 4, 'https://via.placeholder.com/400x400/96CEB4/FFFFFF?text=Nike+Polo+1', 'Áo polo nam Nike - Mặt trước', 1, 1, '2025-11-13 10:52:28');
INSERT INTO `product_images` VALUES (9, 5, 'https://via.placeholder.com/400x400/FFEAA7/FFFFFF?text=H%26M+T-Shirt+1', 'Áo thun nữ H&M Basic - Mặt trước', 1, 1, '2025-11-13 10:52:28');
INSERT INTO `product_images` VALUES (10, 5, 'https://via.placeholder.com/400x400/FFEAA7/FFFFFF?text=H%26M+T-Shirt+2', 'Áo thun nữ H&M Basic - Mặt sau', 0, 2, '2025-11-13 10:52:28');
INSERT INTO `product_images` VALUES (11, 6, 'https://via.placeholder.com/400x400/DDA0DD/FFFFFF?text=Zara+Blouse+1', 'Áo blouse nữ Zara - Mặt trước', 1, 1, '2025-11-13 10:52:28');
INSERT INTO `product_images` VALUES (12, 6, 'https://via.placeholder.com/400x400/DDA0DD/FFFFFF?text=Zara+Blouse+2', 'Áo blouse nữ Zara - Mặt sau', 0, 2, '2025-11-13 10:52:28');
INSERT INTO `product_images` VALUES (13, 7, 'https://via.placeholder.com/400x400/82E0AA/FFFFFF?text=Gucci+Sweater+1', 'Áo len nữ Gucci - Mặt trước', 1, 1, '2025-11-13 10:52:28');
INSERT INTO `product_images` VALUES (14, 8, 'https://via.placeholder.com/400x400/F8C471/FFFFFF?text=H%26M+Tank+1', 'Áo tank top nữ H&M - Mặt trước', 1, 1, '2025-11-13 10:52:28');
INSERT INTO `product_images` VALUES (15, 9, 'https://via.placeholder.com/400x400/85C1E9/FFFFFF?text=Nike+Jeans+1', 'Quần jeans nam Nike - Mặt trước', 1, 1, '2025-11-13 10:52:28');
INSERT INTO `product_images` VALUES (16, 9, 'https://via.placeholder.com/400x400/85C1E9/FFFFFF?text=Nike+Jeans+2', 'Quần jeans nam Nike - Mặt sau', 0, 2, '2025-11-13 10:52:28');
INSERT INTO `product_images` VALUES (17, 10, 'https://via.placeholder.com/400x400/BB8FCE/FFFFFF?text=Adidas+Shorts+1', 'Quần short nam Adidas - Mặt trước', 1, 1, '2025-11-13 10:52:28');
INSERT INTO `product_images` VALUES (18, 11, 'https://via.placeholder.com/400x400/F7DC6F/FFFFFF?text=Uniqlo+Kaki+1', 'Quần kaki nam Uniqlo - Mặt trước', 1, 1, '2025-11-13 10:52:28');
INSERT INTO `product_images` VALUES (19, 12, 'https://via.placeholder.com/400x400/AED6F1/FFFFFF?text=H%26M+Jeans+1', 'Quần jeans nữ H&M - Mặt trước', 1, 1, '2025-11-13 10:52:28');
INSERT INTO `product_images` VALUES (20, 12, 'https://via.placeholder.com/400x400/AED6F1/FFFFFF?text=H%26M+Jeans+2', 'Quần jeans nữ H&M - Mặt sau', 0, 2, '2025-11-13 10:52:28');
INSERT INTO `product_images` VALUES (21, 13, 'https://via.placeholder.com/400x400/D5DBDB/FFFFFF?text=Zara+Shorts+1', 'Quần short nữ Zara - Mặt trước', 1, 1, '2025-11-13 10:52:28');
INSERT INTO `product_images` VALUES (22, 14, 'https://via.placeholder.com/400x400/FADBD8/FFFFFF?text=Nike+Legging+1', 'Quần legging nữ Nike - Mặt trước', 1, 1, '2025-11-13 10:52:28');
INSERT INTO `product_images` VALUES (23, 15, 'https://via.placeholder.com/400x400/F9E79F/FFFFFF?text=Gucci+Dress+1', 'Váy dài nữ Gucci - Mặt trước', 1, 1, '2025-11-13 10:52:28');
INSERT INTO `product_images` VALUES (24, 15, 'https://via.placeholder.com/400x400/F9E79F/FFFFFF?text=Gucci+Dress+2', 'Váy dài nữ Gucci - Mặt sau', 0, 2, '2025-11-13 10:52:28');
INSERT INTO `product_images` VALUES (25, 16, 'https://via.placeholder.com/400x400/D5F4E6/FFFFFF?text=H%26M+Dress+1', 'Váy ngắn nữ H&M - Mặt trước', 1, 1, '2025-11-13 10:52:28');
INSERT INTO `product_images` VALUES (26, 17, 'https://via.placeholder.com/400x400/FAD7A0/FFFFFF?text=Zara+Maxi+1', 'Váy maxi nữ Zara - Mặt trước', 1, 1, '2025-11-13 10:52:28');
INSERT INTO `product_images` VALUES (27, 18, 'https://via.placeholder.com/400x400/BB8FCE/FFFFFF?text=LV+Bag+1', 'Túi xách nữ Louis Vuitton - Mặt trước', 1, 1, '2025-11-13 10:52:28');
INSERT INTO `product_images` VALUES (28, 18, 'https://via.placeholder.com/400x400/BB8FCE/FFFFFF?text=LV+Bag+2', 'Túi xách nữ Louis Vuitton - Mặt sau', 0, 2, '2025-11-13 10:52:28');
INSERT INTO `product_images` VALUES (29, 19, 'https://via.placeholder.com/400x400/85C1E9/FFFFFF?text=Nike+Sneaker+1', 'Giày sneaker nam Nike - Mặt trước', 1, 1, '2025-11-13 10:52:28');
INSERT INTO `product_images` VALUES (30, 19, 'https://via.placeholder.com/400x400/85C1E9/FFFFFF?text=Nike+Sneaker+2', 'Giày sneaker nam Nike - Mặt sau', 0, 2, '2025-11-13 10:52:28');
INSERT INTO `product_images` VALUES (31, 20, 'https://via.placeholder.com/400x400/F8C471/FFFFFF?text=Chanel+Heels+1', 'Giày cao gót nữ Chanel - Mặt trước', 1, 1, '2025-11-13 10:52:28');
INSERT INTO `product_images` VALUES (32, 1, '/images/products/hoodie-black-1763007519331-264937700.png', NULL, 1, 0, '2025-11-13 11:18:39');
INSERT INTO `product_images` VALUES (33, 1, '/images/products/grande-1763007531839-15283024.png', NULL, 0, 0, '2025-11-13 11:18:51');

-- ----------------------------
-- Table structure for product_reviews
-- ----------------------------
DROP TABLE IF EXISTS `product_reviews`;
CREATE TABLE `product_reviews`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `order_id` int NULL DEFAULT NULL,
  `rating` int NOT NULL,
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `images` json NULL,
  `is_approved` tinyint(1) NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique_user_product_review`(`user_id` ASC, `product_id` ASC) USING BTREE,
  INDEX `product_id`(`product_id` ASC) USING BTREE,
  INDEX `order_id`(`order_id` ASC) USING BTREE,
  CONSTRAINT `product_reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `product_reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `product_reviews_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  CONSTRAINT `product_reviews_chk_1` CHECK ((`rating` >= 1) and (`rating` <= 5))
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of product_reviews
-- ----------------------------
INSERT INTO `product_reviews` VALUES (1, 1, 2, 1, 5, 'Áo rất đẹp và chất lượng tốt', 'Áo Nike này rất đẹp, chất liệu mềm mại, mặc rất thoải mái. Sẽ mua thêm!', '[\"https://via.placeholder.com/200x200/FF6B6B/FFFFFF?text=Review+1\"]', 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_reviews` VALUES (2, 1, 3, NULL, 4, 'Sản phẩm tốt', 'Áo đẹp, giá hợp lý. Giao hàng nhanh.', NULL, 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_reviews` VALUES (3, 5, 2, NULL, 5, 'Áo nữ rất đẹp', 'Áo H&M này rất dễ phối đồ, chất liệu cotton mềm mại.', '[\"https://via.placeholder.com/200x200/FFEAA7/FFFFFF?text=Review+2\"]', 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_reviews` VALUES (4, 6, 3, 2, 4, 'Blouse đẹp', 'Áo blouse Zara thiết kế sang trọng, phù hợp cho công sở.', NULL, 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_reviews` VALUES (5, 9, 4, 3, 5, 'Quần jeans chất lượng', 'Quần jeans Nike rất bền, chất liệu denim cao cấp.', '[\"https://via.placeholder.com/200x200/85C1E9/FFFFFF?text=Review+3\"]', 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_reviews` VALUES (6, 12, 3, 7, 4, 'Quần jeans nữ đẹp', 'Quần jeans H&M vừa vặn, chất liệu mềm mại.', NULL, 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_reviews` VALUES (7, 15, 3, 2, 5, 'Váy Gucci tuyệt vời', 'Váy Gucci rất đẹp, chất liệu cao cấp, thiết kế sang trọng.', '[\"https://via.placeholder.com/200x200/F9E79F/FFFFFF?text=Review+4\"]', 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `product_reviews` VALUES (8, 19, 4, 3, 5, 'Giày Nike chất lượng', 'Giày Nike rất thoải mái, thiết kế đẹp, chất liệu bền.', NULL, 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');

-- ----------------------------
-- Table structure for products
-- ----------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `slug` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `short_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `sku` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `price` decimal(10, 2) NOT NULL,
  `sale_price` decimal(10, 2) NULL DEFAULT NULL,
  `category_id` int NOT NULL,
  `brand_id` int NULL DEFAULT NULL,
  `gender` enum('nam','nu','unisex') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'unisex',
  `status` enum('active','inactive','out_of_stock') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'active',
  `featured` tinyint(1) NULL DEFAULT 0,
  `meta_title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `meta_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `slug`(`slug` ASC) USING BTREE,
  UNIQUE INDEX `sku`(`sku` ASC) USING BTREE,
  INDEX `idx_products_category`(`category_id` ASC) USING BTREE,
  INDEX `idx_products_brand`(`brand_id` ASC) USING BTREE,
  INDEX `idx_products_status`(`status` ASC) USING BTREE,
  INDEX `idx_products_featured`(`featured` ASC) USING BTREE,
  INDEX `idx_products_price`(`price` ASC) USING BTREE,
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 21 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of products
-- ----------------------------
INSERT INTO `products` VALUES (1, 'Áo Thun Nam Nike Dri-FIT', 'ao-thun-nam-nike-dri-fit', 'Áo thun nam Nike Dri-FIT chất liệu cotton cao cấp, thoáng mát, thấm hút mồ hôi tốt. Thiết kế trẻ trung, phù hợp cho hoạt động thể thao và thường ngày.', 'Áo thun nam Nike Dri-FIT chất liệu cotton cao cấp', 'NIKE-AT-001', 450000.00, 380000.00, 7, 1, 'nam', 'active', 1, 'Áo Thun Nam Nike Dri-FIT', 'Áo thun nam Nike Dri-FIT chất liệu cotton cao cấp, thoáng mát', '2025-11-13 10:52:28', '2025-11-13 11:18:53');
INSERT INTO `products` VALUES (2, 'Áo Sơ Mi Nam Uniqlo', 'ao-so-mi-nam-uniqlo', 'Áo sơ mi nam Uniqlo kiểu dáng thanh lịch, phù hợp cho công sở. Chất liệu cotton mềm mại, dễ giặt, không nhăn.', 'Áo sơ mi nam Uniqlo kiểu dáng thanh lịch', 'UNIQLO-ASM-001', 350000.00, 280000.00, 8, 3, 'nam', 'active', 1, 'Áo Sơ Mi Nam Uniqlo', 'Áo sơ mi nam Uniqlo kiểu dáng thanh lịch, phù hợp cho công sở', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `products` VALUES (3, 'Áo Hoodie Nam Adidas', 'ao-hoodie-nam-adidas', 'Áo hoodie nam Adidas ấm áp, thiết kế trẻ trung. Chất liệu cotton blend, có túi kangaroo, dây kéo chất lượng.', 'Áo hoodie nam Adidas ấm áp, thiết kế trẻ trung', 'ADIDAS-AH-001', 650000.00, 550000.00, 9, 2, 'nam', 'active', 0, 'Áo Hoodie Nam Adidas', 'Áo hoodie nam Adidas ấm áp, thiết kế trẻ trung', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `products` VALUES (4, 'Áo Polo Nam Nike', 'ao-polo-nam-nike', 'Áo polo nam Nike thiết kế thể thao, chất liệu polyester cao cấp, thoáng mát, chống UV.', 'Áo polo nam Nike thiết kế thể thao', 'NIKE-AP-001', 550000.00, 450000.00, 7, 1, 'nam', 'active', 0, 'Áo Polo Nam Nike', 'Áo polo nam Nike thiết kế thể thao, chất liệu polyester cao cấp', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `products` VALUES (5, 'Áo Thun Nữ H&M Basic', 'ao-thun-nu-hm-basic', 'Áo thun nữ H&M basic dễ phối đồ, chất liệu cotton mềm mại. Thiết kế đơn giản, phù hợp cho mọi hoàn cảnh.', 'Áo thun nữ H&M basic dễ phối đồ', 'HM-ATN-001', 200000.00, 150000.00, 10, 5, 'nu', 'active', 1, 'Áo Thun Nữ H&M Basic', 'Áo thun nữ H&M basic dễ phối đồ, chất liệu cotton mềm mại', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `products` VALUES (6, 'Áo Blouse Nữ Zara', 'ao-blouse-nu-zara', 'Áo blouse nữ Zara thiết kế sang trọng, phù hợp cho công sở. Chất liệu polyester cao cấp, dễ giặt, không nhăn.', 'Áo blouse nữ Zara thiết kế sang trọng', 'ZARA-ABN-001', 800000.00, 650000.00, 11, 4, 'nu', 'active', 1, 'Áo Blouse Nữ Zara', 'Áo blouse nữ Zara thiết kế sang trọng, phù hợp cho công sở', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `products` VALUES (7, 'Áo Len Nữ Gucci', 'ao-len-nu-gucci', 'Áo len nữ Gucci cao cấp, thiết kế tinh tế. Chất liệu cashmere mềm mại, ấm áp, sang trọng.', 'Áo len nữ Gucci cao cấp, thiết kế tinh tế', 'GUCCI-ALN-001', 2500000.00, 2000000.00, 12, 6, 'nu', 'active', 0, 'Áo Len Nữ Gucci', 'Áo len nữ Gucci cao cấp, thiết kế tinh tế', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `products` VALUES (8, 'Áo Tank Top Nữ H&M', 'ao-tank-top-nu-hm', 'Áo tank top nữ H&M dễ thương, phù hợp cho mùa hè. Chất liệu cotton mềm mại, thoáng mát.', 'Áo tank top nữ H&M dễ thương', 'HM-ATT-001', 150000.00, 120000.00, 10, 5, 'nu', 'active', 0, 'Áo Tank Top Nữ H&M', 'Áo tank top nữ H&M dễ thương, phù hợp cho mùa hè', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `products` VALUES (9, 'Quần Jeans Nam Nike', 'quan-jeans-nam-nike', 'Quần jeans nam Nike chất liệu denim cao cấp, co giãn tốt. Thiết kế slim fit, phù hợp cho mọi hoàn cảnh.', 'Quần jeans nam Nike chất liệu denim cao cấp', 'NIKE-QJ-001', 600000.00, 500000.00, 13, 1, 'nam', 'active', 1, 'Quần Jeans Nam Nike', 'Quần jeans nam Nike chất liệu denim cao cấp, co giãn tốt', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `products` VALUES (10, 'Quần Short Nam Adidas', 'quan-short-nam-adidas', 'Quần short nam Adidas thể thao, thoáng mát. Chất liệu polyester, có túi, dây rút tiện lợi.', 'Quần short nam Adidas thể thao, thoáng mát', 'ADIDAS-QS-001', 300000.00, 250000.00, 14, 2, 'nam', 'active', 0, 'Quần Short Nam Adidas', 'Quần short nam Adidas thể thao, thoáng mát', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `products` VALUES (11, 'Quần Kaki Nam Uniqlo', 'quan-kaki-nam-uniqlo', 'Quần kaki nam Uniqlo thiết kế công sở, chất liệu cotton blend. Kiểu dáng thanh lịch, dễ phối đồ.', 'Quần kaki nam Uniqlo thiết kế công sở', 'UNIQLO-QK-001', 400000.00, 320000.00, 13, 3, 'nam', 'active', 0, 'Quần Kaki Nam Uniqlo', 'Quần kaki nam Uniqlo thiết kế công sở, chất liệu cotton blend', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `products` VALUES (12, 'Quần Jeans Nữ H&M', 'quan-jeans-nu-hm', 'Quần jeans nữ H&M kiểu dáng hiện đại, chất liệu denim mềm. Thiết kế skinny fit, phù hợp cho mọi hoàn cảnh.', 'Quần jeans nữ H&M kiểu dáng hiện đại', 'HM-QJN-001', 400000.00, 320000.00, 15, 5, 'nu', 'active', 1, 'Quần Jeans Nữ H&M', 'Quần jeans nữ H&M kiểu dáng hiện đại, chất liệu denim mềm', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `products` VALUES (13, 'Quần Short Nữ Zara', 'quan-short-nu-zara', 'Quần short nữ Zara thiết kế trẻ trung, dễ phối đồ. Chất liệu cotton, có túi, dây rút tiện lợi.', 'Quần short nữ Zara thiết kế trẻ trung', 'ZARA-QSN-001', 350000.00, 280000.00, 16, 4, 'nu', 'active', 0, 'Quần Short Nữ Zara', 'Quần short nữ Zara thiết kế trẻ trung, dễ phối đồ', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `products` VALUES (14, 'Quần Legging Nữ Nike', 'quan-legging-nu-nike', 'Quần legging nữ Nike thể thao, co giãn tốt. Chất liệu polyester, thoáng mát, chống UV.', 'Quần legging nữ Nike thể thao, co giãn tốt', 'NIKE-QLN-001', 450000.00, 380000.00, 15, 1, 'nu', 'active', 0, 'Quần Legging Nữ Nike', 'Quần legging nữ Nike thể thao, co giãn tốt', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `products` VALUES (15, 'Váy Dài Nữ Gucci', 'vay-dai-nu-gucci', 'Váy dài nữ Gucci cao cấp, thiết kế sang trọng. Chất liệu silk cao cấp, phù hợp cho các dịp đặc biệt.', 'Váy dài nữ Gucci cao cấp, thiết kế sang trọng', 'GUCCI-VDN-001', 3000000.00, 2500000.00, 17, 6, 'nu', 'active', 1, 'Váy Dài Nữ Gucci', 'Váy dài nữ Gucci cao cấp, thiết kế sang trọng', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `products` VALUES (16, 'Váy Ngắn Nữ H&M', 'vay-ngan-nu-hm', 'Váy ngắn nữ H&M dễ thương, phù hợp cho mùa hè. Chất liệu cotton, thiết kế đơn giản, dễ phối đồ.', 'Váy ngắn nữ H&M dễ thương, phù hợp cho mùa hè', 'HM-VNN-001', 250000.00, 200000.00, 18, 5, 'nu', 'active', 0, 'Váy Ngắn Nữ H&M', 'Váy ngắn nữ H&M dễ thương, phù hợp cho mùa hè', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `products` VALUES (17, 'Váy Maxi Nữ Zara', 'vay-maxi-nu-zara', 'Váy maxi nữ Zara thiết kế thanh lịch, phù hợp cho mùa hè. Chất liệu chiffon mềm mại, thoáng mát.', 'Váy maxi nữ Zara thiết kế thanh lịch', 'ZARA-VMN-001', 600000.00, 480000.00, 17, 4, 'nu', 'active', 0, 'Váy Maxi Nữ Zara', 'Váy maxi nữ Zara thiết kế thanh lịch, phù hợp cho mùa hè', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `products` VALUES (18, 'Túi Xách Nữ Louis Vuitton', 'tui-xach-nu-louis-vuitton', 'Túi xách nữ Louis Vuitton cao cấp, thiết kế sang trọng. Chất liệu da thật, phù hợp cho các dịp đặc biệt.', 'Túi xách nữ Louis Vuitton cao cấp', 'LV-TXN-001', 15000000.00, 12000000.00, 19, 7, 'nu', 'active', 1, 'Túi Xách Nữ Louis Vuitton', 'Túi xách nữ Louis Vuitton cao cấp, thiết kế sang trọng', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `products` VALUES (19, 'Giày Sneaker Nam Nike', 'giay-sneaker-nam-nike', 'Giày sneaker nam Nike thể thao, thiết kế hiện đại. Chất liệu da tổng hợp, đế cao su chống trượt.', 'Giày sneaker nam Nike thể thao', 'NIKE-GSN-001', 1200000.00, 1000000.00, 20, 1, 'nam', 'active', 1, 'Giày Sneaker Nam Nike', 'Giày sneaker nam Nike thể thao, thiết kế hiện đại', '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `products` VALUES (20, 'Giày Cao Gót Nữ Chanel', 'giay-cao-got-nu-chanel', 'Giày cao gót nữ Chanel cao cấp, thiết kế sang trọng. Chất liệu da thật, phù hợp cho các dịp đặc biệt.', 'Giày cao gót nữ Chanel cao cấp', 'CHANEL-GCGN-001', 8000000.00, 6500000.00, 20, 8, 'nu', 'active', 0, 'Giày Cao Gót Nữ Chanel', 'Giày cao gót nữ Chanel cao cấp, thiết kế sang trọng', '2025-11-13 10:52:28', '2025-11-13 10:52:28');

-- ----------------------------
-- Table structure for user_addresses
-- ----------------------------
DROP TABLE IF EXISTS `user_addresses`;
CREATE TABLE `user_addresses`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `full_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ward` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `district` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `province` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `postal_code` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `is_default` tinyint(1) NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `user_addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_addresses
-- ----------------------------
INSERT INTO `user_addresses` VALUES (1, 2, 'John Doe', '0123456789', '123 Đường ABC, Phường 1', 'Phường 1', 'Quận 1', 'TP.HCM', '700000', 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `user_addresses` VALUES (2, 2, 'John Doe', '0123456789', '456 Đường XYZ, Phường 2', 'Phường 2', 'Quận 2', 'TP.HCM', '700000', 0, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `user_addresses` VALUES (3, 3, 'Jane Smith', '0987654321', '789 Đường DEF, Phường 3', 'Phường 3', 'Quận 3', 'TP.HCM', '700000', 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `user_addresses` VALUES (4, 3, 'Jane Smith', '0987654321', '321 Đường GHI, Phường 4', 'Phường 4', 'Quận 4', 'TP.HCM', '700000', 0, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `user_addresses` VALUES (5, 4, 'Mike Wilson', '0369852147', '654 Đường JKL, Phường 5', 'Phường 5', 'Quận 5', 'TP.HCM', '700000', 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `user_addresses` VALUES (6, 5, 'Sarah Jones', '0555123456', '987 Đường MNO, Phường 6', 'Phường 6', 'Quận 6', 'TP.HCM', '700000', 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `user_addresses` VALUES (7, 6, 'David Brown', '0777123456', '147 Đường PQR, Phường 7', 'Phường 7', 'Quận 7', 'TP.HCM', '700000', 1, '2025-11-13 10:52:28', '2025-11-13 10:52:28');
INSERT INTO `user_addresses` VALUES (12, 2, 'ds', '03886693354', 'đa', 'fdsf', 'fsd', 'danang', NULL, 0, '2025-11-13 13:58:05', '2025-11-13 13:58:05');
INSERT INTO `user_addresses` VALUES (13, 2, 'sá', '0386693354', 'trongduc02@gmail.com', 'sa', 'sa', 'haiphong', NULL, 0, '2025-11-13 14:15:20', '2025-11-13 14:15:20');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `full_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `role` enum('admin','user') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'user',
  `is_active` tinyint(1) NULL DEFAULT 1,
  `email_verified` tinyint(1) NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE,
  UNIQUE INDEX `email`(`email` ASC) USING BTREE,
  INDEX `idx_users_email`(`email` ASC) USING BTREE,
  INDEX `idx_users_role`(`role` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'admin', 'admin@example.com', '$2b$10$s29ww29Hopb2sox0cpb2fOnx.EOKz/xb8VHwWFRbWtAGTO/vV0bLe', 'Administrator', '0123456789', 'https://via.placeholder.com/150/FF6B6B/FFFFFF?text=Admin', 'admin', 1, 1, '2025-11-13 10:52:28', '2025-11-18 00:01:09');
INSERT INTO `users` VALUES (2, 'john_doe', 'john@example.com', '$2b$10$s29ww29Hopb2sox0cpb2fOnx.EOKz/xb8VHwWFRbWtAGTO/vV0bLe', 'John Doe', '0123456789', 'https://via.placeholder.com/150/4ECDC4/FFFFFF?text=John', 'user', 1, 1, '2025-11-13 10:52:28', '2025-11-18 00:01:09');
INSERT INTO `users` VALUES (3, 'jane_smith', 'jane@example.com', '$2b$10$s29ww29Hopb2sox0cpb2fOnx.EOKz/xb8VHwWFRbWtAGTO/vV0bLe', 'Jane Smith', '0987654321', 'https://via.placeholder.com/150/45B7D1/FFFFFF?text=Jane', 'user', 1, 1, '2025-11-13 10:52:28', '2025-11-18 00:01:09');
INSERT INTO `users` VALUES (4, 'mike_wilson', 'mike@example.com', '$2b$10$s29ww29Hopb2sox0cpb2fOnx.EOKz/xb8VHwWFRbWtAGTO/vV0bLe', 'Mike Wilson', '0369852147', 'https://via.placeholder.com/150/96CEB4/FFFFFF?text=Mike', 'user', 1, 1, '2025-11-13 10:52:28', '2025-11-18 00:01:09');
INSERT INTO `users` VALUES (5, 'sarah_jones', 'sarah@example.com', '$2b$10$s29ww29Hopb2sox0cpb2fOnx.EOKz/xb8VHwWFRbWtAGTO/vV0bLe', 'Sarah Jones', '0555123456', 'https://via.placeholder.com/150/FFEAA7/FFFFFF?text=Sarah', 'user', 1, 1, '2025-11-13 10:52:28', '2025-11-18 00:01:09');
INSERT INTO `users` VALUES (6, 'david_brown', 'david@example.com', '$2b$10$s29ww29Hopb2sox0cpb2fOnx.EOKz/xb8VHwWFRbWtAGTO/vV0bLe', 'David Brown', '0777123456', 'https://via.placeholder.com/150/DDA0DD/FFFFFF?text=David', 'user', 1, 1, '2025-11-13 10:52:28', '2025-11-18 00:01:09');
INSERT INTO `users` VALUES (7, 'sdds', 'user@example.com', '$2b$10$s29ww29Hopb2sox0cpb2fOnx.EOKz/xb8VHwWFRbWtAGTO/vV0bLe', 'dsds', '0386693354', NULL, 'user', 1, 0, '2025-11-18 00:00:54', '2025-11-18 00:00:54');

-- ----------------------------
-- Table structure for wishlist
-- ----------------------------
DROP TABLE IF EXISTS `wishlist`;
CREATE TABLE `wishlist`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique_user_wishlist`(`user_id` ASC, `product_id` ASC) USING BTREE,
  INDEX `product_id`(`product_id` ASC) USING BTREE,
  CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `wishlist_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of wishlist
-- ----------------------------
INSERT INTO `wishlist` VALUES (1, 2, 1, '2025-11-13 10:52:28');
INSERT INTO `wishlist` VALUES (2, 2, 4, '2025-11-13 10:52:28');
INSERT INTO `wishlist` VALUES (3, 2, 9, '2025-11-13 10:52:28');
INSERT INTO `wishlist` VALUES (4, 3, 5, '2025-11-13 10:52:28');
INSERT INTO `wishlist` VALUES (5, 3, 6, '2025-11-13 10:52:28');
INSERT INTO `wishlist` VALUES (6, 3, 15, '2025-11-13 10:52:28');
INSERT INTO `wishlist` VALUES (7, 3, 18, '2025-11-13 10:52:28');
INSERT INTO `wishlist` VALUES (8, 4, 1, '2025-11-13 10:52:28');
INSERT INTO `wishlist` VALUES (9, 4, 9, '2025-11-13 10:52:28');
INSERT INTO `wishlist` VALUES (10, 4, 19, '2025-11-13 10:52:28');
INSERT INTO `wishlist` VALUES (11, 5, 5, '2025-11-13 10:52:28');
INSERT INTO `wishlist` VALUES (12, 5, 12, '2025-11-13 10:52:28');
INSERT INTO `wishlist` VALUES (13, 5, 16, '2025-11-13 10:52:28');
INSERT INTO `wishlist` VALUES (14, 6, 6, '2025-11-13 10:52:28');
INSERT INTO `wishlist` VALUES (15, 6, 18, '2025-11-13 10:52:28');
INSERT INTO `wishlist` VALUES (16, 6, 20, '2025-11-13 10:52:28');

SET FOREIGN_KEY_CHECKS = 1;
