DROP TABLE IF EXISTS topics;

CREATE TABLE IF NOT EXISTS topics (
	title VARCHAR(50) PRIMARY KEY,
	description VARCHAR(500)
);

-- Sample data
INSERT INTO topics VALUES ('Programming', 'Working with computers.');