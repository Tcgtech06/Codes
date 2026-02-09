package repository

import (
	"github.com/jmoiron/sqlx"
)

type AnalyticsRepository struct {
	db *sqlx.DB
}

func NewAnalyticsRepository(db *sqlx.DB) *AnalyticsRepository {
	return &AnalyticsRepository{db: db}
}

type DashboardStats struct {
	TotalCompanies      int            `json:"totalCompanies"`
	ActiveCompanies     int            `json:"activeCompanies"`
	TotalSubmissions    int            `json:"totalSubmissions"`
	PendingSubmissions  int            `json:"pendingSubmissions"`
	TotalOrders         int            `json:"totalOrders"`
	ActivePriorities    int            `json:"activePriorities"`
	CompaniesByStatus   map[string]int `json:"companiesByStatus"`
	CompaniesByCategory map[string]int `json:"companiesByCategory"`
	SubmissionsByType   map[string]int `json:"submissionsByType"`
	SubmissionsByStatus map[string]int `json:"submissionsByStatus"`
}

func (r *AnalyticsRepository) GetDashboardStats() (*DashboardStats, error) {
	stats := &DashboardStats{
		CompaniesByStatus:   make(map[string]int),
		CompaniesByCategory: make(map[string]int),
		SubmissionsByType:   make(map[string]int),
		SubmissionsByStatus: make(map[string]int),
	}

	// Total companies
	r.db.Get(&stats.TotalCompanies, "SELECT COUNT(*) FROM companies")
	r.db.Get(&stats.ActiveCompanies, "SELECT COUNT(*) FROM companies WHERE status = 'active'")

	// Total submissions
	r.db.Get(&stats.TotalSubmissions, "SELECT COUNT(*) FROM form_submissions")
	r.db.Get(&stats.PendingSubmissions, "SELECT COUNT(*) FROM form_submissions WHERE status = 'pending'")

	// Total orders
	r.db.Get(&stats.TotalOrders, "SELECT COUNT(*) FROM orders")

	// Active priorities
	r.db.Get(&stats.ActivePriorities, "SELECT COUNT(*) FROM priorities WHERE status = 'active' AND (expires_at IS NULL OR expires_at > NOW())")

	// Companies by status
	rows, _ := r.db.Query("SELECT status, COUNT(*) as count FROM companies GROUP BY status")
	for rows.Next() {
		var status string
		var count int
		rows.Scan(&status, &count)
		stats.CompaniesByStatus[status] = count
	}
	rows.Close()

	// Companies by category
	rows, _ = r.db.Query("SELECT category, COUNT(*) as count FROM companies WHERE status = 'active' GROUP BY category")
	for rows.Next() {
		var category string
		var count int
		rows.Scan(&category, &count)
		stats.CompaniesByCategory[category] = count
	}
	rows.Close()

	// Submissions by type
	rows, _ = r.db.Query("SELECT type, COUNT(*) as count FROM form_submissions GROUP BY type")
	for rows.Next() {
		var submissionType string
		var count int
		rows.Scan(&submissionType, &count)
		stats.SubmissionsByType[submissionType] = count
	}
	rows.Close()

	// Submissions by status
	rows, _ = r.db.Query("SELECT status, COUNT(*) as count FROM form_submissions GROUP BY status")
	for rows.Next() {
		var status string
		var count int
		rows.Scan(&status, &count)
		stats.SubmissionsByStatus[status] = count
	}
	rows.Close()

	return stats, nil
}

func (r *AnalyticsRepository) GetSubmissionTrends(months int) (map[string]interface{}, error) {
	query := `
		SELECT 
			DATE_TRUNC('month', submitted_at) as month,
			type,
			COUNT(*) as count
		FROM form_submissions
		WHERE submitted_at >= NOW() - INTERVAL '1 month' * $1
		GROUP BY month, type
		ORDER BY month DESC
	`
	rows, err := r.db.Query(query, months)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	trends := make(map[string]interface{})
	for rows.Next() {
		var month string
		var submissionType string
		var count int
		rows.Scan(&month, &submissionType, &count)
		if trends[month] == nil {
			trends[month] = make(map[string]int)
		}
		trends[month].(map[string]int)[submissionType] = count
	}

	return trends, nil
}
