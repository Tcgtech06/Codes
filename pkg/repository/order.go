package repository

import (
	"knitinfo-backend/pkg/models"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type OrderRepository struct {
	db *sqlx.DB
}

func NewOrderRepository(db *sqlx.DB) *OrderRepository {
	return &OrderRepository{db: db}
}

func (r *OrderRepository) Create(order *models.Order) error {
	order.ID = uuid.New().String()
	order.CreatedAt = time.Now()

	query := `INSERT INTO orders (id, book_id, customer_name, customer_email, customer_phone, quantity, total_amount, status, created_at)
		VALUES (:id, :book_id, :customer_name, :customer_email, :customer_phone, :quantity, :total_amount, :status, :created_at)`
	_, err := r.db.NamedExec(query, order)
	return err
}

func (r *OrderRepository) GetAll() ([]models.Order, error) {
	var orders []models.Order
	err := r.db.Select(&orders, "SELECT * FROM orders ORDER BY created_at DESC")
	return orders, err
}
