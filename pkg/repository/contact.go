package repository

import (
	"knitinfo-backend/pkg/models"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type ContactRepository struct {
	db *sqlx.DB
}

func NewContactRepository(db *sqlx.DB) *ContactRepository {
	return &ContactRepository{db: db}
}

func (r *ContactRepository) Create(contact *models.ContactMessage) error {
	contact.ID = uuid.New().String()
	contact.CreatedAt = time.Now()

	query := `
		INSERT INTO contact_messages (id, name, email, message, created_at)
		VALUES (:id, :name, :email, :message, :created_at)`

	_, err := r.db.NamedExec(query, contact)
	return err
}

func (r *ContactRepository) GetAll() ([]models.ContactMessage, error) {
	var contacts []models.ContactMessage
	err := r.db.Select(&contacts, "SELECT * FROM contact_messages ORDER BY created_at DESC")
	return contacts, err
}
