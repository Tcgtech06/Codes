package repository

import (
	"fmt"
	"knitinfo-backend/pkg/models"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type BookRepository struct {
	db *sqlx.DB
}

func NewBookRepository(db *sqlx.DB) *BookRepository {
	return &BookRepository{db: db}
}

func (r *BookRepository) GetAll() ([]models.Book, error) {
	var books []models.Book
	err := r.db.Select(&books, "SELECT * FROM books WHERE status = 'active' ORDER BY created_at DESC")
	return books, err
}

func (r *BookRepository) GetByID(id string) (*models.Book, error) {
	var book models.Book
	err := r.db.Get(&book, "SELECT * FROM books WHERE id = $1", id)
	if err != nil {
		return nil, err
	}
	return &book, nil
}

func (r *BookRepository) Create(book *models.Book) error {
	book.ID = uuid.New().String()
	book.CreatedAt = time.Now()
	book.UpdatedAt = time.Now()

	query := `INSERT INTO books (id, title, author, description, price, category, cover_image, stock, status, created_at, updated_at)
		VALUES (:id, :title, :author, :description, :price, :category, :cover_image, :stock, :status, :created_at, :updated_at)`
	_, err := r.db.NamedExec(query, book)
	return err
}

func (r *BookRepository) UpdateStock(id string, quantity int) error {
	query := `UPDATE books SET stock = stock - $1, updated_at = $2 WHERE id = $3 AND stock >= $1`
	result, err := r.db.Exec(query, quantity, time.Now(), id)
	if err != nil {
		return err
	}
	rows, _ := result.RowsAffected()
	if rows == 0 {
		return fmt.Errorf("insufficient stock")
	}
	return nil
}

func (r *BookRepository) GetCategories() ([]string, error) {
	var categories []string
	err := r.db.Select(&categories, "SELECT DISTINCT category FROM books WHERE status = 'active' ORDER BY category")
	return categories, err
}
