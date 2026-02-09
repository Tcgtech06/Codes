package repository

import (
	"database/sql"
	"encoding/json"
	"knitinfo-backend/pkg/models"

	"github.com/jmoiron/sqlx"
)

type SettingsRepository struct {
	db *sqlx.DB
}

func NewSettingsRepository(db *sqlx.DB) *SettingsRepository {
	return &SettingsRepository{db: db}
}

func (r *SettingsRepository) GetByKey(key string) (*models.AppSettings, error) {
	var settings models.AppSettings
	var valueJSON []byte

	err := r.db.QueryRow("SELECT id, key, value, updated_at FROM app_settings WHERE key = $1", key).
		Scan(&settings.ID, &settings.Key, &valueJSON, &settings.UpdatedAt)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	if err := json.Unmarshal(valueJSON, &settings.Value); err != nil {
		return nil, err
	}

	return &settings, nil
}
