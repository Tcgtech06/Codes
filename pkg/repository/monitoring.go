package repository

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type ErrorLog struct {
	ID           string                 `json:"id" db:"id"`
	ErrorMessage string                 `json:"errorMessage" db:"error_message"`
	ErrorStack   string                 `json:"errorStack" db:"error_stack"`
	Context      map[string]interface{} `json:"context" db:"context"`
	Severity     string                 `json:"severity" db:"severity"`
	CreatedAt    time.Time              `json:"createdAt" db:"created_at"`
}

type PerformanceMetric struct {
	ID        string    `json:"id" db:"id"`
	QueryType string    `json:"queryType" db:"query_type"`
	Duration  int       `json:"duration" db:"duration"`
	Endpoint  string    `json:"endpoint" db:"endpoint"`
	CreatedAt time.Time `json:"createdAt" db:"created_at"`
}

type MonitoringRepository struct {
	db *sqlx.DB
}

func NewMonitoringRepository(db *sqlx.DB) *MonitoringRepository {
	return &MonitoringRepository{db: db}
}

func (r *MonitoringRepository) LogError(errorMsg, stack string, context map[string]interface{}, severity string) error {
	id := uuid.New().String()
	contextJSON, _ := json.Marshal(context)

	query := `INSERT INTO error_logs (id, error_message, error_stack, context, severity, created_at)
		VALUES ($1, $2, $3, $4, $5, $6)`
	_, err := r.db.Exec(query, id, errorMsg, stack, contextJSON, severity, time.Now())
	return err
}

func (r *MonitoringRepository) GetErrorMetrics(hours int) (map[string]int, error) {
	query := `SELECT severity, COUNT(*) as count FROM error_logs 
		WHERE created_at >= NOW() - INTERVAL '1 hour' * $1 
		GROUP BY severity`

	rows, err := r.db.Query(query, hours)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	metrics := make(map[string]int)
	for rows.Next() {
		var severity string
		var count int
		rows.Scan(&severity, &count)
		metrics[severity] = count
	}

	return metrics, nil
}

func (r *MonitoringRepository) LogPerformance(queryType, endpoint string, duration int) error {
	id := uuid.New().String()
	query := `INSERT INTO performance_metrics (id, query_type, endpoint, duration, created_at)
		VALUES ($1, $2, $3, $4, $5)`
	_, err := r.db.Exec(query, id, queryType, endpoint, duration, time.Now())
	return err
}

func (r *MonitoringRepository) GetSlowQueries(threshold int) ([]PerformanceMetric, error) {
	var metrics []PerformanceMetric
	err := r.db.Select(&metrics, 
		"SELECT * FROM performance_metrics WHERE duration > $1 ORDER BY duration DESC LIMIT 50", 
		threshold)
	return metrics, err
}
