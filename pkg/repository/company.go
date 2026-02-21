package repository

import (
	"database/sql"
	"fmt"
	"knitinfo-backend/pkg/models"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type CompanyRepository struct {
	db *sqlx.DB
}

func NewCompanyRepository(db *sqlx.DB) *CompanyRepository {
	return &CompanyRepository{db: db}
}

func (r *CompanyRepository) GetAll(category, status string, limit int) ([]models.Company, error) {
	query := `SELECT * FROM companies WHERE 1=1`
	args := []interface{}{}
	argCount := 1

	if category != "" {
		query += fmt.Sprintf(" AND LOWER(category) = LOWER($%d)", argCount)
		args = append(args, category)
		argCount++
	}

	if status != "" {
		query += fmt.Sprintf(" AND status = $%d", argCount)
		args = append(args, status)
		argCount++
	}

	query += " ORDER BY created_at DESC"

	if limit > 0 {
		query += fmt.Sprintf(" LIMIT $%d", argCount)
		args = append(args, limit)
	}

	var companies []models.Company
	err := r.db.Select(&companies, query, args...)
	return companies, err
}

func (r *CompanyRepository) GetByID(id string) (*models.Company, error) {
	var company models.Company
	err := r.db.Get(&company, "SELECT * FROM companies WHERE id = $1", id)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return &company, err
}

func (r *CompanyRepository) Create(company *models.Company) error {
	company.ID = uuid.New().String()
	company.CreatedAt = time.Now()
	company.UpdatedAt = time.Now()

	query := `
		INSERT INTO companies (
			id, company_name, contact_person, email, phone, website, 
			address, category, description, products, certifications, 
			gst_number, status, created_at, updated_at
		) VALUES (
			:id, :company_name, :contact_person, :email, :phone, :website,
			:address, :category, :description, :products, :certifications,
			:gst_number, :status, :created_at, :updated_at
		)`

	_, err := r.db.NamedExec(query, company)
	return err
}

func (r *CompanyRepository) Update(id string, company *models.Company) error {
	company.UpdatedAt = time.Now()

	query := `
		UPDATE companies SET
			company_name = :company_name,
			contact_person = :contact_person,
			email = :email,
			phone = :phone,
			website = :website,
			address = :address,
			category = :category,
			description = :description,
			products = :products,
			certifications = :certifications,
			gst_number = :gst_number,
			status = :status,
			updated_at = :updated_at
		WHERE id = :id`

	company.ID = id
	result, err := r.db.NamedExec(query, company)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return fmt.Errorf("company not found")
	}

	return nil
}

func (r *CompanyRepository) Delete(id string) error {
	result, err := r.db.Exec("DELETE FROM companies WHERE id = $1", id)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return fmt.Errorf("company not found")
	}

	return nil
}

func (r *CompanyRepository) Search(query, category string) ([]models.Company, error) {
	sqlQuery := `
		SELECT * FROM companies 
		WHERE status = 'active'
	`
	args := []interface{}{}
	argCount := 1

	if category != "" {
		sqlQuery += fmt.Sprintf(" AND LOWER(category) = LOWER($%d)", argCount)
		args = append(args, category)
		argCount++
	}

	if query != "" {
		sqlQuery += fmt.Sprintf(` AND (
			LOWER(company_name) LIKE LOWER($%d) OR
			LOWER(description) LIKE LOWER($%d) OR
			LOWER(address) LIKE LOWER($%d)
		)`, argCount, argCount, argCount)
		args = append(args, "%"+query+"%")
	}

	sqlQuery += " ORDER BY created_at DESC"

	var companies []models.Company
	err := r.db.Select(&companies, sqlQuery, args...)
	return companies, err
}

func (r *CompanyRepository) GetByCategory(category string) ([]models.Company, error) {
	var companies []models.Company
	err := r.db.Select(&companies, 
		"SELECT * FROM companies WHERE LOWER(category) = LOWER($1) AND status = 'active' ORDER BY created_at DESC", 
		category)
	return companies, err
}

func (r *CompanyRepository) CountByCategory(category string) (int, error) {
	var count int
	err := r.db.Get(&count, 
		"SELECT COUNT(*) FROM companies WHERE LOWER(category) = LOWER($1) AND status = 'active'", 
		category)
	return count, err
}
