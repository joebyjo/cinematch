-- USE cinematch;
DELETE FROM USERS;

INSERT INTO USERS (
    user_name,
    password,
    first_name,
    last_name,
    last_login,
    role,
    profile_picture_url
) VALUES
(1,'liri','$2b$10$vaWe0oxb1bwhgVRK/oNrsuKmZgCuBXzb76I86Dg2MMdYjIWRiPayC','liri','das',NULL,'user',NULL,'2025-04-24'),
(2,'joe','$2b$10$7xXplZAn8Pjx0j2mZShsq.zI6EyMPGASlD155G8S7bkn8WD6swBg.','joe','byjo',NULL,'user',NULL,'2025-04-24'),
(3,'hiten','$2b$10$2dXbB7oxHfH3U/8qgS3kFO2fQOuWJtq3pALB8X2Z8CBLU1lMgyr4O','hiten','gupta',NULL,'user',NULL,'2025-04-24'),
(4,'josheen','$2b$10$dhlcs0pHzf7ioqqhJZ.dkeQJ1hc5TXiBYHwHbca9uqGanQMk9h87i','josheen','kour',NULL,'user',NULL,'2025-04-24');
