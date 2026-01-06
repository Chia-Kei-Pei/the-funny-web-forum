package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq" // Import pq for PostgreSQL driver
)

type Topic struct {
	TopicName string `json:"topic_name"`
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

	PORT := os.Getenv("PORT")

	app.Get("/api/topics", getTopics)
	app.Post("/api/topics", createTopic)
	app.Patch("/api/topics/:topic_name", updateTopicName)
	app.Delete("/api/topics/:topic_name", deleteTopic)

	log.Fatal(app.Listen(":" + PORT))
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
		if err := rows.Scan(&topic.TopicName); err != nil {
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

	if topic.TopicName == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Topic must have a name"})
	}

	_, err := db.Exec(`INSERT INTO topics (topic_name) VALUES ($1);`, topic.TopicName)
	if err != nil {
		return err
	}

	return c.Status(201).JSON(topic)
}

func updateTopicName(c *fiber.Ctx) error {
	target_topic_name := c.Params("topic_name")

	new_topic := new(Topic)
	// bind the request body to the struct, topic
	if err := c.BodyParser(new_topic); err != nil {
		fmt.Println("main.go updateTopic(): BodyParser failed to parse")
		return err
	}

	_, err := db.Exec(`UPDATE topics SET topic_name = $1 WHERE topic_name = $2;`, new_topic.TopicName, target_topic_name)
	if err != nil {
		fmt.Println("main.go updateTopic(): PostgreSQL update command failed")
		return err
	}

	return c.Status(201).JSON(new_topic)
}

func deleteTopic(c *fiber.Ctx) error {
	target_topic_name := c.Params("topic_name")

	_, err := db.Exec(`DELETE FROM topics WHERE topic_name = $1`, target_topic_name)
	if err != nil {
		fmt.Println("main.go deleteTopic(): PostgreSQL delete command failed")
		return err
	}

	return c.Status(200).JSON(fiber.Map{"success": true})
}
