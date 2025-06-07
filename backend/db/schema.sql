CREATE DATABASE IF NOT EXISTS cinematch;

USE cinematch;

DROP TABLE IF EXISTS `SESSIONS`;
DROP TABLE IF EXISTS `USERPREFERENCES`;
DROP TABLE IF EXISTS `USERLANGUAGES`;
DROP TABLE IF EXISTS `USERGENRES`;
DROP TABLE IF EXISTS `USERS`;
DROP TABLE IF EXISTS `USERSETTINGS`;
DROP TABLE IF EXISTS `USERRATINGS`;
DROP TABLE IF EXISTS `PREFERENCES`;
DROP TABLE IF EXISTS `MOVIEPROVIDERS`;
DROP TABLE IF EXISTS `MOVIEGENRES`;
DROP TABLE IF EXISTS `MOVIES`;
DROP TABLE IF EXISTS `WATCHPROVIDERS`;
DROP TABLE IF EXISTS `GENRES`;
DROP TABLE IF EXISTS `LANGUAGES`;


-- create genres table
CREATE TABLE `GENRES` (
    `id` int NOT NULL,
    `name` varchar(20) NOT NULL,
    PRIMARY KEY (`id`)
);

INSERT INTO `GENRES` VALUES (12,'Adventure'),(14,'Fantasy'),(16,'Animation'),(18,'Drama'),(27,'Horror'),(28,'Action'),(35,'Comedy'),(36,'History'),(37,'Western'),(53,'Thriller'),(80,'Crime'),(99,'Documentary'),(878,'Science Fiction'),(9648,'Mystery'),(10402,'Music'),(10749,'Romance'),(10751,'Family'),(10752,'War'),(10759,'Action & Adventure'),(10762,'Kids'),(10763,'News'),(10764,'Reality'),(10765,'Sci-Fi & Fantasy'),(10766,'Soap'),(10767,'Talk'),(10768,'War & Politics'),(10770,'TV Movie');

-- create languages table
CREATE TABLE `LANGUAGES` (
    `id` int NOT NULL AUTO_INCREMENT,
    `code` char(2) NOT NULL,  -- ISO 639-1 codes like 'en', 'hi', etc.
    `name` varchar(50) NOT NULL,
    PRIMARY KEY (`id`)
);

INSERT INTO `LANGUAGES` VALUES (1,'aa','Afar'),(2,'ab','Abkhazian'),(3,'ae','Avestan'),(4,'af','Afrikaans'),(5,'ak','Akan'),(6,'am','Amharic'),(7,'an','Aragonese'),(8,'ar','Arabic'),(9,'as','Assamese'),(10,'av','Avaric'),(11,'ay','Aymara'),(12,'az','Azerbaijani'),(13,'ba','Bashkir'),(14,'be','Belarusian'),(15,'bg','Bulgarian'),(16,'bh','Bihari'),(17,'bi','Bislama'),(18,'bm','Bambara'),(19,'bn','Bengali'),(20,'bo','Tibetan'),(21,'br','Breton'),(22,'bs','Bosnian'),(23,'ca','Catalan'),(24,'ce','Chechen'),(25,'ch','Chamorro'),(26,'co','Corsican'),(27,'cr','Cree'),(28,'cs','Czech'),(29,'cu','Church Slavic'),(30,'cv','Chuvash'),(31,'cy','Welsh'),(32,'da','Danish'),(33,'de','German'),(34,'dv','Divehi'),(35,'dz','Dzongkha'),(36,'ee','Ewe'),(37,'el','Greek, Modern'),(38,'en','English'),(39,'eo','Esperanto'),(40,'es','Spanish'),(41,'et','Estonian'),(42,'eu','Basque'),(43,'fa','Persian'),(44,'ff','Fulah'),(45,'fi','Finnish'),(46,'fj','Fijian'),(47,'fo','Faroese'),(48,'fr','French'),(49,'fy','Western Frisian'),(50,'ga','Irish'),(51,'gd','Gaelic'),(52,'gl','Galician'),(53,'gn','Guarani'),(54,'gu','Gujarati'),(55,'gv','Manx'),(56,'ha','Hausa'),(57,'he','Hebrew'),(58,'hi','Hindi'),(59,'ho','Hiri Motu'),(60,'hr','Croatian'),(61,'ht','Haitian'),(62,'hu','Hungarian'),(63,'hy','Armenian'),(64,'hz','Herero'),(65,'ia','Interlingua'),(66,'id','Indonesian'),(67,'ie','Interlingue'),(68,'ig','Igbo'),(69,'ii','Sichuan Yi'),(70,'ik','Inupiaq'),(71,'io','Ido'),(72,'is','Icelandic'),(73,'it','Italian'),(74,'iu','Inuktitut'),(75,'ja','Japanese'),(76,'jv','Javanese'),(77,'ka','Georgian'),(78,'kg','Kongo'),(79,'ki','Kikuyu'),(80,'kj','Kuanyama'),(81,'kk','Kazakh'),(82,'kl','Kalaallisut'),(83,'km','Central Khmer'),(84,'kn','Kannada'),(85,'ko','Korean'),(86,'kr','Kanuri'),(87,'ks','Kashmiri'),(88,'ku','Kurdish'),(89,'kv','Komi'),(90,'kw','Cornish'),(91,'ky','Kirghiz'),(92,'la','Latin'),(93,'lb','Luxembourgish'),(94,'lg','Ganda'),(95,'li','Limburgan'),(96,'ln','Lingala'),(97,'lo','Lao'),(98,'lt','Lithuanian'),(99,'lu','Luba-Katanga'),(100,'lv','Latvian'),(101,'mg','Malagasy'),(102,'mh','Marshallese'),(103,'mi','Maori'),(104,'mk','Macedonian'),(105,'ml','Malayalam'),(106,'mn','Mongolian'),(107,'mr','Marathi'),(108,'ms','Malay'),(109,'mt','Maltese'),(110,'my','Burmese'),(111,'na','Nauru'),(112,'ne','Nepali'),(113,'ng','Ndonga'),(114,'nl','Dutch'),(115,'no','Norwegian'),(116,'nv','Navajo'),(117,'oj','Ojibwa'),(118,'om','Oromo'),(119,'or','Oriya'),(120,'pa','Punjabi'),(121,'pi','Pali'),(122,'pl','Polish'),(123,'ps','Pashto'),(124,'pt','Portuguese'),(125,'qu','Quechua'),(126,'rm','Romansh'),(127,'rn','Rundi'),(128,'ro','Romanian'),(129,'ru','Russian'),(130,'sa','Sanskrit'),(131,'sc','Sardinian'),(132,'sd','Sindhi'),(133,'sg','Sango'),(134,'si','Sinhala'),(135,'sk','Slovak'),(136,'sl','Slovenian'),(137,'sm','Samoan'),(138,'sn','Shona'),(139,'so','Somali'),(140,'sq','Albanian'),(141,'sr','Serbian'),(142,'ss','Swati'),(143,'su','Sundanese'),(144,'sv','Swedish'),(145,'sw','Swahili'),(146,'ta','Tamil'),(147,'te','Telugu'),(148,'tg','Tajik'),(149,'th','Thai'),(150,'ti','Tigrinya'),(151,'tk','Turkmen'),(152,'tl','Tagalog'),(153,'tn','Tswana'),(154,'tr','Turkish'),(155,'ts','Tsonga'),(156,'tt','Tatar'),(157,'tw','Twi'),(158,'ty','Tahitian'),(159,'ug','Uighur'),(160,'uk','Ukrainian'),(161,'ur','Urdu'),(162,'uz','Uzbek'),(163,'ve','Venda'),(164,'vi','Vietnamese'),(165,'wa','Walloon'),(166,'wo','Wolof'),(167,'xh','Xhosa'),(168,'yi','Yiddish'),(169,'yo','Yoruba'),(170,'za','Zhuang; Chuang'),(171,'zh','Chinese'),(172,'zu','Zulu'),(173,'ot','Others');

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

-- create userlanguages table for user's lang preferences
CREATE TABLE `USERLANGUAGES` (
    `user_id` int NOT NULL,
    `language_id` int NOT NULL,
    PRIMARY KEY (`user_id`, `language_id`),
    FOREIGN KEY (`user_id`) REFERENCES `USERS` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`language_id`) REFERENCES `LANGUAGES` (`id`) ON DELETE CASCADE
);

-- create usergenres table for user's genre preferences
CREATE TABLE `USERGENRES` (
    `user_id` int NOT NULL,
    `genre_id` int NOT NULL,
    PRIMARY KEY (`user_id`, `genre_id`),
    FOREIGN KEY (`user_id`) REFERENCES `USERS` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`genre_id`) REFERENCES `GENRES` (`id`) ON DELETE CASCADE
);
