CREATE DATABASE IF NOT EXISTS single_product_shop;
USE single_product_shop;

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL,
  full_name VARCHAR(150),
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  phone VARCHAR(20),
  avatar VARCHAR(255),
  role ENUM('user', 'admin') DEFAULT 'user',
  is_active TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(120) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  category_id INT NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  stock INT DEFAULT 0,
  sales_count INT DEFAULT 0,
  views_count INT DEFAULT 0,
  images JSON,
  attributes JSON,
  is_promotion TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

INSERT INTO users (username, full_name, email, password_hash, phone, avatar, role, is_active) VALUES
('Thao', 'Le Thi Thao', 'member1@example.com', '$2b$10$lgbkvkRCQyLrAC9rFbYfJeMmLjpVAbVs1XJoeuxWmSn0KpW5DXYCi', '0901234567', 'https://i.pravatar.cc/120?img=12', 'user', 1),
('Admin', 'Quan tri vien', 'admin@example.com', '$2b$10$RLcVn5gVrJdrVQBEMbu5EeS5BiTEbBFzTN2R60tZlhZIr.4xcIcvy', '0909999999', 'https://i.pravatar.cc/120?img=3', 'admin', 1)
ON DUPLICATE KEY UPDATE username = VALUES(username);

INSERT INTO categories (name, slug) VALUES
('Sneaker Cao Cap', 'sneaker-cao-cap'),
('Sneaker Chay Bo', 'sneaker-chay-bo'),
('Sneaker Streetwear', 'sneaker-streetwear')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO products (name, description, category_id, price, stock, sales_count, views_count, images, attributes, is_promotion)
VALUES
('Apex Prime Leather', 'Sneaker da that cao cap, em chan va ben bi.', 1, 3200000, 20, 180, 1600,
 JSON_ARRAY('https://picsum.photos/id/21/1200/900','https://picsum.photos/id/26/1200/900'),
 JSON_OBJECT('color', 'White/Red', 'material', 'Leather'), 1),
('Velocity Run X', 'Toi uu cho chay bo duong dai.', 2, 2600000, 35, 220, 2400,
 JSON_ARRAY('https://picsum.photos/id/30/1200/900','https://picsum.photos/id/42/1200/900'),
 JSON_OBJECT('color', 'Black', 'material', 'Mesh'), 0),
('Urban Hype 77', 'Thiet ke streetwear tre trung.', 3, 2100000, 0, 300, 2800,
 JSON_ARRAY('https://picsum.photos/id/60/1200/900','https://picsum.photos/id/96/1200/900'),
 JSON_OBJECT('color', 'Cream', 'material', 'Canvas'), 1);


USE single_product_shop;

UPDATE products
SET images = JSON_ARRAY('https://picsum.photos/id/21/1200/900','https://picsum.photos/id/26/1200/900')
WHERE id = 1;

UPDATE products
SET images = JSON_ARRAY('https://picsum.photos/id/30/1200/900','https://picsum.photos/id/42/1200/900')
WHERE id = 2;

UPDATE products
SET images = JSON_ARRAY('https://picsum.photos/id/60/1200/900','https://picsum.photos/id/96/1200/900')
WHERE id = 3;

CREATE TABLE IF NOT EXISTS otp_tokens (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(150) NOT NULL,
  otp_code VARCHAR(10) NOT NULL,
  type ENUM('register', 'reset_password') NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_otp_email_type (email, type)
);

-- Dữ liệu mẫu bổ sung cho Shop Sneaker (Dùng để test Filter/Pagination)
INSERT INTO products (name, description, category_id, price, stock, sales_count, views_count, images, attributes, is_promotion)
VALUES 
('Nike Air Jordan 1 High', 'Phối màu Chicago huyền thoại.', 1, 15000000, 5, 20, 5000, 
 JSON_ARRAY('https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800'), 
 JSON_OBJECT('brand', 'Nike', 'color', 'Red/White'), 0),
('Adidas Yeezy Boost 350', 'Thiết kế bởi Kanye West, cực kỳ êm ái.', 3, 9500000, 10, 50, 3200, 
 JSON_ARRAY('https://images.unsplash.com/photo-1584486520270-19eca1efcce5?w=800'), 
 JSON_OBJECT('brand', 'Adidas', 'color', 'Black'), 1),
('New Balance 550 White', 'Phong cách retro đang là xu hướng.', 3, 3500000, 15, 85, 2100, 
 JSON_ARRAY('https://images.unsplash.com/photo-1539185441755-769473a23570?w=800'), 
 JSON_OBJECT('brand', 'New Balance', 'color', 'White'), 0),
('Nike Air Force 1 Low', 'Mẫu giày quốc dân dễ phối đồ.', 1, 2900000, 100, 500, 10000, 
 JSON_ARRAY('https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800'), 
 JSON_OBJECT('brand', 'Nike', 'color', 'White'), 0),
('Vans Old Skool Classic', 'Bền bỉ cho các hoạt động hàng ngày.', 3, 1850000, 40, 200, 4500, 
 JSON_ARRAY('https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800'), 
 JSON_OBJECT('brand', 'Vans', 'color', 'Black'), 0),
('Puma RS-X Reinvent', 'Công nghệ đệm RS cực tốt cho chạy bộ.', 2, 3200000, 12, 40, 1500, 
 JSON_ARRAY('https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800'), 
 JSON_OBJECT('brand', 'Puma', 'color', 'Multi'), 1);

-- Them du lieu mau de test Pagination & Lazy Loading
INSERT INTO products (name, description, category_id, price, stock, sales_count, views_count, images, attributes, is_promotion)
VALUES 
('Nike Air Jordan 1', 'Mau sneaker huyen thoai.', 1, 4500000, 10, 50, 500, JSON_ARRAY('https://picsum.photos/id/103/1200/900'), JSON_OBJECT('color', 'Red/Black'), 0),
('Adidas Ultraboost 22', 'Chay bo em ai.', 2, 3800000, 15, 80, 700, JSON_ARRAY('https://picsum.photos/id/104/1200/900'), JSON_OBJECT('color', 'White'), 1),
('Yeezy Boost 350', 'Phong cach streetwear.', 3, 6000000, 5, 20, 1200, JSON_ARRAY('https://picsum.photos/id/106/1200/900'), JSON_OBJECT('color', 'Grey'), 0),
('Puma Suede Classic', 'Co dien va thanh lich.', 1, 1900000, 25, 100, 400, JSON_ARRAY('https://picsum.photos/id/107/1200/900'), JSON_OBJECT('color', 'Blue'), 0),
('New Balance 550', 'Xu huong retro.', 3, 3200000, 12, 45, 900, JSON_ARRAY('https://picsum.photos/id/108/1200/900'), JSON_OBJECT('color', 'Green/White'), 1),
('Vans Old Skool', 'Ben bi cho dan truot van.', 3, 1500000, 50, 200, 1500, JSON_ARRAY('https://picsum.photos/id/109/1200/900'), JSON_OBJECT('color', 'Black/White'), 0),
('Converse Chuck 70', 'Khong bao gio loi mot.', 3, 1800000, 40, 150, 1100, JSON_ARRAY('https://picsum.photos/id/110/1200/900'), JSON_OBJECT('color', 'Parchment'), 0),
('Asics Gel-Kayano', 'On dinh cho nguoi chay bo.', 2, 3500000, 18, 30, 600, JSON_ARRAY('https://picsum.photos/id/111/1200/900'), JSON_OBJECT('color', 'Blue/Orange'), 0),
('Reebok Club C 85', 'Thiet ke toi gian.', 1, 2200000, 20, 60, 450, JSON_ARRAY('https://picsum.photos/id/112/1200/900'), JSON_OBJECT('color', 'White'), 0),
('Balenciaga Triple S', 'Chunky sneaker dinh cao.', 1, 25000000, 3, 5, 3000, JSON_ARRAY('https://picsum.photos/id/113/1200/900'), JSON_OBJECT('color', 'Multi'), 0);