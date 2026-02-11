package main

import (
	"fmt"
	"knitinfo-backend/pkg/database"
	"knitinfo-backend/pkg/models"
	"knitinfo-backend/pkg/repository"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/xuri/excelize/v2"
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
	jwtSecret   string
	adminUser   string
	adminPass   string
	tokenExpiry = 365 * 24 * time.Hour

	// Repositories
	companyRepo      *repository.CompanyRepository
	priorityRepo     *repository.PriorityRepository
	submissionRepo   *repository.SubmissionRepository
	contactRepo      *repository.ContactRepository
	bookRepo         *repository.BookRepository
	orderRepo        *repository.OrderRepository
	categoryRepo     *repository.CategoryRepository
	settingsRepo     *repository.SettingsRepository
	analyticsRepo    *repository.AnalyticsRepository
	excelRepo        *repository.ExcelUploadRepository
	notificationRepo *repository.NotificationRepository
	monitoringRepo   *repository.MonitoringRepository
)

func main() {
	if err := godotenv.Load(); err != nil {
		// .env file not found, using defaults
	}

	// Initialize database
	db, err := database.NewSupabaseConnection()
	if err != nil {
		panic("Failed to connect to database: " + err.Error())
	}
	defer db.Close()

	// Initialize repositories
	companyRepo = repository.NewCompanyRepository(db.DB)
	priorityRepo = repository.NewPriorityRepository(db.DB)
	submissionRepo = repository.NewSubmissionRepository(db.DB)
	contactRepo = repository.NewContactRepository(db.DB)
	bookRepo = repository.NewBookRepository(db.DB)
	orderRepo = repository.NewOrderRepository(db.DB)
	categoryRepo = repository.NewCategoryRepository(db.DB)
	settingsRepo = repository.NewSettingsRepository(db.DB)
	analyticsRepo = repository.NewAnalyticsRepository(db.DB)
	excelRepo = repository.NewExcelUploadRepository(db.DB)
	notificationRepo = repository.NewNotificationRepository(db.DB)
	monitoringRepo = repository.NewMonitoringRepository(db.DB)

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
	api.GET("/books", getBooks)
	api.GET("/books/:id", getBook)
	api.POST("/orders", createOrder)
	api.GET("/settings/:key", getSettings)

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
	protected.POST("/books", createBook)
	protected.GET("/orders", getOrders)
	protected.GET("/dashboard/stats", getDashboardStats)
	protected.POST("/excel/upload", uploadExcel)
	protected.POST("/excel/parse", parseExcelFile)
	protected.GET("/excel/history", getExcelHistory)
	protected.POST("/submissions/:id/approve", approveSubmission)
	protected.GET("/analytics/trends", getSubmissionTrends)
	protected.GET("/companies/export", exportCompanies)
	protected.GET("/monitoring/errors", getErrorMetrics)
	protected.GET("/monitoring/slow-queries", getSlowQueries)

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

	if req.Username != adminUser || req.Password != adminPass {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid credentials"})
	}

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
	limit := 0
	if l := c.QueryParam("limit"); l != "" {
		if _, err := fmt.Sscanf(l, "%d", &limit); err != nil {
			limit = 0
		}
	}

	companies, err := companyRepo.GetAll(category, status, limit)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"companies": companies,
		"total":     len(companies),
	})
}

func getCompany(c echo.Context) error {
	id := c.Param("id")
	company, err := companyRepo.GetByID(id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	if company == nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Company not found"})
	}
	return c.JSON(http.StatusOK, company)
}

func createCompany(c echo.Context) error {
	var company models.Company
	if err := c.Bind(&company); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	company.Status = "active"
	if err := companyRepo.Create(&company); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, map[string]interface{}{
		"message": "Company created successfully",
		"company": company,
	})
}

func updateCompany(c echo.Context) error {
	id := c.Param("id")
	var company models.Company
	if err := c.Bind(&company); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	if err := companyRepo.Update(id, &company); err != nil {
		if err.Error() == "company not found" {
			return c.JSON(http.StatusNotFound, map[string]string{"error": err.Error()})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"message": "Company updated successfully",
		"company": company,
	})
}

func deleteCompany(c echo.Context) error {
	id := c.Param("id")
	if err := companyRepo.Delete(id); err != nil {
		if err.Error() == "company not found" {
			return c.JSON(http.StatusNotFound, map[string]string{"error": err.Error()})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, map[string]string{"message": "Company deleted successfully"})
}

func searchCompanies(c echo.Context) error {
	query := c.QueryParam("q")
	category := c.QueryParam("category")

	companies, err := companyRepo.Search(query, category)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, companies)
}

func getCompaniesByCategory(c echo.Context) error {
	category := c.Param("category")
	companies, err := companyRepo.GetByCategory(category)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, companies)
}

// Priority handlers
func getPriorities(c echo.Context) error {
	category := c.QueryParam("category")
	priorities, err := priorityRepo.GetAll(category)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, priorities)
}

func getPrioritiesByCategory(c echo.Context) error {
	category := c.Param("category")
	priorities, err := priorityRepo.GetByCategory(category)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, priorities)
}

func createPriority(c echo.Context) error {
	var priority models.Priority
	if err := c.Bind(&priority); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	priority.Status = "active"
	user := c.Get("user").(User)
	priority.CreatedBy = user.Username

	if err := priorityRepo.Create(&priority); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, map[string]interface{}{
		"message":  "Priority created successfully",
		"priority": priority,
	})
}

func updatePriority(c echo.Context) error {
	id := c.Param("id")
	var priority models.Priority
	if err := c.Bind(&priority); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	if err := priorityRepo.Update(id, &priority); err != nil {
		if err.Error() == "priority not found" {
			return c.JSON(http.StatusNotFound, map[string]string{"error": err.Error()})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"message":  "Priority updated successfully",
		"priority": priority,
	})
}

func deletePriority(c echo.Context) error {
	id := c.Param("id")
	if err := priorityRepo.Delete(id); err != nil {
		if err.Error() == "priority not found" {
			return c.JSON(http.StatusNotFound, map[string]string{"error": err.Error()})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, map[string]string{"message": "Priority deleted successfully"})
}

// Form submission handlers
func getSubmissions(c echo.Context) error {
	submissionType := c.QueryParam("type")
	status := c.QueryParam("status")

	submissions, err := submissionRepo.GetAll(submissionType, status)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, submissions)
}

func getSubmissionsByType(c echo.Context) error {
	submissionType := c.Param("type")
	submissions, err := submissionRepo.GetByType(submissionType)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, submissions)
}

func createSubmission(c echo.Context) error {
	var submission models.FormSubmission
	if err := c.Bind(&submission); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	submission.Status = "pending"
	if err := submissionRepo.Create(&submission); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, map[string]interface{}{
		"message":    "Submission created successfully",
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

	user := c.Get("user").(User)
	if statusUpdate.ReviewedBy == "" {
		statusUpdate.ReviewedBy = user.Username
	}

	if err := submissionRepo.UpdateStatus(id, statusUpdate.Status, statusUpdate.ReviewedBy, statusUpdate.ReviewNotes); err != nil {
		if err.Error() == "submission not found" {
			return c.JSON(http.StatusNotFound, map[string]string{"error": err.Error()})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	submission, _ := submissionRepo.GetByID(id)
	return c.JSON(http.StatusOK, map[string]interface{}{
		"message":    "Submission status updated successfully",
		"submission": submission,
	})
}

// Contact handlers
func submitContact(c echo.Context) error {
	var contact models.ContactMessage
	if err := c.Bind(&contact); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	if err := contactRepo.Create(&contact); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Contact form submitted successfully"})
}

func getContacts(c echo.Context) error {
	contacts, err := contactRepo.GetAll()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, contacts)
}

// Categories handler
func getCategories(c echo.Context) error {
	categories, err := categoryRepo.GetAll()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	// Add company counts
	for i := range categories {
		count, _ := companyRepo.CountByCategory(categories[i].Name)
		categories[i].Count = count
	}

	return c.JSON(http.StatusOK, categories)
}

// Book handlers
func getBooks(c echo.Context) error {
	books, err := bookRepo.GetAll()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, books)
}

func getBook(c echo.Context) error {
	id := c.Param("id")
	book, err := bookRepo.GetByID(id)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Book not found"})
	}
	return c.JSON(http.StatusOK, book)
}

func createBook(c echo.Context) error {
	var book models.Book
	if err := c.Bind(&book); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	book.Status = "active"
	if err := bookRepo.Create(&book); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, map[string]interface{}{
		"message": "Book created successfully",
		"book":    book,
	})
}

// Order handlers
func createOrder(c echo.Context) error {
	var order models.Order
	if err := c.Bind(&order); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	order.Status = "pending"

	// Update book stock
	if err := bookRepo.UpdateStock(order.BookID, order.Quantity); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	if err := orderRepo.Create(&order); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, map[string]interface{}{
		"message": "Order created successfully",
		"order":   order,
	})
}

func getOrders(c echo.Context) error {
	orders, err := orderRepo.GetAll()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, orders)
}

// Settings handler
func getSettings(c echo.Context) error {
	key := c.Param("key")
	settings, err := settingsRepo.GetByKey(key)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	if settings == nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Settings not found"})
	}
	return c.JSON(http.StatusOK, settings.Value)
}

// Dashboard analytics handler
func getDashboardStats(c echo.Context) error {
	stats, err := analyticsRepo.GetDashboardStats()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, stats)
}

// Excel upload handlers
func uploadExcel(c echo.Context) error {
	var req struct {
		FileName string `json:"fileName"`
		FileURL  string `json:"fileUrl"`
		Category string `json:"category"`
	}
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	user := c.Get("user").(User)
	upload := &repository.ExcelUpload{
		FileName:   req.FileName,
		FileURL:    req.FileURL,
		Category:   req.Category,
		UploadedBy: user.Username,
		Status:     "processing",
	}

	if err := excelRepo.Create(upload); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusCreated, map[string]interface{}{
		"message":  "Upload started",
		"uploadId": upload.ID,
	})
}

func getExcelHistory(c echo.Context) error {
	uploads, err := excelRepo.GetHistory()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, uploads)
}

// Submission approval handler
func approveSubmission(c echo.Context) error {
	id := c.Param("id")
	submission, err := submissionRepo.GetByID(id)
	if err != nil || submission == nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Submission not found"})
	}

	if submission.Type == "add-data" {
		// Create company from submission
		company := &models.Company{
			CompanyName:   getStringFromMap(submission.FormData, "companyName"),
			ContactPerson: getStringFromMap(submission.FormData, "contactPerson"),
			Email:         getStringFromMap(submission.FormData, "email"),
			Phone:         getStringFromMap(submission.FormData, "phone"),
			Address:       getStringFromMap(submission.FormData, "address"),
			Category:      getStringFromMap(submission.FormData, "category"),
			Description:   getStringFromMap(submission.FormData, "description"),
			Status:        "active",
		}

		if err := companyRepo.Create(company); err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
		}
	}

	user := c.Get("user").(User)
	if err := submissionRepo.UpdateStatus(id, "approved", user.Username, "Approved and processed"); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Submission approved"})
}

func getStringFromMap(m map[string]interface{}, key string) string {
	if val, ok := m[key]; ok {
		if str, ok := val.(string); ok {
			return str
		}
	}
	return ""
}

// Analytics handlers
func getSubmissionTrends(c echo.Context) error {
	months := 12
	if m := c.QueryParam("months"); m != "" {
		if parsed, err := strconv.Atoi(m); err == nil {
			months = parsed
		}
	}

	trends, err := analyticsRepo.GetSubmissionTrends(months)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, trends)
}

// Export handler
func exportCompanies(c echo.Context) error {
	category := c.QueryParam("category")
	status := c.QueryParam("status")

	companies, err := companyRepo.GetAll(category, status, 0)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	c.Response().Header().Set("Content-Type", "text/csv")
	c.Response().Header().Set("Content-Disposition", "attachment; filename=companies.csv")

	// CSV header
	c.Response().Write([]byte("Company Name,Contact Person,Email,Phone,Category,Address\n"))

	// CSV rows
	for _, company := range companies {
		line := fmt.Sprintf("%s,%s,%s,%s,%s,%s\n",
			company.CompanyName, company.ContactPerson, company.Email,
			company.Phone, company.Category, company.Address)
		c.Response().Write([]byte(line))
	}

	return nil
}

// Monitoring handlers
func getErrorMetrics(c echo.Context) error {
	hours := 24
	if h := c.QueryParam("hours"); h != "" {
		if parsed, err := strconv.Atoi(h); err == nil {
			hours = parsed
		}
	}

	metrics, err := monitoringRepo.GetErrorMetrics(hours)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, metrics)
}

func getSlowQueries(c echo.Context) error {
	threshold := 1000 // 1 second
	if t := c.QueryParam("threshold"); t != "" {
		if parsed, err := strconv.Atoi(t); err == nil {
			threshold = parsed
		}
	}

	queries, err := monitoringRepo.GetSlowQueries(threshold)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, queries)
}

// Excel parsing handler
// Parses Excel file with fixed structure:
// Column 1: Serial Number
// Column 2: Company Name
// Column 3: Address
// Column 4: Phone Number
// Column 5: Email
// Column 6: Products
// Data starts from row 2 (row 1 contains headers)
func parseExcelFile(c echo.Context) error {
	// Get the uploaded file
	file, err := c.FormFile("file")
	if err != nil {
		return c.JSON(http.StatusBadRequest, models.ExcelParseResponse{
			Success: false,
			Errors:  []string{"No file uploaded or invalid file format"},
		})
	}

	// Open the uploaded file
	src, err := file.Open()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, models.ExcelParseResponse{
			Success: false,
			Errors:  []string{"Failed to open uploaded file"},
		})
	}
	defer src.Close()

	// Parse the Excel file
	xlsx, err := excelize.OpenReader(src)
	if err != nil {
		return c.JSON(http.StatusBadRequest, models.ExcelParseResponse{
			Success: false,
			Errors:  []string{"Failed to parse Excel file. Please ensure it's a valid .xlsx file"},
		})
	}
	defer xlsx.Close()

	// Get the first sheet name
	sheetName := xlsx.GetSheetName(0)
	if sheetName == "" {
		return c.JSON(http.StatusBadRequest, models.ExcelParseResponse{
			Success: false,
			Errors:  []string{"No sheets found in the Excel file"},
		})
	}

	// Get all rows from the first sheet
	rows, err := xlsx.GetRows(sheetName)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, models.ExcelParseResponse{
			Success: false,
			Errors:  []string{"Failed to read rows from Excel file"},
		})
	}

	// Check if file has data (at least header row + 1 data row)
	if len(rows) < 2 {
		return c.JSON(http.StatusBadRequest, models.ExcelParseResponse{
			Success: false,
			Errors:  []string{"Excel file is empty or contains only headers"},
		})
	}

	var companies []models.ExcelCompanyData
	var parseErrors []string

	// Process data rows (skip header row at index 0)
	for rowIndex := 1; rowIndex < len(rows); rowIndex++ {
		row := rows[rowIndex]

		// Skip empty rows
		if len(row) == 0 {
			continue
		}

		// Check if row has all 6 columns
		// Pad with empty strings if fewer columns
		for len(row) < 6 {
			row = append(row, "")
		}

		// Parse serial number
		serialNum := 0
		if row[0] != "" {
			if parsed, err := strconv.Atoi(strings.TrimSpace(row[0])); err == nil {
				serialNum = parsed
			} else {
				// Try to use row index as serial number if parsing fails
				serialNum = rowIndex
			}
		} else {
			serialNum = rowIndex
		}

		// Extract and clean data
		companyData := models.ExcelCompanyData{
			SerialNumber: serialNum,
			CompanyName:  strings.TrimSpace(row[1]),
			Address:      strings.TrimSpace(row[2]),
			PhoneNumber:  strings.TrimSpace(row[3]),
			Email:        strings.TrimSpace(row[4]),
			Products:     strings.TrimSpace(row[5]),
		}

		// Validate: at least company name should be present
		if companyData.CompanyName == "" {
			parseErrors = append(parseErrors, fmt.Sprintf("Row %d: Missing company name, skipped", rowIndex+1))
			continue
		}

		companies = append(companies, companyData)
	}

	// Return parsed data
	return c.JSON(http.StatusOK, models.ExcelParseResponse{
		Success:      true,
		TotalRecords: len(companies),
		Data:         companies,
		Errors:       parseErrors,
	})
}
