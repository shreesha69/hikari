-- Hikari Database Setup Script
-- Database: hikari_db

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- 1. Create Database
CREATE DATABASE IF NOT EXISTS `hikari_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `hikari_db`;

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
('l1', 'Aurora String Lights', 699.00, 'lights', 'images/candles/c3.jpg', 'Warm LED string lights inspired by the northern lights.');

COMMIT;
