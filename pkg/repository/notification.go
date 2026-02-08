package repository

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type Notification struct {
	ID        string                 `json:"id" db:"id"`
	Type      string                 `json:"type" db:"type"`
	Recipient string                 `json:"recipient" db:"recipient"`
	Message   string                 `json:"message" db:"message"`
	Data      map[string]interface{} `json:"data" db:"data"`
	Status    string                 `json:"status" db:"status"`
	SentAt    *time.Time             `json:"sentAt,omitempty" db:"sent_at"`
	CreatedAt time.Time              `json:"createdAt" db:"created_at"`
}

type NotificationRepository struct {
	db *sqlx.DB
}

func NewNotificationRepository(db *sqlx.DB) *NotificationRepository {
	return &NotificationRepository{db: db}
}

func (r *NotificationRepository) Create(notification *Notification) error {
	notification.ID = uuid.New().String()
	notification.CreatedAt = time.Now()

	dataJSON, _ := json.Marshal(notification.Data)

	query := `INSERT INTO notifications (id, type, recipient, message, data, status, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)`
	_, err := r.db.Exec(query, notification.ID, notification.Type, notification.Recipient, 
		notification.Message, dataJSON, notification.Status, notification.CreatedAt)
	return err
}

func (r *NotificationRepository) GetPending() ([]Notification, error) {
	var notifications []Notification
	err := r.db.Select(&notifications, "SELECT * FROM notifications WHERE status = 'pending' ORDER BY created_at ASC")
	return notifications, err
}

func (r *NotificationRepository) MarkSent(id string) error {
	now := time.Now()
	_, err := r.db.Exec("UPDATE notifications SET status = 'sent', sent_at = $1 WHERE id = $2", now, id)
	return err
}
