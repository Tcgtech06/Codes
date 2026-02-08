package repository

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"knitinfo-backend/pkg/models"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
)

type SubmissionRepository struct {
	db *sqlx.DB
}

func NewSubmissionRepository(db *sqlx.DB) *SubmissionRepository {
	return &SubmissionRepository{db: db}
}

func (r *SubmissionRepository) GetAll(submissionType, status string) ([]models.FormSubmission, error) {
	query := `SELECT * FROM form_submissions WHERE 1=1`
	args := []interface{}{}
	argCount := 1

	if submissionType != "" {
		query += fmt.Sprintf(" AND type = $%d", argCount)
		args = append(args, submissionType)
		argCount++
	}

	if status != "" {
		query += fmt.Sprintf(" AND status = $%d", argCount)
		args = append(args, status)
	}

	query += " ORDER BY submitted_at DESC"

	rows, err := r.db.Queryx(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var submissions []models.FormSubmission
	for rows.Next() {
		var sub models.FormSubmission
		var formDataJSON []byte

		err := rows.Scan(
			&sub.ID, &sub.Type, &formDataJSON, pq.Array(&sub.Attachments),
			&sub.Status, &sub.SubmittedAt, &sub.ReviewedAt, &sub.ReviewedBy, &sub.ReviewNotes,
		)
		if err != nil {
			return nil, err
		}

		if err := json.Unmarshal(formDataJSON, &sub.FormData); err != nil {
			return nil, err
		}

		submissions = append(submissions, sub)
	}

	return submissions, nil
}

func (r *SubmissionRepository) GetByType(submissionType string) ([]models.FormSubmission, error) {
	return r.GetAll(submissionType, "")
}

func (r *SubmissionRepository) Create(submission *models.FormSubmission) error {
	submission.ID = uuid.New().String()
	submission.SubmittedAt = time.Now()

	formDataJSON, err := json.Marshal(submission.FormData)
	if err != nil {
		return err
	}

	query := `
		INSERT INTO form_submissions (
			id, type, form_data, attachments, status, submitted_at
		) VALUES ($1, $2, $3, $4, $5, $6)`

	_, err = r.db.Exec(query,
		submission.ID,
		submission.Type,
		formDataJSON,
		pq.Array(submission.Attachments),
		submission.Status,
		submission.SubmittedAt,
	)

	return err
}

func (r *SubmissionRepository) UpdateStatus(id, status, reviewedBy, reviewNotes string) error {
	now := time.Now()

	query := `
		UPDATE form_submissions SET
			status = $1,
			reviewed_at = $2,
			reviewed_by = $3,
			review_notes = $4
		WHERE id = $5`

	result, err := r.db.Exec(query, status, now, reviewedBy, reviewNotes, id)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return fmt.Errorf("submission not found")
	}

	return nil
}

func (r *SubmissionRepository) GetByID(id string) (*models.FormSubmission, error) {
	var sub models.FormSubmission
	var formDataJSON []byte

	query := `SELECT * FROM form_submissions WHERE id = $1`

	err := r.db.QueryRowx(query, id).Scan(
		&sub.ID, &sub.Type, &formDataJSON, pq.Array(&sub.Attachments),
		&sub.Status, &sub.SubmittedAt, &sub.ReviewedAt, &sub.ReviewedBy, &sub.ReviewNotes,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	if err := json.Unmarshal(formDataJSON, &sub.FormData); err != nil {
		return nil, err
	}

	return &sub, nil
}
