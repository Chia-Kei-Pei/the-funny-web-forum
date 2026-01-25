package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq" // Import pq for PostgreSQL driver
)

type Topic struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

type Post struct {
	ID         int    // automatically has `json:"ID"`
	TopicTitle string `json:"topic_title"`
	Title      string `json:"title"`
	UserName   string `json:"user_name"`
	Body       string `json:"body"`
}

type Comment struct {
	ID       int    // automatically has `json:"ID"`
	PostID   int    `json:"post_id"`
	UserName string `json:"user_name"`
	Body     string `json:"body"`
}

// global variables
var db *sql.DB

func main() {
	// environment variables
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	POSTGRES_CRED := os.Getenv("POSTGRES_CRED")

	// postgres database
	db, err = sql.Open("postgres", POSTGRES_CRED)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// ping database
	if err = db.Ping(); err != nil {
		log.Fatal(err)
	}
	fmt.Println("Connected to PostgreSQL database successfully!")

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173",
		AllowHeaders: "Origin,Content-Type,Accept",
	}))

	PORT := os.Getenv("PORT")

	// Query from Topics
	app.Get("/api/topics/:topic_title", getTopic)
	app.Get("/api/topics", getTopics)
	app.Post("/api/topics", createTopic)
	app.Patch("/api/topics/:topic_title", updateTopic)
	app.Delete("/api/topics/:topic_title", deleteTopic)

	// Query from Posts
	app.Get("/api/posts/:post_id", getPost)
	app.Get("/api/topics/:topic_title/posts", getPosts)
	app.Post("/api/posts", createPost)
	app.Patch("/api/posts/:post_id", updatePost)
	app.Delete("/api/posts/:post_id", deletePost)

	// Query from Comments
	app.Get("/api/posts/:post_id/comments", getComments)
	app.Post("/api/comments", createComment)
	app.Patch("/api/comments/:comment_id", updateComment)
	app.Delete("/api/comments/:comment_id", deleteComment)

	log.Fatal(app.Listen(":" + PORT))
}

func getTopic(c *fiber.Ctx) error {
	target_topic_title := c.Params("topic_title")
	var topic Topic

	row := db.QueryRow(`SELECT * FROM Topics WHERE title = $1;`, target_topic_title)
	err := row.Scan(&topic.Title, &topic.Description)

	if err != nil {
		if err == sql.ErrNoRows {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "Topic not found",
			})
		}
		return err
	}

	return c.JSON(topic)
}

func getTopics(c *fiber.Ctx) error {
	var topics []Topic

	rows, err := db.Query("SELECT * FROM Topics;")
	if err != nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var topic Topic
		if err := rows.Scan(&topic.Title, &topic.Description); err != nil {
			return err
		}
		topics = append(topics, topic)
	}

	return c.JSON(topics)
}

func createTopic(c *fiber.Ctx) error {
	topic := new(Topic) // topic is a pointer

	// bind the request body to the struct, topic
	if err := c.BodyParser(topic); err != nil {
		fmt.Println("main.go createTopic(): BodyParser failed to parse")
		return err
	}

	_, err := db.Exec(`INSERT INTO Topics (title, description) VALUES ($1, $2);`, topic.Title, topic.Description)
	if err != nil {
		return err
	}

	return c.Status(201).JSON(topic)
}

func updateTopic(c *fiber.Ctx) error {
	target_topic_title := c.Params("topic_title")

	new_topic := new(Topic)
	// bind the request body to the struct, topic
	if err := c.BodyParser(new_topic); err != nil {
		fmt.Println("main.go updateTopic(): BodyParser failed to parse")
		return err
	}

	_, err := db.Exec(`UPDATE Topics SET title = $1, description = $2 WHERE title = $3;`,
		new_topic.Title,
		new_topic.Description,
		target_topic_title)
	if err != nil {
		fmt.Println("main.go updateTopic(): PostgreSQL update command failed")
		return err
	}

	return c.Status(201).JSON(new_topic)
}

func deleteTopic(c *fiber.Ctx) error {
	target_topic_title := c.Params("topic_title")

	_, err := db.Exec(`DELETE FROM Comments WHERE post_id IN (SELECT id FROM Posts WHERE topic_title = $1)`, target_topic_title)
	if err != nil {
		fmt.Println("main.go deleteTopic(): PostgreSQL Comments delete command failed")
		return err
	}

	_, err = db.Exec(`DELETE FROM Posts WHERE topic_title = $1`, target_topic_title)
	if err != nil {
		fmt.Println("main.go deleteTopic(): PostgreSQL Posts delete command failed")
		return err
	}

	_, err = db.Exec(`DELETE FROM Topics WHERE title = $1`, target_topic_title)
	if err != nil {
		fmt.Println("main.go deleteTopic(): PostgreSQL delete command failed")
		return err
	}

	return c.Status(200).JSON(fiber.Map{"success": true})
}

func getPost(c *fiber.Ctx) error {
	t_post_id := c.Params("post_id")
	var post Post

	row := db.QueryRow(`SELECT * FROM Posts WHERE id = $1;`, t_post_id)
	err := row.Scan(&post.ID, &post.TopicTitle, &post.Title, &post.UserName, &post.Body)

	if err != nil {
		if err == sql.ErrNoRows {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "Post not found",
			})
		}
		return err
	}

	return c.JSON(post)
}

func getPosts(c *fiber.Ctx) error {
	t_topic_title := c.Params("topic_title")
	var posts []Post

	rows, err := db.Query("SELECT * FROM Posts WHERE topic_title = $1;", t_topic_title)
	if err != nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var post Post
		if err := rows.Scan(&post.ID, &post.TopicTitle, &post.Title, &post.UserName, &post.Body); err != nil {
			return err
		}
		posts = append(posts, post)
	}

	return c.JSON(posts)
}

func createPost(c *fiber.Ctx) error {
	post := new(Post) // topic is a pointer

	// bind the request body to the struct, topic
	if err := c.BodyParser(post); err != nil {
		fmt.Println("main.go createPost(): BodyParser failed to parse")
		return err
	}

	_, err := db.Exec(`INSERT INTO Posts (topic_title, title, user_name, body) VALUES ($1, $2, $3, $4);`,
		post.TopicTitle,
		post.Title,
		post.UserName,
		post.Body)
	if err != nil {
		return err
	}

	return c.Status(201).JSON(post)
}

func updatePost(c *fiber.Ctx) error {
	t_post_id := c.Params("post_id")

	post := new(Post)
	// bind the request body to the struct, topic
	if err := c.BodyParser(post); err != nil {
		fmt.Println("main.go updatePost(): BodyParser failed to parse")
		return err
	}

	_, err := db.Exec(`UPDATE Posts SET (topic_title, title, user_name, body) = ($1, $2, $3, $4) WHERE id = $5;`,
		post.TopicTitle,
		post.Title,
		post.UserName,
		post.Body,
		t_post_id)
	if err != nil {
		fmt.Println("main.go updatePost(): PostgreSQL update command failed")
		return err
	}

	return c.Status(201).JSON(post)
}

func deletePost(c *fiber.Ctx) error {
	t_post_id := c.Params("post_id")

	_, err := db.Exec(`DELETE FROM Comments WHERE post_id = $1;`, t_post_id)
	if err != nil {
		fmt.Println("main.go deletePost(): PostgreSQL Comments deletion failed")
		return err
	}

	_, err = db.Exec(`DELETE FROM Posts WHERE id = $1;`, t_post_id)
	if err != nil {
		fmt.Println("main.go deletePost(): PostgreSQL delete command failed")
		return err
	}

	return c.Status(200).JSON(fiber.Map{"success": true})
}

func getComments(c *fiber.Ctx) error {
	t_post_id := c.Params("post_id")
	var comments []Comment

	rows, err := db.Query("SELECT * FROM Comments WHERE post_id = $1;", t_post_id)
	if err != nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var comment Comment
		if err := rows.Scan(&comment.ID, &comment.PostID, &comment.UserName, &comment.Body); err != nil {
			return err
		}

		comments = append(comments, comment)
	}

	return c.JSON(comments)
}

func createComment(c *fiber.Ctx) error {
	comment := new(Comment) // topic is a pointer

	// bind the request body to the struct, topic
	if err := c.BodyParser(comment); err != nil {
		fmt.Println("main.go createComment(): BodyParser failed to parse")
		return err
	}

	_, err := db.Exec(`INSERT INTO Comments (post_id, user_name, body) VALUES ($1, $2, $3);`, comment.PostID, comment.UserName, comment.Body)
	if err != nil {
		return err
	}

	return c.Status(201).JSON(comment)
}

func updateComment(c *fiber.Ctx) error {
	t_comment_id := c.Params("comment_id")

	comment := new(Comment)
	// bind the request body to the struct, topic
	if err := c.BodyParser(comment); err != nil {
		fmt.Println("main.go updateComment(): BodyParser failed to parse")
		return err
	}

	_, err := db.Exec(`UPDATE Comments SET (post_id, user_name, body) = ($1, $2, $3) WHERE id = $4;`,
		comment.PostID,
		comment.UserName,
		comment.Body,
		t_comment_id)
	fmt.Println("main.go updateComment(): Comment updated")
	if err != nil {
		fmt.Println("main.go updateComment(): PostgreSQL update command failed")
		return err
	}

	return c.Status(201).JSON(comment)
}

func deleteComment(c *fiber.Ctx) error {
	t_comment_id := c.Params("comment_id")

	_, err := db.Exec(`DELETE FROM Comments WHERE id = $1;`, t_comment_id)
	if err != nil {
		fmt.Println("main.go deleteComment(): PostgreSQL delete command failed")
		return err
	}

	return c.Status(200).JSON(fiber.Map{"success": true})
}
