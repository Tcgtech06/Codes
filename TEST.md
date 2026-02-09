# KnitInfo API Testing Guide

## 1. Start the Server

```bash
cd D:\Freelancing\KnitInfo_Backend
go mod tidy
go run cmd/server/main.go
```

Server will start on http://localhost:8080

## 2. Test with cURL Commands

### Health Check
```bash
curl http://localhost:8080/health
```

### Login (Get JWT Token)
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"KnitInfo2024@Admin\"}"
```

### Get Companies (Public)
```bash
curl http://localhost:8080/api/v1/companies
```

### Create Company (Protected - Need Token)
```bash
curl -X POST http://localhost:8080/api/v1/companies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d "{\"companyName\":\"Test Company\",\"contactPerson\":\"John Doe\",\"email\":\"test@test.com\",\"phone\":\"+91 9876543210\",\"address\":\"Test Address\",\"category\":\"Yarn\",\"description\":\"Test Description\",\"products\":[\"Test Product\"]}"
```

### Search Companies
```bash
curl "http://localhost:8080/api/v1/companies/search?q=yarn&category=Yarn"
```

### Submit Contact Form
```bash
curl -X POST http://localhost:8080/api/v1/contact \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"user@test.com\",\"message\":\"Test message\"}"
```

## 3. Test with Postman

1. Import these requests into Postman
2. Set base URL: `http://localhost:8080`
3. For protected routes, add Authorization header: `Bearer <token>`

## 4. Quick Test Steps

1. **Start server**: `go run cmd/server/main.go`
2. **Login**: POST to `/api/v1/auth/login` with admin credentials
3. **Copy token** from response
4. **Test protected route**: Use token in Authorization header
5. **Test public routes**: No token needed

## Expected Responses

**Login Success:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 129600,
  "user": {
    "id": "1",
    "username": "admin", 
    "role": "admin"
  }
}
```

**Companies List:**
```json
{
  "companies": [...],
  "total": 2
}
```