package repository

import (
	"knitinfo-backend/pkg/models"

	"github.com/jmoiron/sqlx"
)

type CategoryRepository struct {
	db *sqlx.DB
}

func NewCategoryRepository(db *sqlx.DB) *CategoryRepository {
	return &CategoryRepository{db: db}
}

func (r *CategoryRepository) GetFeatured(limit int) ([]models.Category, error) {
	var categories []models.Category
	err := r.db.Select(&categories, "SELECT * FROM categories WHERE is_active = true ORDER BY display_order ASC LIMIT $1", limit)
	return categories, err
}

func (r *CategoryRepository) GetAll() ([]models.Category, error) {
	var categories []models.Category
	err := r.db.Select(&categories, "SELECT * FROM categories WHERE is_active = true ORDER BY display_order ASC")
	return categories, err
}
