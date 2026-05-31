-- Script cap nhat anh sneaker that cho san pham
-- Su dung anh tu brands/products sneaker noi tieng

UPDATE products SET 
  images = '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80","https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80&auto=format","https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80"]',
  name = 'Nike Air Max 270 React'
WHERE id = 1;

UPDATE products SET 
  images = '["https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80","https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80&auto=format","https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800&q=80"]',
  name = 'Adidas Ultraboost 22'
WHERE id = 2;

UPDATE products SET 
  images = '["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80","https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80&auto=format","https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80"]',
  name = 'Jordan 1 Retro High OG'
WHERE id = 3;

UPDATE products SET 
  images = '["https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80","https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80&auto=format","https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"]',
  name = 'New Balance 574 Classic'
WHERE id = 4;

UPDATE products SET 
  images = '["https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80","https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80&auto=format","https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80"]',
  name = 'Puma RS-X Reinvention'
WHERE id = 5;

UPDATE products SET 
  images = '["https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80","https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80&auto=format","https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80"]',
  name = 'Vans Old Skool Pro'
WHERE id = 6;

-- Xac nhan ket qua
SELECT id, name, images FROM products ORDER BY id;
