package main

import (
	"fmt"
	"log"
	"os"

	"entreverse/backend/router"
	"entreverse/backend/database"
	"github.com/joho/godotenv"
)

func main() {


	_ = godotenv.Load()

	if err := database.Connect(); err != nil {
		log.Fatalf("❌ DB connection failed: %v", err)
	}

	//  Router 
	r := router.SetupRouter()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("EntreVerse API running on :%s\n", port)

	if err := r.Run(":" + port); err != nil {
		log.Fatalf(" Server failed: %v", err)
	}
}