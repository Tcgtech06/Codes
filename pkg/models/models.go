package models

import (
	"time"
	
	"github.com/lib/pq"
)

type Company struct {
	ID             string         `json:"id" db:"id"`
	CompanyName    string         `json:"companyName" db:"company_name"`
	ContactPerson  string         `json:"contactPerson" db:"contact_person"`
	Email          string         `json:"email" db:"email"`
	Phone          string         `json:"phone" db:"phone"`
	Website        *string        `json:"website,omitempty" db:"website"`
	Address        string         `json:"address" db:"address"`
	Category       string         `json:"category" db:"category"`
	Description    string         `json:"description" db:"description"`
	Products       pq.StringArray `json:"products" db:"products"`
	Certifications *string        `json:"certifications,omitempty" db:"certifications"`
	GSTNumber      *string        `json:"gstNumber,omitempty" db:"gst_number"`
	Status         string         `json:"status" db:"status"`
	CreatedAt      time.Time      `json:"createdAt" db:"created_at"`
	UpdatedAt      time.Time      `json:"updatedAt" db:"updated_at"`
}

type Priority struct {
	ID           string     `json:"id" db:"id"`
	CompanyID    string     `json:"companyId" db:"company_id"`
	CompanyName  string     `json:"companyName" db:"company_name"`
	Category     string     `json:"category" db:"category"`
	Position     int        `json:"position" db:"position"`
	PriorityType string     `json:"priorityType" db:"priority_type"`
	Duration     int        `json:"duration,omitempty" db:"duration"`
	DurationType string     `json:"durationType,omitempty" db:"duration_type"`
	ExpiresAt    *time.Time `json:"expiresAt,omitempty" db:"expires_at"`
	Status       string     `json:"status" db:"status"`
	CreatedAt    time.Time  `json:"createdAt" db:"created_at"`
	CreatedBy    string     `json:"createdBy" db:"created_by"`
}

type FormSubmission struct {
	ID          string                 `json:"id" db:"id"`
	Type        string                 `json:"type" db:"type"`
	FormData    map[string]interface{} `json:"formData" db:"form_data"`
	Attachments []string               `json:"attachments,omitempty" db:"attachments"`
	Status      string                 `json:"status" db:"status"`
	SubmittedAt time.Time              `json:"submittedAt" db:"submitted_at"`
	ReviewedAt  *time.Time             `json:"reviewedAt,omitempty" db:"reviewed_at"`
	ReviewedBy  string                 `json:"reviewedBy,omitempty" db:"reviewed_by"`
	ReviewNotes string                 `json:"reviewNotes,omitempty" db:"review_notes"`
}

type ContactMessage struct {
	ID        string    `json:"id" db:"id"`
	Name      string    `json:"name" db:"name"`
	Email     string    `json:"email" db:"email"`
	Message   string    `json:"message" db:"message"`
	CreatedAt time.Time `json:"createdAt" db:"created_at"`
}

type Category struct {
	ID           string    `json:"id" db:"id"`
	Name         string    `json:"name" db:"name"`
	Slug         string    `json:"slug" db:"slug"`
	DisplayOrder int       `json:"displayOrder" db:"display_order"`
	IsActive     bool      `json:"isActive" db:"is_active"`
	CreatedAt    time.Time `json:"createdAt" db:"created_at"`
	Count        int       `json:"count,omitempty" db:"-"`
}

type Book struct {
	ID          string    `json:"id" db:"id"`
	Title       string    `json:"title" db:"title"`
	Author      string    `json:"author" db:"author"`
	Description string    `json:"description" db:"description"`
	Price       float64   `json:"price" db:"price"`
	Category    string    `json:"category" db:"category"`
	CoverImage  string    `json:"coverImage" db:"cover_image"`
	Stock       int       `json:"stock" db:"stock"`
	Status      string    `json:"status" db:"status"`
	CreatedAt   time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt   time.Time `json:"updatedAt" db:"updated_at"`
}

type Order struct {
	ID           string    `json:"id" db:"id"`
	BookID       string    `json:"bookId" db:"book_id"`
	CustomerName string    `json:"customerName" db:"customer_name"`
	CustomerEmail string   `json:"customerEmail" db:"customer_email"`
	CustomerPhone string   `json:"customerPhone" db:"customer_phone"`
	Quantity     int       `json:"quantity" db:"quantity"`
	TotalAmount  float64   `json:"totalAmount" db:"total_amount"`
	Status       string    `json:"status" db:"status"`
	CreatedAt    time.Time `json:"createdAt" db:"created_at"`
}

type AppSettings struct {
	ID        string                 `json:"id" db:"id"`
	Key       string                 `json:"key" db:"key"`
	Value     map[string]interface{} `json:"value" db:"value"`
	UpdatedAt time.Time              `json:"updatedAt" db:"updated_at"`
}

type ExcelParseResponse struct {
	Success      bool               `json:"success"`
	Message      string             `json:"message,omitempty"`
	TotalRecords int                `json:"totalRecords,omitempty"`
	RecordsCount int                `json:"recordsCount,omitempty"`
	SuccessCount int                `json:"successCount,omitempty"`
	ErrorCount   int                `json:"errorCount,omitempty"`
	Data         []ExcelCompanyData `json:"data,omitempty"`
	Errors       []string           `json:"errors,omitempty"`
}

type ExcelCompanyData struct {
	SerialNumber   int      `json:"serialNumber,omitempty"`
	CompanyName    string   `json:"companyName"`
	ContactPerson  string   `json:"contactPerson,omitempty"`
	Email          string   `json:"email"`
	Phone          string   `json:"phone,omitempty"`
	PhoneNumber    string   `json:"phoneNumber,omitempty"`
	Website        string   `json:"website,omitempty"`
	Address        string   `json:"address"`
	Description    string   `json:"description,omitempty"`
	Products       string   `json:"products,omitempty"`
	Certifications string   `json:"certifications,omitempty"`
	GSTNumber      string   `json:"gstNumber,omitempty"`
}
