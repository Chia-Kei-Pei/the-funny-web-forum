package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"strings"

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
	Topic  string `json:"topic"`
	Title  string `json:"title"`
	UserId string `json:"user_id"`
	Body   string `json:"body"`
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
	app.Get("/api/topics/:topic_title/posts/:post_title", getPost)
	app.Get("/api/topics/:topic_title/posts", getPosts)
	app.Post("/api/topics/:topic_title/posts", createPost)
	app.Patch("/api/topics/:topic_title/posts/:post_title", updatePost)
	app.Delete("/api/topics/:topic_title/posts/:post_title", deletePost)

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

	_, err := db.Exec(`UPDATE Topics SET title = $1, description=$2 WHERE title = $3;`,
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

	_, err := db.Exec(`DELETE FROM Topics WHERE title = $1`, target_topic_title)
	if err != nil {
		fmt.Println("main.go deleteTopic(): PostgreSQL delete command failed")
		return err
	}

	return c.Status(200).JSON(fiber.Map{"success": true})
}

func getPost(c *fiber.Ctx) error {
	t_topic_title := c.Params("topic_title")
	t_post_title := c.Params("post_title")
	t_post_title = strings.ReplaceAll(t_post_title, "%20", " ") // replace special character "%20" with space.
	var post Post

	row := db.QueryRow(`SELECT * FROM Posts WHERE topic = $1 AND title = $2;`, t_topic_title, t_post_title)
	err := row.Scan(&post.Topic, &post.Title, &post.UserId, &post.Body)

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

	rows, err := db.Query("SELECT * FROM Posts WHERE topic = $1;", t_topic_title)
	if err != nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var post Post
		if err := rows.Scan(&post.Topic, &post.Title, &post.UserId, &post.Body); err != nil {
			return err
		}
		posts = append(posts, post)
	}

	return c.JSON(posts)
}

func createPost(c *fiber.Ctx) error {
	t_topic_title := c.Params("topic_title")
	post := new(Post) // topic is a pointer

	// bind the request body to the struct, topic
	if err := c.BodyParser(post); err != nil {
		fmt.Println("main.go createPost(): BodyParser failed to parse")
		return err
	}

	_, err := db.Exec(`INSERT INTO Posts VALUES ($1, $2, $3, $4);`, t_topic_title, post.Title, post.UserId, post.Body)
	if err != nil {
		return err
	}

	return c.Status(201).JSON(post)
}

func updatePost(c *fiber.Ctx) error {
	t_topic_title := c.Params("topic_title")
	t_post_title := c.Params("post_title")
	t_post_title = strings.ReplaceAll(t_post_title, `%20`, " ") // replace special character "%20" with space.

	post := new(Post)
	// bind the request body to the struct, topic
	if err := c.BodyParser(post); err != nil {
		fmt.Println("main.go updatePost(): BodyParser failed to parse")
		return err
	}

	_, err := db.Exec(`UPDATE Posts SET (topic, title, user_id, body) = ($1, $2, $3, $4) WHERE topic = $5 AND title = $6;`,
		post.Topic,
		post.Title,
		post.UserId,
		post.Body,
		t_topic_title,
		t_post_title)
	if err != nil {
		fmt.Println("main.go updatePost(): PostgreSQL update command failed")
		return err
	}

	return c.Status(201).JSON(post)
}

func deletePost(c *fiber.Ctx) error {
	t_topic_title := c.Params("topic_title")
	t_post_title := c.Params("post_title")
	t_post_title = strings.ReplaceAll(t_post_title, "%20", " ") // replace special character "%20" with space.

	_, err := db.Exec(`DELETE FROM Posts WHERE topic = $1 AND title = $2`, t_topic_title, t_post_title)
	if err != nil {
		fmt.Println("main.go deletePost(): PostgreSQL delete command failed")
		return err
	}

	return c.Status(200).JSON(fiber.Map{"success": true})
}
