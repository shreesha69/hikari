SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- [CLEANED] Removed CREATE DATABASE and USE for cPanel compatibility.
-- Make sure to select your database in phpMyAdmin BEFORE importing.


-- 2. Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Products Table
CREATE TABLE IF NOT EXISTS `products` (
  `id` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(50) NOT NULL,
  `image` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `status` enum('Placed','Processing','Shipped','Delivered') DEFAULT 'Placed',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Order Items Table
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `product_id` varchar(50) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Insert Default Admin (Password: admin)
INSERT INTO `users` (`name`, `email`, `password`, `role`) 
VALUES ('Hikari Admin', 'admin@hikari.com', 'admin', 'admin');

-- 7. Seed Products (Example from products.json)
INSERT INTO `products` (`id`, `name`, `price`, `category`, `image`, `description`) VALUES
('c1', 'Sakura Glow Candle', 899.00, 'candles', 'images/candles/c1.jpg', 'A delicate blend of cherry blossom and warm vanilla.'),
('c2', 'Zen Garden Candle', 1099.00, 'candles', 'images/candles/c2.jpg', 'Calming matcha and sandalwood notes perfect for meditation.'),
('c3', 'Midnight Bamboo Candle', 799.00, 'candles', 'images/candles/c3.jpg', 'Fresh bamboo and midnight musk. Elevate your evening routine.'),
('c4', 'Kyoto Autumn Candle', 949.00, 'candles', 'https://images.unsplash.com/photo-1603006338315-eb3b32c45388?auto=format&fit=crop&q=80&w=800&h=800', 'Warm maple and spiced cedarwood. Captures the essence of autumn.'),
('l1', 'Aurora String Lights', 699.00, 'lights', 'images/lights/l1.jpg', 'Warm LED string lights inspired by the northern lights.'),
('l2', 'Kyoto Lantern Lamp', 1499.00, 'lights', 'images/lights/l2.jpg', 'Traditional Japanese lantern design with modern fading LED.'),
('l3', 'Moonlight Table Glow', 1799.00, 'lights', 'images/lights/l3.jpg', 'A beautiful glowing sphere that mimics the soft light of a full moon.'),
('l4', 'Vintage Edison Bulb Set', 1299.00, 'lights', 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800&h=800', 'Warm amber glow with decorative filaments. Perfect for industrial interiors.');


COMMIT;
