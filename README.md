# KnitInfo Backend API

🚀 **Now with Supabase PostgreSQL Integration!**

Go backend API using Echo framework and Supabase for the KnitInfo textile directory application.

## 🎯 Quick Start

### 1. Setup Supabase (5 minutes)
```bash
# 1. Create account at https://supabase.com
# 2. Create new project
# 3. Run migration from migrations/001_initial_schema.sql
# 4. Get connection string from Settings → Database
```

### 2. Configure
```bash
# Update .env with your Supabase credentials
SUPABASE_DB_URL=postgresql://postgres:YOUR_PASSWORD@db.xxx.supabase.co:5432/postgres
```

### 3. Run
```bash
go mod tidy
go run cmd/server/main.go
```

### 4. Test
```bash
curl http://localhost:8080/health
curl http://localhost:8080/api/v1/companies
```

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get running in 5 minutes
- **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** - Detailed setup guide
- **[API_TESTING.md](API_TESTING.md)** - Test all endpoints
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture
- **[SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)** - Step-by-step checklist

## 🎯 API Endpoints

### Public Endpoints
- `GET /api/v1/companies` - List companies
- `GET /api/v1/companies/:id` - Get company
- `GET /api/v1/companies/search` - Search companies
- `GET /api/v1/categories` - List categories
- `GET /api/v1/priorities` - List priorities
- `GET /api/v1/books` - List books
- `GET /api/v1/books/:id` - Get book details
- `POST /api/v1/orders` - Create order
- `GET /api/v1/settings/:key` - Get settings
- `POST /api/v1/submissions` - Submit form
- `POST /api/v1/contact` - Contact form
- `POST /api/v1/auth/login` - Admin login

### Protected Endpoints (JWT Required)
- `POST /api/v1/companies` - Create company
- `PUT /api/v1/companies/:id` - Update company
- `DELETE /api/v1/companies/:id` - Delete company
- `POST /api/v1/priorities` - Create priority
- `POST /api/v1/books` - Create book
- `GET /api/v1/orders` - List orders
- `GET /api/v1/submissions` - List submissions
- `GET /api/v1/contacts` - List contacts

## 🏗️ Architecture

```
Frontend (Next.js)
       ↓
Echo API Server (Go)
       ↓
Repository Layer
       ↓
Supabase PostgreSQL
```

## 📊 Database Schema

- **companies** - Business directory listings
- **priorities** - Company ranking system
- **form_submissions** - User form submissions
- **contact_messages** - Contact form messages
- **categories** - Business categories
- **books** - Book catalog
- **orders** - Book orders
- **app_settings** - Application settings

## API Endpoints

### Health Check
- `GET /health` - Health check

### Companies
- `GET /api/v1/companies` - Get all companies (supports ?category, ?status, ?limit)
- `GET /api/v1/companies/:id` - Get company by ID
- `POST /api/v1/companies` - Create new company
- `PUT /api/v1/companies/:id` - Update company
- `DELETE /api/v1/companies/:id` - Delete company
- `GET /api/v1/companies/search` - Search companies (?q=query&category=category)
- `GET /api/v1/companies/category/:category` - Get companies by category

### Priorities
- `GET /api/v1/priorities` - Get all priorities (supports ?category)
- `GET /api/v1/priorities/category/:category` - Get priorities by category
- `POST /api/v1/priorities` - Create new priority
- `PUT /api/v1/priorities/:id` - Update priority
- `DELETE /api/v1/priorities/:id` - Delete priority

### Form Submissions
- `GET /api/v1/submissions` - Get all submissions (supports ?type, ?status)
- `GET /api/v1/submissions/type/:type` - Get submissions by type
- `POST /api/v1/submissions` - Create new submission
- `PUT /api/v1/submissions/:id/status` - Update submission status

### Contact
- `POST /api/v1/contact` - Submit contact form
- `GET /api/v1/contacts` - Get all contact messages

### Categories
- `GET /api/v1/categories` - Get all categories with company counts

## Data Models

### Company
```json
{
  "id": "string",
  "companyName": "string",
  "contactPerson": "string",
  "email": "string",
  "phone": "string",
  "website": "string",
  "address": "string",
  "category": "string",
  "description": "string",
  "products": ["string"],
  "certifications": "string",
  "gstNumber": "string",
  "status": "active|inactive|pending",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Priority
```json
{
  "id": "string",
  "companyId": "string",
  "companyName": "string",
  "category": "string",
  "position": "number",
  "priorityType": "permanent|temporary",
  "duration": "number",
  "durationType": "days|months|years",
  "expiresAt": "timestamp",
  "status": "active|expired",
  "createdAt": "timestamp",
  "createdBy": "string"
}
```

### Form Submission
```json
{
  "id": "string",
  "type": "add-data|advertise|collaborate",
  "formData": {},
  "attachments": ["string"],
  "status": "pending|reviewed|approved|rejected",
  "submittedAt": "timestamp",
  "reviewedAt": "timestamp",
  "reviewedBy": "string",
  "reviewNotes": "string"
}
```

## Authentication

### Login
- `POST /api/v1/auth/login` - Admin login
- `POST /api/v1/auth/verify` - Verify JWT token

**Login Request:**
```json
{
  "username": "admin",
  "password": "KnitInfo2024@Admin"
}
```

**Login Response:**
```json
{
  "token": "jwt_token_string",
  "expiresIn": 129600,
  "user": {
    "id": "1",
    "username": "admin",
    "role": "admin"
  }
}
```

**Protected Routes:**
Require `Authorization: Bearer <token>` header:
- Company management (POST, PUT, DELETE)
- Priority management (POST, PUT, DELETE)
- Submission management (GET, PUT)
- Contact management (GET)

**Public Routes:**
- Company listing and search
- Priority listing
- Form submissions (POST)
- Contact form (POST)
- Categories

### Health Check

1. Install dependencies:
```bash
go mod tidy
```

2. Run the server:
```bash
go run cmd/server/main.go
```

3. Server runs on port 8080 by default

## Categories Supported
- Yarn
- Fabric Suppliers
- Knitting
- Buying Agents
- Printing
- Threads
- Trims & Accessories
- Dyes & Chemicals
- Machineries
- Machine Spares

## Features
- CORS enabled for frontend integration
- Request logging
- Error recovery middleware
- In-memory storage (replace with database in production)
- Priority system with expiration
- Form submission management
- Search functionality
- Category-based filtering