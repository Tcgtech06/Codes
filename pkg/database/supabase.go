package database

import (
	"context"
	"database/sql"
	"fmt"
	"net"
	"os"
	"strings"
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
)

type Database struct {
	DB *sqlx.DB
}

// Custom dialer that forces IPv4
func ipv4Dialer(ctx context.Context, network, addr string) (net.Conn, error) {
	// Force TCP4 (IPv4 only)
	if strings.HasPrefix(network, "tcp") {
		network = "tcp4"
	}
	
	dialer := &net.Dialer{
		Timeout:   30 * time.Second,
		KeepAlive: 30 * time.Second,
	}
	
	return dialer.DialContext(ctx, network, addr)
}

func NewSupabaseConnection() (*Database, error) {
	supabaseURL := os.Getenv("SUPABASE_DB_URL")
	if supabaseURL == "" {
		return nil, fmt.Errorf("SUPABASE_DB_URL not set")
	}

	// Register custom dialer with pq driver
	pq.DialFunc = func(network, addr string) (net.Conn, error) {
		return ipv4Dialer(context.Background(), network, addr)
	}

	// Parse and connect
	db, err := sql.Open("postgres", supabaseURL)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	// Wrap with sqlx
	dbx := sqlx.NewDb(db, "postgres")

	dbx.SetMaxOpenConns(25)
	dbx.SetMaxIdleConns(5)
	dbx.SetConnMaxLifetime(5 * time.Minute)

	// Test connection
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	
	if err := dbx.PingContext(ctx); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	return &Database{DB: dbx}, nil
}

func (d *Database) Close() error {
	return d.DB.Close()
}
