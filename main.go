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
	Title   string `json:"title"`
	Description string `json:"description"`
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

	app.Get("/api/topics/:title", getTopic)
	app.Get("/api/topics", getTopics)
	app.Post("/api/topics", createTopic)
	app.Patch("/api/topics/:title", updateTopic)
	app.Delete("/api/topics/:title", deleteTopic)

	log.Fatal(app.Listen(":" + PORT))
}

func getTopic(c *fiber.Ctx) error {
	target_topic_title := c.Params("title")
	var topic Topic

	row := db.QueryRow(`SELECT * FROM topics WHERE title = $1;`, target_topic_title)
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

	rows, err := db.Query("SELECT * FROM topics;")
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

	_, err := db.Exec(`INSERT INTO topics (title, description) VALUES ($1, $2);`, topic.Title, topic.Description)
	if err != nil {
		return err
	}

	return c.Status(201).JSON(topic)
}

func updateTopic(c *fiber.Ctx) error {
	target_topic_title := c.Params("title")

	new_topic := new(Topic)
	// bind the request body to the struct, topic
	if err := c.BodyParser(new_topic); err != nil {
		fmt.Println("main.go updateTopic(): BodyParser failed to parse")
		return err
	}

	_, err := db.Exec(`UPDATE topics SET title = $1, description=$2 WHERE title = $3;`,
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
	target_topic_title := c.Params("title")

	_, err := db.Exec(`DELETE FROM topics WHERE title = $1`, target_topic_title)
	if err != nil {
		fmt.Println("main.go deleteTopic(): PostgreSQL delete command failed")
		return err
	}

	return c.Status(200).JSON(fiber.Map{"success": true})
}
