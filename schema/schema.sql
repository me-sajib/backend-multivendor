CREATE TABLE `users`
(
    `id`                        bigint UNSIGNED NOT NULL AUTO_INCREMENT,
    `name`                      varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `email`                     varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `email_verified_at`         timestamp NULL DEFAULT NULL,
    `mobile`                    varchar(255) COLLATE utf8mb4_unicode_ci          DEFAULT NULL,
    `status`                    enum('pending','verified','blocked','deleted') COLLATE
        utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
    `otp`                       varchar(10) COLLATE utf8mb4_unicode_ci           DEFAULT NULL,
    `password`                  varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `beta_access`               tinyint                                 NOT NULL DEFAULT '0',
    `allow_support_access`      tinyint(1) NOT NULL DEFAULT '0',
    `is_news_letter_subscribed` tinyint(1) NOT NULL DEFAULT '1',
    `signup_ip_address`         varchar(255) COLLATE utf8mb4_unicode_ci          DEFAULT NULL,
    `signup_source`             varchar(50) COLLATE utf8mb4_unicode_ci           DEFAULT NULL,
    `login_ip_address`          varchar(255) COLLATE utf8mb4_unicode_ci          DEFAULT NULL,
    `login_at`                  datetime                                         DEFAULT NULL,
    `created_at`                timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`                timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `users_meta`
(
    `id`         bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `meta_key`   varchar(255) NOT NULL,
    `meta_value` text         NOT NULL,
    `user_id`    bigint(20) UNSIGNED NOT NULL,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `websites`
(
    `id`          BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id`     BIGINT(20) UNSIGNED DEFAULT NULL,
    `label`       VARCHAR(100) DEFAULT NULL,
    `main_domain` VARCHAR(255) DEFAULT NULL,
    `full_url`    VARCHAR(255) DEFAULT NULL,
    `api_key`     VARCHAR(255) DEFAULT NULL,
    `wp_version`  VARCHAR(255) DEFAULT NULL,
    `php_version` VARCHAR(255) DEFAULT NULL,
    `site_meta`   LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (JSON_VALID(`site_meta`)),
    `status`      ENUM('pending','connected','disconnected','blocked','deleted') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
    `created_at`  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`  TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `tasks`
(
    `id`            BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `task_name`     VARCHAR(255) DEFAULT NULL,
    `task_type`     ENUM('wordpress','shopify','blogspot') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'wordpress',
    `user_id`       BIGINT(20) UNSIGNED DEFAULT NULL,
    `website_id`    BIGINT(20) UNSIGNED DEFAULT NULL,
    `status`        ENUM('pending','scheduled','running','failed','aborted','deleted','finished') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
    `created_at`    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    `scheduled_for` TIMESTAMP    DEFAULT NULL,
    `updated_at`    TIMESTAMP    DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `tasks_meta`
(
    `id`         bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `task_id`    bigint(20) UNSIGNED NOT NULL,
    `meta_key`   varchar(255) NOT NULL,
    `meta_value` text         NOT NULL,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
