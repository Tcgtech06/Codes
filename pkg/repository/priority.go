package repository

import (
	"fmt"
	"knitinfo-backend/pkg/models"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type PriorityRepository struct {
	db *sqlx.DB
}

func NewPriorityRepository(db *sqlx.DB) *PriorityRepository {
	return &PriorityRepository{db: db}
}

func (r *PriorityRepository) GetAll(category string) ([]models.Priority, error) {
	query := `
		SELECT * FROM priorities 
		WHERE status = 'active' 
		AND (expires_at IS NULL OR expires_at > NOW())
	`
	args := []interface{}{}

	if category != "" {
		query += " AND LOWER(category) = LOWER($1)"
		args = append(args, category)
	}

	query += " ORDER BY position ASC"

	var priorities []models.Priority
	err := r.db.Select(&priorities, query, args...)
	return priorities, err
}

func (r *PriorityRepository) GetByCategory(category string) ([]models.Priority, error) {
	var priorities []models.Priority
	query := `
		SELECT * FROM priorities 
		WHERE LOWER(category) = LOWER($1) 
		AND status = 'active'
		AND (expires_at IS NULL OR expires_at > NOW())
		ORDER BY position ASC
	`
	err := r.db.Select(&priorities, query, category)
	return priorities, err
}

func (r *PriorityRepository) Create(priority *models.Priority) error {
	priority.ID = uuid.New().String()
	priority.CreatedAt = time.Now()

	if priority.PriorityType == "temporary" && priority.Duration > 0 {
		var expiresAt time.Time
		switch priority.DurationType {
		case "days":
			expiresAt = time.Now().AddDate(0, 0, priority.Duration)
		case "months":
			expiresAt = time.Now().AddDate(0, priority.Duration, 0)
		case "years":
			expiresAt = time.Now().AddDate(priority.Duration, 0, 0)
		}
		priority.ExpiresAt = &expiresAt
	}

	query := `
		INSERT INTO priorities (
			id, company_id, company_name, category, position, 
			priority_type, duration, duration_type, expires_at, 
			status, created_at, created_by
		) VALUES (
			:id, :company_id, :company_name, :category, :position,
			:priority_type, :duration, :duration_type, :expires_at,
			:status, :created_at, :created_by
		)`

	_, err := r.db.NamedExec(query, priority)
	return err
}

func (r *PriorityRepository) Update(id string, priority *models.Priority) error {
	query := `
		UPDATE priorities SET
			company_id = :company_id,
			company_name = :company_name,
			category = :category,
			position = :position,
			priority_type = :priority_type,
			duration = :duration,
			duration_type = :duration_type,
			expires_at = :expires_at,
			status = :status
		WHERE id = :id`

	priority.ID = id
	result, err := r.db.NamedExec(query, priority)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return fmt.Errorf("priority not found")
	}

	return nil
}

func (r *PriorityRepository) Delete(id string) error {
	result, err := r.db.Exec("DELETE FROM priorities WHERE id = $1", id)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return fmt.Errorf("priority not found")
	}

	return nil
}
