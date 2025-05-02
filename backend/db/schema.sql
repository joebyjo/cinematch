CREATE DATABASE IF NOT EXISTS cinematch;

USE cinematch;

DROP TABLE IF EXISTS `USERPREFERENCES`;
DROP TABLE IF EXISTS `USERRATINGS`;
DROP TABLE IF EXISTS `MOVIEGENRES`;
DROP TABLE IF EXISTS `MOVIES`;
DROP TABLE IF EXISTS `GENRES`;
DROP TABLE IF EXISTS `PREFERENCES`;
DROP TABLE IF EXISTS `USERS`;


-- create users table
CREATE TABLE `USERS` (
    `id` int NOT NULL AUTO_INCREMENT,
    `user_name` varchar(10) NOT NULL,
    `password` varchar(256) NOT NULL,
    `first_name` varchar(20) NOT NULL,
    `last_name` varchar(20) NOT NULL,
    `last_login` datetime DEFAULT NULL,
    `role` varchar(5) NOT NULL DEFAULT 'user',
    `profile_picture_url` varchar(256) DEFAULT NULL,
    `registration_date` date NOT NULL DEFAULT (curdate()),
    PRIMARY KEY (`id`),
    UNIQUE KEY `user_name` (`user_name`)
);

-- create preferences table
CREATE TABLE `PREFERENCES` (
    `id` int NOT NULL AUTO_INCREMENT,
    `is_watched` BOOLEAN DEFAULT FALSE,
    `is_liked` BOOLEAN DEFAULT FALSE,
    `is_disliked` BOOLEAN DEFAULT FALSE,
    `is_bookmarked` BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (`id`)
);

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

-- create genres table
CREATE TABLE `GENRES` (
    `id` int NOT NULL,
    `name` varchar(20) NOT NULL,
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

-- create watchproviders table
CREATE TABLE `WATCHPROVIDERS` (
  `id` int NOT NULL,
  `provider_name` varchar(100) NOT NULL,
  `logo_path` varchar(255) DEFAULT NULL,
  `display_priority` int DEFAULT NULL,
  PRIMARY KEY (`id`)
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


-- create useserratings table
CREATE TABLE `USERRATINGS` (
    `id` int NOT NULL,
    `rating` float DEFAULT NULL,
    `review` varchar(200) DEFAULT NULL,
    `watched_at` date DEFAULT NULL,
    `reviewed_at` date DEFAULT NULL,
    PRIMARY KEY (`id`)
) ;

-- create userpreferences table
CREATE TABLE `USERPREFERENCES` (
    `user_id` int DEFAULT NULL,
    `preference_id` int DEFAULT NULL,
    `movie_id` int DEFAULT NULL,
    `user_rating_id` int NOT NULL,
    `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`user_rating_id`),
    KEY `user_id` (`user_id`),
    KEY `preference_id` (`preference_id`),
    KEY `movie_id` (`movie_id`),
    CONSTRAINT `USERPREFERENCES_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `USERS` (`id`) ON DELETE CASCADE,
    CONSTRAINT `USERPREFERENCES_ibfk_2` FOREIGN KEY (`preference_id`) REFERENCES `PREFERENCES` (`id`) ON DELETE CASCADE,
    CONSTRAINT `USERPREFERENCES_ibfk_3` FOREIGN KEY (`movie_id`) REFERENCES `MOVIES` (`id`) ON DELETE CASCADE,
    CONSTRAINT `USERPREFERENCES_ibfk_4` FOREIGN KEY (`user_rating_id`) REFERENCES `USERRATINGS` (`id`) ON DELETE CASCADE
);
