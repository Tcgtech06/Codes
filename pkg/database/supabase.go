package database

import (
	"fmt"
	"os"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

type Database struct {
	DB *sqlx.DB
}

func NewSupabaseConnection() (*Database, error) {
	supabaseURL := os.Getenv("SUPABASE_DB_URL")
	if supabaseURL == "" {
		return nil, fmt.Errorf("SUPABASE_DB_URL not set")
	}

	db, err := sqlx.Connect("postgres", supabaseURL)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	return &Database{DB: db}, nil
}

func (d *Database) Close() error {
	return d.DB.Close()
}
