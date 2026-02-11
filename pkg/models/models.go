package models

import (
	"database/sql"
	"encoding/json"
	"time"

	"github.com/lib/pq"
)

type Company struct {
	ID             string         `json:"id" db:"id"`
	CompanyName    string         `json:"companyName" db:"company_name"`
	ContactPerson  string         `json:"contactPerson" db:"contact_person"`
	Email          string         `json:"email" db:"email"`
	Phone          string         `json:"phone" db:"phone"`
	Website        sql.NullString `json:"-" db:"website"`
	Address        string         `json:"address" db:"address"`
	Category       string         `json:"category" db:"category"`
	Description    string         `json:"description" db:"description"`
	Products       pq.StringArray `json:"products" db:"products"`
	Certifications sql.NullString `json:"-" db:"certifications"`
	GSTNumber      sql.NullString `json:"-" db:"gst_number"`
	Status         string         `json:"status" db:"status"`
	CreatedAt      time.Time      `json:"createdAt" db:"created_at"`
	UpdatedAt      time.Time      `json:"updatedAt" db:"updated_at"`
}

// MarshalJSON custom JSON marshaling for Company
func (c Company) MarshalJSON() ([]byte, error) {
	type Alias Company
	return json.Marshal(&struct {
		Website        string `json:"website,omitempty"`
		Certifications string `json:"certifications,omitempty"`
		GSTNumber      string `json:"gstNumber,omitempty"`
		*Alias
	}{
		Website:        c.Website.String,
		Certifications: c.Certifications.String,
		GSTNumber:      c.GSTNumber.String,
		Alias:          (*Alias)(&c),
	})
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
	Attachments pq.StringArray         `json:"attachments,omitempty" db:"attachments"`
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
	ID          string         `json:"id" db:"id"`
	Title       string         `json:"title" db:"title"`
	Author      string         `json:"author" db:"author"`
	Description string         `json:"description" db:"description"`
	Price       float64        `json:"price" db:"price"`
	Category    string         `json:"category" db:"category"`
	CoverImage  sql.NullString `json:"-" db:"cover_image"`
	Stock       int            `json:"stock" db:"stock"`
	Status      string         `json:"status" db:"status"`
	CreatedAt   time.Time      `json:"createdAt" db:"created_at"`
	UpdatedAt   time.Time      `json:"updatedAt" db:"updated_at"`
}

// MarshalJSON custom JSON marshaling for Book
func (b Book) MarshalJSON() ([]byte, error) {
	type Alias Book
	return json.Marshal(&struct {
		CoverImage string `json:"coverImage,omitempty"`
		*Alias
	}{
		CoverImage: b.CoverImage.String,
		Alias:      (*Alias)(&b),
	})
}

type Order struct {
	ID            string    `json:"id" db:"id"`
	BookID        string    `json:"bookId" db:"book_id"`
	CustomerName  string    `json:"customerName" db:"customer_name"`
	CustomerEmail string    `json:"customerEmail" db:"customer_email"`
	CustomerPhone string    `json:"customerPhone" db:"customer_phone"`
	Quantity      int       `json:"quantity" db:"quantity"`
	TotalAmount   float64   `json:"totalAmount" db:"total_amount"`
	Status        string    `json:"status" db:"status"`
	CreatedAt     time.Time `json:"createdAt" db:"created_at"`
}

type AppSettings struct {
	ID        string                 `json:"id" db:"id"`
	Key       string                 `json:"key" db:"key"`
	Value     map[string]interface{} `json:"value" db:"value"`
	UpdatedAt time.Time              `json:"updatedAt" db:"updated_at"`
}

// ExcelCompanyData represents parsed company data from Excel file
// Fixed structure: Serial Number, Company Name, Address, Phone Number, Email, Products
type ExcelCompanyData struct {
	SerialNumber int    `json:"serialNumber"`
	CompanyName  string `json:"companyName"`
	Address      string `json:"address"`
	PhoneNumber  string `json:"phoneNumber"`
	Email        string `json:"email"`
	Products     string `json:"products"`
}

// ExcelParseResponse represents the response for Excel file parsing
type ExcelParseResponse struct {
	Success      bool               `json:"success"`
	TotalRecords int                `json:"totalRecords"`
	Data         []ExcelCompanyData `json:"data"`
	Errors       []string           `json:"errors,omitempty"`
}
