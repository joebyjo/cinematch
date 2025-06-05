CREATE DATABASE IF NOT EXISTS cinematch;

USE cinematch;

DROP TABLE IF EXISTS `SESSIONS`;
DROP TABLE IF EXISTS `USERPREFERENCES`;
DROP TABLE IF EXISTS `USERS`;
DROP TABLE IF EXISTS `USERSETTINGS`;
DROP TABLE IF EXISTS `USERRATINGS`;
DROP TABLE IF EXISTS `PREFERENCES`;
DROP TABLE IF EXISTS `MOVIEPROVIDERS`;
DROP TABLE IF EXISTS `MOVIEGENRES`;
DROP TABLE IF EXISTS `MOVIES`;
DROP TABLE IF EXISTS `WATCHPROVIDERS`;
DROP TABLE IF EXISTS `GENRES`;


-- create genres table
CREATE TABLE `GENRES` (
    `id` int NOT NULL,
    `name` varchar(20) NOT NULL,
    PRIMARY KEY (`id`)
);

INSERT INTO `GENRES` VALUES (12,'Adventure'),(14,'Fantasy'),(16,'Animation'),(18,'Drama'),(27,'Horror'),(28,'Action'),(35,'Comedy'),(36,'History'),(37,'Western'),(53,'Thriller'),(80,'Crime'),(99,'Documentary'),(878,'Science Fiction'),(9648,'Mystery'),(10402,'Music'),(10749,'Romance'),(10751,'Family'),(10752,'War'),(10759,'Action & Adventure'),(10762,'Kids'),(10763,'News'),(10764,'Reality'),(10765,'Sci-Fi & Fantasy'),(10766,'Soap'),(10767,'Talk'),(10768,'War & Politics'),(10770,'TV Movie');

-- create watchproviders table
CREATE TABLE `WATCHPROVIDERS` (
    `id` int NOT NULL,
    `provider_name` varchar(100) NOT NULL,
    `logo_path` varchar(255) DEFAULT NULL,
    `display_priority` int DEFAULT NULL,
    PRIMARY KEY (`id`)
);

INSERT INTO `WATCHPROVIDERS` VALUES (2,'Apple TV','/9ghgSC0MA082EL6HLCW3GalykFD.jpg',2),(8,'Netflix','/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg',5),(9,'Amazon Prime Video','/pvske1MyAoymrs5bguRfVqYiM9a.jpg',2),(10,'Amazon Video','/seGSXajazLMCKGB5hnRCidtjay1.jpg',5),(15,'Hulu','/bxBlRPEPpMVDc4jMhSrTf2339DW.jpg',7),(337,'Disney Plus','/97yvRBw1GzX7fXprcF80er19ot.jpg',26),(350,'Apple TV+','/2E03IAZsX4ZaUqM7tXlctEPMGWS.jpg',9),(386,'Peacock Premium','/2aGrp1xw3qhwCYvNGAJZPdjfeeX.jpg',14),(531,'Paramount Plus','/h5DcR0J2EESLitnhR8xLG1QymTE.jpg',6),(1770,'Paramount+ with Showtime','/kkUHFtdjasnnOknZN69TbZ2fCTh.jpg',19),(1899,'Max','/170ZfHTLT6ZlG38iLLpNYcBGUkG.jpg',28),(1968,'Crunchyroll Amazon Channel','/pgjz7bzfBq4nFDu8JJDLBoUVAX8.jpg',13);

-- create movies table
CREATE TABLE `MOVIES` (
    `id` int NOT NULL,
    `title` varchar(256) NOT NULL,
    `director` varchar(100) DEFAULT NULL,
    `cast` varchar(200) DEFAULT NULL,
    `imdb_id` varchar(15) DEFAULT NULL,
    `original_language` char(2) DEFAULT NULL,
    `overview` varchar(1000) DEFAULT NULL,
    `release_date` date DEFAULT NULL,
    `imdb_rating` float DEFAULT NULL,
    `rotten_rating` smallint DEFAULT NULL,
    `metacritic_rating` smallint DEFAULT NULL,
    `poster_url` varchar(256) DEFAULT NULL,
    `backdrop_url` varchar(256) DEFAULT NULL,
    `trailer_url` varchar(256) DEFAULT NULL,
    `run_time` smallint DEFAULT NULL,
    `certification` varchar(15) DEFAULT NULL,
    PRIMARY KEY (`id`)
);

-- create moviesgenres table
CREATE TABLE `MOVIEGENRES` (
    `movie_id` int NOT NULL,
    `genre_id` int NOT NULL,
    PRIMARY KEY (`movie_id`,`genre_id`),
    KEY `genre_id` (`genre_id`),
    CONSTRAINT `MOVIEGENRES_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `MOVIES` (`id`) ON DELETE CASCADE,
    CONSTRAINT `MOVIEGENRES_ibfk_2` FOREIGN KEY (`genre_id`) REFERENCES `GENRES` (`id`) ON DELETE CASCADE
);

-- create movieproviders table
CREATE TABLE `MOVIEPROVIDERS` (
    `movie_id` int NOT NULL,
    `provider_id` int NOT NULL,
    PRIMARY KEY (`movie_id`,`provider_id`),
    KEY `provider_id` (`provider_id`),
    CONSTRAINT `MOVIEPROVIDERS_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `MOVIES` (`id`) ON DELETE CASCADE,
    CONSTRAINT `MOVIEPROVIDERS_ibfk_2` FOREIGN KEY (`provider_id`) REFERENCES `WATCHPROVIDERS` (`id`) ON DELETE CASCADE
);

-- create preferences table
CREATE TABLE `PREFERENCES` (
    `id` int NOT NULL AUTO_INCREMENT,
    `is_liked` BOOLEAN DEFAULT FALSE,
    `watch_status` TINYINT DEFAULT 0,
    PRIMARY KEY (`id`)
);

INSERT INTO `PREFERENCES` VALUES (1,1,0),(2,1,1),(3,1,2),(4,0,0),(5,0,1),(6,0,2);

-- create users table
CREATE TABLE `USERS` (
    `id` int NOT NULL AUTO_INCREMENT,
    `user_name` varchar(10) NOT NULL,
    `password` varchar(256) NOT NULL,
    `first_name` varchar(20) NOT NULL,
    `last_name` varchar(20) NOT NULL,
    `last_login` datetime DEFAULT NULL,
    `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    `profile_picture_url` varchar(256) DEFAULT NULL,
    `registration_date` date NOT NULL DEFAULT (curdate()),
    PRIMARY KEY (`id`),
    UNIQUE KEY `user_name` (`user_name`)
);


-- create users table
CREATE TABLE `USERSETTINGS` (
    `user_id` int DEFAULT NULL,
    `theme` enum('dark','light') NOT NULL DEFAULT 'dark',
    `user_vector` json DEFAULT NULL,
    KEY `user_id` (`user_id`),
    CONSTRAINT `USERSETTINGS_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `USERS` (`id`) ON DELETE CASCADE
);


-- create useserratings table
CREATE TABLE `USERRATINGS` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rating` float DEFAULT NULL,
  `review` varchar(200) DEFAULT NULL,
  `modified_at` date DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- create userpreferences table
CREATE TABLE `USERPREFERENCES` (
    `user_id` int DEFAULT NULL,
    `preference_id` int NOT NULL,
    `movie_id` int NOT NULL,
    `user_rating_id` int DEFAULT NULL,
    `score`  DOUBLE PRECISION DEFAULT -1,
    `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
    KEY `user_id` (`user_id`),
    KEY `preference_id` (`preference_id`),
    KEY `movie_id` (`movie_id`),
    KEY `USERPREFERENCES_ibfk_4` (`user_rating_id`),
    CONSTRAINT `USERPREFERENCES_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `USERS` (`id`) ON DELETE CASCADE,
    CONSTRAINT `USERPREFERENCES_ibfk_2` FOREIGN KEY (`preference_id`) REFERENCES `PREFERENCES` (`id`) ON DELETE CASCADE,
    CONSTRAINT `USERPREFERENCES_ibfk_3` FOREIGN KEY (`movie_id`) REFERENCES `MOVIES` (`id`) ON DELETE CASCADE,
    CONSTRAINT `USERPREFERENCES_ibfk_4` FOREIGN KEY (`user_rating_id`) REFERENCES `USERRATINGS` (`id`) ON DELETE CASCADE
);

-- create sessions table for session store
CREATE TABLE `SESSIONS` (
  `id` varchar(128) NOT NULL,
  `expires` int unsigned NOT NULL,
  `data` text,
  `user_id` int DEFAULT NULL,
  `ip_address` varchar(64) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `last_seen` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `SESSIONS_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `USERS` (`id`) ON DELETE CASCADE
);

CREATE TABLE `LANGUAGES` (
    `id` int NOT NULL AUTO_INCREMENT,
    `code` char(2) NOT NULL,  -- ISO 639-1 codes like 'en', 'hi', etc.
    `name` varchar(50) NOT NULL,
    PRIMARY KEY (`id`)
);

INSERT INTO `LANGUAGES` (`code`, `name`) VALUES
('en', 'English'),
('hi', 'Hindi'),
('tl', 'Tagalog'),
('te', 'Telugu'),
('ja', 'Japanese'),
('ml', 'Malayalam'),
('es', 'Spanish'),
('ot', 'Others');

CREATE TABLE `USERLANGUAGES` (
    `user_id` int NOT NULL,
    `language_id` int NOT NULL,
    PRIMARY KEY (`user_id`, `language_id`),
    FOREIGN KEY (`user_id`) REFERENCES `USERS` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`language_id`) REFERENCES `LANGUAGES` (`id`) ON DELETE CASCADE
);

CREATE TABLE `USERGENRES` (
    `user_id` int NOT NULL,
    `genre_id` int NOT NULL,
    PRIMARY KEY (`user_id`, `genre_id`),
    FOREIGN KEY (`user_id`) REFERENCES `USERS` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`genre_id`) REFERENCES `GENRES` (`id`) ON DELETE CASCADE
);
