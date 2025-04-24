-- USE cinematch;
DELETE FROM USERS;

-- default password = pass123
INSERT INTO USERS (
    user_name,
    password,
    first_name,
    last_name,
    last_login,
    role,
    profile_picture_url
) VALUES
('joe', '12345678', 'Joe', 'Byjo', NOW(), 'admin', 'https://example.com/images/jdoe.jpg'),
('jdoe', 'pass123', 'John', 'Doe', NOW(), 'admin', 'https://example.com/images/jdoe.jpg'),
('asmith', 'pass123', 'Alice', 'Smith', NOW(), 'user', 'https://example.com/images/asmith.jpg'),
('bwayne', '$2b$10$7O1JlwOxkGKPSTwqD3v9MuHdy/Cl7PnyghPy/U.WZ7GVugSDMb7sO', 'Bruce', 'Wayne', NOW(), 'user', 'https://example.com/images/bwayne.jpg');
