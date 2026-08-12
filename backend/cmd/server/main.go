package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"entreverse/backend/auth"
	"entreverse/backend/database"
	"entreverse/backend/router"

	"github.com/joho/godotenv"
)

func main() {
	// Load .env — silently ignored in production where env is injected externally.
	_ = godotenv.Load()

	//  Auth 
	if err := auth.Init(); err != nil {
		log.Fatalf("Auth init failed: %v", err)
	}

	//  Database 
	if err := database.Connect(); err != nil {
		log.Fatalf("DB connection failed: %v", err)
	}
	defer database.DB.Close()

	// Seed admin accounts (idempotent — safe on every restart)
	if err := database.SeedAdmins(); err != nil {
		log.Fatalf("Admin seeding failed: %v", err)
	}

	// Migrate plaintext registration codes to bcrypt (idempotent)
	if err := database.MigratePlainCodes(context.Background()); err != nil {
		log.Printf("Warning: code migration failed (non-fatal): %v", err)
	}

	//── HTTP server 
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	srv := &http.Server{
		Addr:         ":" + port,
		Handler:      router.SetupRouter(),
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		fmt.Printf("EntreVerse API listening on :%s\n", port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("server error: %v", err)
		}
	}()

	//  Graceful shutdown 
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutdown signal received — draining connections...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Printf("Shutdown error: %v", err)
	}
	log.Println("Server stopped cleanly.")
}
