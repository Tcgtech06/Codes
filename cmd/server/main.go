package main

import (
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token     string `json:"token"`
	ExpiresIn int    `json:"expiresIn"`
	User      User   `json:"user"`
}

type User struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Role     string `json:"role"`
}

type JWTClaims struct {
	UserID   string `json:"user_id"`
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

var (
	jwtSecret    string
	adminUser    string
	adminPass    string
	tokenExpiry  = 36 * time.Hour
)

type Company struct {
	ID           string    `json:"id"`
	CompanyName  string    `json:"companyName"`
	ContactPerson string   `json:"contactPerson"`
	Email        string    `json:"email"`
	Phone        string    `json:"phone"`
	Website      string    `json:"website,omitempty"`
	Address      string    `json:"address"`
	Category     string    `json:"category"`
	Description  string    `json:"description"`
	Products     []string  `json:"products"`
	Certifications string `json:"certifications,omitempty"`
	GSTNumber    string    `json:"gstNumber,omitempty"`
	Status       string    `json:"status"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}

type Priority struct {
	ID           string    `json:"id"`
	CompanyID    string    `json:"companyId"`
	CompanyName  string    `json:"companyName"`
	Category     string    `json:"category"`
	Position     int       `json:"position"`
	PriorityType string    `json:"priorityType"`
	Duration     int       `json:"duration,omitempty"`
	DurationType string    `json:"durationType,omitempty"`
	ExpiresAt    *time.Time `json:"expiresAt,omitempty"`
	Status       string    `json:"status"`
	CreatedAt    time.Time `json:"createdAt"`
	CreatedBy    string    `json:"createdBy"`
}

type FormSubmission struct {
	ID          string                 `json:"id"`
	Type        string                 `json:"type"`
	FormData    map[string]interface{} `json:"formData"`
	Attachments []string               `json:"attachments,omitempty"`
	Status      string                 `json:"status"`
	SubmittedAt time.Time              `json:"submittedAt"`
	ReviewedAt  *time.Time             `json:"reviewedAt,omitempty"`
	ReviewedBy  string                 `json:"reviewedBy,omitempty"`
	ReviewNotes string                 `json:"reviewNotes,omitempty"`
}

type ContactMessage struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Message   string    `json:"message"`
	CreatedAt time.Time `json:"createdAt"`
}

// In-memory storage (replace with database in production)
var (
	companies    []Company
	priorities   []Priority
	submissions  []FormSubmission
	contacts     []ContactMessage
	counterID    int
)

func init() {
	// Sample data
	companies = []Company{
		{
			ID: "1", CompanyName: "ABC Textiles Ltd", ContactPerson: "John Doe",
			Email: "john@abctextiles.com", Phone: "+91 9876543210",
			Address: "123 Industrial Area, Tirupur, Tamil Nadu", Category: "Yarn",
			Description: "Leading yarn manufacturer", Products: []string{"Cotton Yarn", "Polyester Yarn"},
			Status: "active", CreatedAt: time.Now(), UpdatedAt: time.Now(),
		},
		{
			ID: "2", CompanyName: "Global Yarn Suppliers", ContactPerson: "Jane Smith",
			Email: "jane@globalyarn.com", Phone: "+91 9876543212",
			Address: "789 Export Zone, Chennai, Tamil Nadu", Category: "Yarn",
			Description: "Premium yarn suppliers", Products: []string{"Organic Cotton", "Recycled Yarn"},
			Status: "active", CreatedAt: time.Now(), UpdatedAt: time.Now(),
		},
	}
	counterID = 3
}

func main() {
	if err := godotenv.Load(); err != nil {
		// .env file not found, using defaults
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Load auth config
	jwtSecret = os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "knitinfo-secret-key-2024"
	}
	adminUser = os.Getenv("ADMIN_USERNAME")
	if adminUser == "" {
		adminUser = "admin"
	}
	adminPass = os.Getenv("ADMIN_PASSWORD")
	if adminPass == "" {
		adminPass = "KnitInfo2024@Admin"
	}

	e := echo.New()

	e.Use(middleware.CORS())
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Health check
	e.GET("/health", healthCheck)

	// Auth routes
	e.POST("/api/v1/auth/login", login)
	e.POST("/api/v1/auth/verify", verifyToken)

	// API routes
	api := e.Group("/api/v1")
	
	// Public routes
	api.GET("/companies", getCompanies)
	api.GET("/companies/:id", getCompany)
	api.GET("/companies/search", searchCompanies)
	api.GET("/companies/category/:category", getCompaniesByCategory)
	api.GET("/priorities", getPriorities)
	api.GET("/priorities/category/:category", getPrioritiesByCategory)
	api.POST("/submissions", createSubmission)
	api.POST("/contact", submitContact)
	api.GET("/categories", getCategories)
	
	// Protected routes (require JWT)
	protected := api.Group("")
	protected.Use(jwtMiddleware())
	protected.POST("/companies", createCompany)
	protected.PUT("/companies/:id", updateCompany)
	protected.DELETE("/companies/:id", deleteCompany)
	protected.POST("/priorities", createPriority)
	protected.PUT("/priorities/:id", updatePriority)
	protected.DELETE("/priorities/:id", deletePriority)
	protected.GET("/submissions", getSubmissions)
	protected.GET("/submissions/type/:type", getSubmissionsByType)
	protected.PUT("/submissions/:id/status", updateSubmissionStatus)
	protected.GET("/contacts", getContacts)

	e.Logger.Fatal(e.Start(":" + port))
}

func healthCheck(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{"status": "ok", "service": "KnitInfo API"})
}

// Auth handlers
func login(c echo.Context) error {
	var req LoginRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request"})
	}

	// Validate credentials
	if req.Username != adminUser || req.Password != adminPass {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid credentials"})
	}

	// Create JWT token
	claims := &JWTClaims{
		UserID:   "1",
		Username: req.Username,
		Role:     "admin",
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(tokenExpiry)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "knitinfo-api",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(jwtSecret))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Could not create token"})
	}

	return c.JSON(http.StatusOK, LoginResponse{
		Token:     tokenString,
		ExpiresIn: int(tokenExpiry.Seconds()),
		User: User{
			ID:       "1",
			Username: req.Username,
			Role:     "admin",
		},
	})
}

func verifyToken(c echo.Context) error {
	var req struct {
		Token string `json:"token"`
	}
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request"})
	}

	token, err := jwt.ParseWithClaims(req.Token, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(jwtSecret), nil
	})

	if err != nil || !token.Valid {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid token"})
	}

	claims, ok := token.Claims.(*JWTClaims)
	if !ok {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid token claims"})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"valid": true,
		"user": User{
			ID:       claims.UserID,
			Username: claims.Username,
			Role:     claims.Role,
		},
		"expiresAt": claims.ExpiresAt.Time,
	})
}

// JWT Middleware
func jwtMiddleware() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			auth := c.Request().Header.Get("Authorization")
			if auth == "" {
				return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Missing authorization header"})
			}

			tokenString := strings.TrimPrefix(auth, "Bearer ")
			if tokenString == auth {
				return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid authorization format"})
			}

			token, err := jwt.ParseWithClaims(tokenString, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
				return []byte(jwtSecret), nil
			})

			if err != nil || !token.Valid {
				return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid token"})
			}

			claims, ok := token.Claims.(*JWTClaims)
			if !ok {
				return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid token claims"})
			}

			// Store user info in context
			c.Set("user", User{
				ID:       claims.UserID,
				Username: claims.Username,
				Role:     claims.Role,
			})

			return next(c)
		}
	}
}

// Company handlers
func getCompanies(c echo.Context) error {
	category := c.QueryParam("category")
	status := c.QueryParam("status")
	limitStr := c.QueryParam("limit")
	
	filteredCompanies := companies
	
	if category != "" {
		var filtered []Company
		for _, comp := range companies {
			if strings.EqualFold(comp.Category, category) {
				filtered = append(filtered, comp)
			}
		}
		filteredCompanies = filtered
	}
	
	if status != "" {
		var filtered []Company
		for _, comp := range filteredCompanies {
			if comp.Status == status {
				filtered = append(filtered, comp)
			}
		}
		filteredCompanies = filtered
	}
	
	if limitStr != "" {
		if limit, err := strconv.Atoi(limitStr); err == nil && limit > 0 {
			if len(filteredCompanies) > limit {
				filteredCompanies = filteredCompanies[:limit]
			}
		}
	}
	
	return c.JSON(http.StatusOK, map[string]interface{}{
		"companies": filteredCompanies,
		"total": len(filteredCompanies),
	})
}

func getCompany(c echo.Context) error {
	id := c.Param("id")
	for _, comp := range companies {
		if comp.ID == id {
			return c.JSON(http.StatusOK, comp)
		}
	}
	return c.JSON(http.StatusNotFound, map[string]string{"error": "Company not found"})
}

func createCompany(c echo.Context) error {
	var company Company
	if err := c.Bind(&company); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}
	
	counterID++
	company.ID = strconv.Itoa(counterID)
	company.Status = "active"
	company.CreatedAt = time.Now()
	company.UpdatedAt = time.Now()
	
	companies = append(companies, company)
	
	return c.JSON(http.StatusCreated, map[string]interface{}{
		"message": "Company created successfully",
		"company": company,
	})
}

func updateCompany(c echo.Context) error {
	id := c.Param("id")
	var updates Company
	if err := c.Bind(&updates); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}
	
	for i, comp := range companies {
		if comp.ID == id {
			updates.ID = id
			updates.CreatedAt = comp.CreatedAt
			updates.UpdatedAt = time.Now()
			companies[i] = updates
			return c.JSON(http.StatusOK, map[string]interface{}{
				"message": "Company updated successfully",
				"company": updates,
			})
		}
	}
	return c.JSON(http.StatusNotFound, map[string]string{"error": "Company not found"})
}

func deleteCompany(c echo.Context) error {
	id := c.Param("id")
	for i, comp := range companies {
		if comp.ID == id {
			companies = append(companies[:i], companies[i+1:]...)
			return c.JSON(http.StatusOK, map[string]string{"message": "Company deleted successfully"})
		}
	}
	return c.JSON(http.StatusNotFound, map[string]string{"error": "Company not found"})
}

func searchCompanies(c echo.Context) error {
	query := strings.ToLower(c.QueryParam("q"))
	category := c.QueryParam("category")
	
	var results []Company
	for _, comp := range companies {
		if comp.Status != "active" {
			continue
		}
		
		if category != "" && !strings.EqualFold(comp.Category, category) {
			continue
		}
		
		if query == "" || 
		   strings.Contains(strings.ToLower(comp.CompanyName), query) ||
		   strings.Contains(strings.ToLower(comp.Description), query) ||
		   strings.Contains(strings.ToLower(comp.Address), query) {
			results = append(results, comp)
		}
	}
	
	return c.JSON(http.StatusOK, results)
}

func getCompaniesByCategory(c echo.Context) error {
	category := c.Param("category")
	var results []Company
	
	for _, comp := range companies {
		if strings.EqualFold(comp.Category, category) && comp.Status == "active" {
			results = append(results, comp)
		}
	}
	
	return c.JSON(http.StatusOK, results)
}

// Priority handlers
func getPriorities(c echo.Context) error {
	category := c.QueryParam("category")
	var filtered []Priority
	
	for _, priority := range priorities {
		if priority.Status != "active" {
			continue
		}
		
		// Check if expired
		if priority.ExpiresAt != nil && time.Now().After(*priority.ExpiresAt) {
			continue
		}
		
		if category == "" || strings.EqualFold(priority.Category, category) {
			filtered = append(filtered, priority)
		}
	}
	
	return c.JSON(http.StatusOK, filtered)
}

func getPrioritiesByCategory(c echo.Context) error {
	category := c.Param("category")
	var results []Priority
	
	for _, priority := range priorities {
		if strings.EqualFold(priority.Category, category) && priority.Status == "active" {
			// Check if not expired
			if priority.ExpiresAt == nil || time.Now().Before(*priority.ExpiresAt) {
				results = append(results, priority)
			}
		}
	}
	
	return c.JSON(http.StatusOK, results)
}

func createPriority(c echo.Context) error {
	var priority Priority
	if err := c.Bind(&priority); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}
	
	counterID++
	priority.ID = strconv.Itoa(counterID)
	priority.Status = "active"
	priority.CreatedAt = time.Now()
	
	// Set expiration if temporary
	if priority.PriorityType == "temporary" && priority.Duration > 0 {
		var expiresAt time.Time
		switch priority.DurationType {
		case "days":
			expiresAt = time.Now().AddDate(0, 0, priority.Duration)
		case "months":
			expiresAt = time.Now().AddDate(0, priority.Duration, 0)
		case "years":
			expiresAt = time.Now().AddDate(priority.Duration, 0, 0)
		}
		priority.ExpiresAt = &expiresAt
	}
	
	priorities = append(priorities, priority)
	
	return c.JSON(http.StatusCreated, map[string]interface{}{
		"message": "Priority created successfully",
		"priority": priority,
	})
}

func updatePriority(c echo.Context) error {
	id := c.Param("id")
	var updates Priority
	if err := c.Bind(&updates); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}
	
	for i, priority := range priorities {
		if priority.ID == id {
			updates.ID = id
			updates.CreatedAt = priority.CreatedAt
			priorities[i] = updates
			return c.JSON(http.StatusOK, map[string]interface{}{
				"message": "Priority updated successfully",
				"priority": updates,
			})
		}
	}
	return c.JSON(http.StatusNotFound, map[string]string{"error": "Priority not found"})
}

func deletePriority(c echo.Context) error {
	id := c.Param("id")
	for i, priority := range priorities {
		if priority.ID == id {
			priorities = append(priorities[:i], priorities[i+1:]...)
			return c.JSON(http.StatusOK, map[string]string{"message": "Priority deleted successfully"})
		}
	}
	return c.JSON(http.StatusNotFound, map[string]string{"error": "Priority not found"})
}

// Form submission handlers
func getSubmissions(c echo.Context) error {
	submissionType := c.QueryParam("type")
	status := c.QueryParam("status")
	
	var filtered []FormSubmission
	for _, submission := range submissions {
		if (submissionType == "" || submission.Type == submissionType) &&
		   (status == "" || submission.Status == status) {
			filtered = append(filtered, submission)
		}
	}
	
	return c.JSON(http.StatusOK, filtered)
}

func getSubmissionsByType(c echo.Context) error {
	submissionType := c.Param("type")
	var results []FormSubmission
	
	for _, submission := range submissions {
		if submission.Type == submissionType {
			results = append(results, submission)
		}
	}
	
	return c.JSON(http.StatusOK, results)
}

func createSubmission(c echo.Context) error {
	var submission FormSubmission
	if err := c.Bind(&submission); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}
	
	counterID++
	submission.ID = strconv.Itoa(counterID)
	submission.Status = "pending"
	submission.SubmittedAt = time.Now()
	
	submissions = append(submissions, submission)
	
	return c.JSON(http.StatusCreated, map[string]interface{}{
		"message": "Submission created successfully",
		"submission": submission,
	})
}

func updateSubmissionStatus(c echo.Context) error {
	id := c.Param("id")
	var statusUpdate struct {
		Status      string `json:"status"`
		ReviewNotes string `json:"reviewNotes,omitempty"`
		ReviewedBy  string `json:"reviewedBy,omitempty"`
	}
	
	if err := c.Bind(&statusUpdate); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}
	
	for i, submission := range submissions {
		if submission.ID == id {
			now := time.Now()
			submissions[i].Status = statusUpdate.Status
			submissions[i].ReviewedAt = &now
			submissions[i].ReviewedBy = statusUpdate.ReviewedBy
			submissions[i].ReviewNotes = statusUpdate.ReviewNotes
			
			return c.JSON(http.StatusOK, map[string]interface{}{
				"message": "Submission status updated successfully",
				"submission": submissions[i],
			})
		}
	}
	return c.JSON(http.StatusNotFound, map[string]string{"error": "Submission not found"})
}

// Contact handlers
func submitContact(c echo.Context) error {
	var contact ContactMessage
	if err := c.Bind(&contact); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}
	
	counterID++
	contact.ID = strconv.Itoa(counterID)
	contact.CreatedAt = time.Now()
	
	contacts = append(contacts, contact)
	
	return c.JSON(http.StatusOK, map[string]string{"message": "Contact form submitted successfully"})
}

func getContacts(c echo.Context) error {
	return c.JSON(http.StatusOK, contacts)
}

// Categories handler
func getCategories(c echo.Context) error {
	categories := []map[string]interface{}{
		{"name": "Yarn", "slug": "yarn", "count": getCompanyCountByCategory("Yarn")},
		{"name": "Fabric Suppliers", "slug": "fabric-suppliers", "count": getCompanyCountByCategory("Fabric Suppliers")},
		{"name": "Knitting", "slug": "knitting", "count": getCompanyCountByCategory("Knitting")},
		{"name": "Buying Agents", "slug": "buying-agents", "count": getCompanyCountByCategory("Buying Agents")},
		{"name": "Printing", "slug": "printing", "count": getCompanyCountByCategory("Printing")},
		{"name": "Threads", "slug": "threads", "count": getCompanyCountByCategory("Threads")},
		{"name": "Trims & Accessories", "slug": "trims-accessories", "count": getCompanyCountByCategory("Trims & Accessories")},
		{"name": "Dyes & Chemicals", "slug": "dyes-chemicals", "count": getCompanyCountByCategory("Dyes & Chemicals")},
		{"name": "Machineries", "slug": "machineries", "count": getCompanyCountByCategory("Machineries")},
		{"name": "Machine Spares", "slug": "machine-spares", "count": getCompanyCountByCategory("Machine Spares")},
	}
	
	return c.JSON(http.StatusOK, categories)
}

func getCompanyCountByCategory(category string) int {
	count := 0
	for _, comp := range companies {
		if strings.EqualFold(comp.Category, category) && comp.Status == "active" {
			count++
		}
	}
	return count
}