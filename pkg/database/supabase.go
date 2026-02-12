package database

import (
	"context"
	"fmt"
	"net"
	"os"
	"strings"
	"time"

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

	// Add sslmode if not present to help with connection
	if !strings.Contains(supabaseURL, "sslmode=") {
		if strings.Contains(supabaseURL, "?") {
			supabaseURL += "&sslmode=require"
		} else {
			supabaseURL += "?sslmode=require"
		}
	}

	// Custom resolver to prefer IPv4
	net.DefaultResolver = &net.Resolver{
		PreferGo: true,
		Dial: func(ctx context.Context, network, address string) (net.Conn, error) {
			d := net.Dialer{
				Timeout: 10 * time.Second,
			}
			// Force IPv4
			return d.DialContext(ctx, "udp4", address)
		},
	}

	db, err := sqlx.Connect("postgres", supabaseURL)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(5 * time.Minute)

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	return &Database{DB: db}, nil
}

func (d *Database) Close() error {
	return d.DB.Close()
}
