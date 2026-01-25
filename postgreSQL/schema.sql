DROP TABLE IF EXISTS Comments;
DROP TABLE IF EXISTS Posts;
DROP TABLE IF EXISTS Topics;
DROP TABLE IF EXISTS Users;

CREATE TABLE IF NOT EXISTS Users (
    name VARCHAR(100) PRIMARY KEY,
    password VARCHAR(200)
);

CREATE TABLE IF NOT EXISTS Topics (
	title VARCHAR(100) PRIMARY KEY,
	description VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS Posts (
	id SERIAL PRIMARY KEY,
    topic_title VARCHAR(100),
    title VARCHAR(200),
    user_name VARCHAR(100),
	body VARCHAR(10000),
    FOREIGN KEY (topic_title) REFERENCES Topics (title) ON UPDATE CASCADE,
    FOREIGN KEY (user_name) REFERENCES Users (name) ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Comments (
	id SERIAL PRIMARY KEY,
    post_id INT,
    user_name VARCHAR(100),
    body VARCHAR(10000),
    FOREIGN KEY (post_id) REFERENCES Posts (id) ON UPDATE CASCADE,
    FOREIGN KEY (user_name) REFERENCES Users (name) ON UPDATE CASCADE
);

-- Sample data
INSERT INTO Users VALUES ('thelegend27', 'abc123');
INSERT INTO Topics VALUES ('Programming', 'Working with computers.');
INSERT INTO Posts (topic_title, title, user_name, body) VALUES ('Programming', 'Hello world is dumb.', 'thelegend27', 'This is the body of yo mama.');