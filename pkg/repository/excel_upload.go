package repository

import (
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
)

type ExcelUpload struct {
	ID           string    `json:"id" db:"id"`
	FileName     string    `json:"fileName" db:"file_name"`
	FileURL      string    `json:"fileUrl" db:"file_url"`
	Category     string    `json:"category" db:"category"`
	UploadedBy   string    `json:"uploadedBy" db:"uploaded_by"`
	Status       string    `json:"status" db:"status"`
	RecordsCount int       `json:"recordsCount" db:"records_count"`
	SuccessCount int       `json:"successCount" db:"success_count"`
	ErrorCount   int       `json:"errorCount" db:"error_count"`
	Errors       []string  `json:"errors" db:"errors"`
	UploadedAt   time.Time `json:"uploadedAt" db:"uploaded_at"`
	ProcessedAt  *time.Time `json:"processedAt,omitempty" db:"processed_at"`
}

type ExcelUploadRepository struct {
	db *sqlx.DB
}

func NewExcelUploadRepository(db *sqlx.DB) *ExcelUploadRepository {
	return &ExcelUploadRepository{db: db}
}

func (r *ExcelUploadRepository) Create(upload *ExcelUpload) error {
	upload.ID = uuid.New().String()
	upload.UploadedAt = time.Now()

	query := `INSERT INTO excel_uploads (id, file_name, file_url, category, uploaded_by, status, uploaded_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)`
	_, err := r.db.Exec(query, upload.ID, upload.FileName, upload.FileURL, upload.Category, upload.UploadedBy, upload.Status, upload.UploadedAt)
	return err
}

func (r *ExcelUploadRepository) UpdateProgress(id string, recordsCount, successCount, errorCount int, errors []string, status string) error {
	now := time.Now()
	query := `UPDATE excel_uploads SET 
		records_count = $1, success_count = $2, error_count = $3, 
		errors = $4, status = $5, processed_at = $6 
		WHERE id = $7`
	_, err := r.db.Exec(query, recordsCount, successCount, errorCount, pq.Array(errors), status, now, id)
	return err
}

func (r *ExcelUploadRepository) GetHistory() ([]ExcelUpload, error) {
	var uploads []ExcelUpload
	err := r.db.Select(&uploads, "SELECT * FROM excel_uploads ORDER BY uploaded_at DESC")
	return uploads, err
}
