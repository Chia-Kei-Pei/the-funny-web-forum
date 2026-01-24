DROP TABLE IF EXISTS Posts;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Topics;

CREATE TABLE IF NOT EXISTS Users (
    id VARCHAR(100) PRIMARY KEY,
    password VARCHAR(200)
);

CREATE TABLE IF NOT EXISTS Topics (
	title VARCHAR(100) PRIMARY KEY,
	description VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS Posts (
    topic VARCHAR(100),
    title VARCHAR(200),
    user_id VARCHAR(100),
	body VARCHAR(10000),
    PRIMARY KEY (topic, title),
    FOREIGN KEY (topic) REFERENCES Topics (title) ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users (id) ON UPDATE CASCADE
);

-- Sample data
INSERT INTO Topics VALUES ('Programming', 'Working with computers.');
INSERT INTO Users VALUES ('thelegend27', 'abc123');