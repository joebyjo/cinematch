CREATE DATABASE IF NOT EXISTS cinematch;

USE cinematch;

DROP TABLE IF EXISTS `USERS`;

CREATE TABLE IF NOT EXISTS `USERS` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_name` VARCHAR(10) NOT NULL UNIQUE,
    `password` VARCHAR(256) NOT NULL,
    `first_name` VARCHAR(20) NOT NULL,
    `last_name` VARCHAR(20) NOT NULL,
    `last_login` DATETIME DEFAULT NULL,
    `role` VARCHAR(5) NOT NULL DEFAULT 'user',
    `profile_picture_url` VARCHAR(256) DEFAULT NULL,
    `registration_date` DATE NOT NULL DEFAULT (CURRENT_DATE)
);