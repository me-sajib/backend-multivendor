CREATE TABLE `users`
(
    `id`                        bigint UNSIGNED NOT NULL AUTO_INCREMENT,
    `username`                  varchar(55) COLLATE utf8mb4_unicode_ci NOT NULL,
    `email`                     varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `mobile`                    varchar(255) COLLATE utf8mb4_unicode_ci          DEFAULT NULL,
    `role`                      varchar(255) COLLATE utf8mb4_unicode_ci          DEFAULT NULL,
    `is_admin`                  BOOLEAN NOT NULL DEFAULT FALSE,
    `status`                    enum('pending','verified','blocked','deleted') COLLATE
        utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
    `address`                   varchar(255) COLLATE utf8mb4_unicode_ci          DEFAULT NULL,
    `otp`                       varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `password`                  varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `token`                     varchar(255) COLLATE utf8mb4_unicode_ci          DEFAULT NULL,
    `login_at`                  datetime                                         DEFAULT NULL,
    `created_at`                timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`                timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `orders`
(
    `id`          BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id`     BIGINT(20) UNSIGNED DEFAULT NULL,
    `product_ids` VARCHAR(100) DEFAULT NULL,
    `ordered_products` LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (JSON_VALID(`ordered_products`)),
    `status`      ENUM('pending','processing','shipped','delivered','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
    `payment_status` ENUM('pending','paid','failed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
    `payment_method` ENUM('cash','bkash','nogod', 'roket', 'card') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'cash',
    `total`       INT(11) UNSIGNED DEFAULT NULL,
    `delivery_address` LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (JSON_VALID(`delivery_address`)),
    `delivery_date` DATE DEFAULT NULL,
    `created_at`  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`  TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `products` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `price` DECIMAL(10, 2) NOT NULL,
  `quantity` INT NOT NULL,
  `color`    VARCHAR(255) DEFAULT NULL,
  `category_id` INT DEFAULT NULL,
  `brand` VARCHAR(100),
  `sku` VARCHAR(50),
  `weight` DECIMAL(10, 2),
  `images` TEXT,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `is_featured` BOOLEAN NOT NULL DEFAULT FALSE,
  `rating` DECIMAL(3, 2),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `reviews` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `product_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `rating` TINYINT NOT NULL,
  `comment` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
