USE single_product_shop;

-- Chay tung lenh, bo qua neu cot da ton tai
ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NULL;
ALTER TABLE users ADD COLUMN phone VARCHAR(20) NULL;
ALTER TABLE users ADD COLUMN full_name VARCHAR(150) NULL;
ALTER TABLE users ADD COLUMN is_active TINYINT(1) DEFAULT 0;
ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE users MODIFY role ENUM('user', 'admin', 'member') DEFAULT 'user';
UPDATE users SET role = 'user' WHERE role = 'member';

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

UPDATE users SET
  username = 'Thao',
  full_name = 'Le Thi Thao',
  phone = '0901234567',
  password_hash = '$2b$10$lgbkvkRCQyLrAC9rFbYfJeMmLjpVAbVs1XJoeuxWmSn0KpW5DXYCi',
  is_active = 1,
  role = 'user'
WHERE email = 'member1@example.com';

UPDATE users SET
  username = 'Admin',
  full_name = 'Quan tri vien',
  phone = '0909999999',
  password_hash = '$2b$10$RLcVn5gVrJdrVQBEMbu5EeS5BiTEbBFzTN2R60tZlhZIr.4xcIcvy',
  is_active = 1,
  role = 'admin'
WHERE email = 'admin@example.com';
