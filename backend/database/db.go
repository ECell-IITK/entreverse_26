package database

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)
//using pgxpool for connection pooling and better performance
var DB *pgxpool.Pool

func Connect() error {

	databaseURL := os.Getenv("DATABASE_URL")

	if databaseURL == "" {
		return fmt.Errorf("DATABASE_URL is not set")
	}

	config, err := pgxpool.ParseConfig(databaseURL)
	if err != nil {
		return err
	}

	config.MaxConns = 20
	config.MinConns = 2
	config.MaxConnLifetime = time.Hour
	config.MaxConnIdleTime = 30 * time.Minute
	config.HealthCheckPeriod = time.Minute

	DB, err = pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		return err
	}

	if err = DB.Ping(context.Background()); err != nil {
		return err
	}

	fmt.Println("PostgreSQL Connected")

	return nil
}

