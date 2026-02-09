# API Testing Guide

## Test with cURL

### 1. Health Check
```bash
curl http://localhost:8080/health
```

### 2. Get All Companies
```bash
curl http://localhost:8080/api/v1/companies
```

### 3. Get Companies by Category
```bash
curl http://localhost:8080/api/v1/companies/category/Yarn
```

### 4. Search Companies
```bash
curl "http://localhost:8080/api/v1/companies/search?q=textile"
```

### 5. Get Categories
```bash
curl http://localhost:8080/api/v1/categories
```

### 6. Admin Login
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"KnitInfo2024@Admin\"}"
```

Save the token from response!

### 7. Create Company (Protected)
```bash
curl -X POST http://localhost:8080/api/v1/companies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "companyName": "Test Company",
    "contactPerson": "John Doe",
    "email": "test@example.com",
    "phone": "+91 9876543210",
    "address": "123 Test Street, City",
    "category": "Yarn",
    "description": "Test company description",
    "products": ["Product 1", "Product 2"]
  }'
```

### 8. Submit Form
```bash
curl -X POST http://localhost:8080/api/v1/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "type": "add-data",
    "formData": {
      "companyName": "New Company",
      "email": "new@company.com",
      "phone": "+91 9999999999"
    }
  }'
```

### 9. Submit Contact
```bash
curl -X POST http://localhost:8080/api/v1/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "user@test.com",
    "message": "This is a test message"
  }'
```

### 10. Get Submissions (Protected)
```bash
curl http://localhost:8080/api/v1/submissions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Test with PowerShell (Windows)

### Login and Get Token
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"username":"admin","password":"KnitInfo2024@Admin"}'

$token = $response.token
Write-Host "Token: $token"
```

### Create Company with Token
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$body = @{
    companyName = "PowerShell Test Company"
    contactPerson = "Jane Doe"
    email = "jane@test.com"
    phone = "+91 9876543210"
    address = "456 PS Street"
    category = "Fabric Suppliers"
    description = "Created via PowerShell"
    products = @("Fabric 1", "Fabric 2")
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/v1/companies" `
  -Method Post `
  -Headers $headers `
  -Body $body
```

## Import Postman Collection

Use the existing `KnitInfo_API.postman_collection.json` file:
1. Open Postman
2. Import → Upload Files
3. Select `KnitInfo_API.postman_collection.json`
4. Update base URL to `http://localhost:8080`

## Expected Responses

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "error": "Error message here"
}
```

### Companies List
```json
{
  "companies": [
    {
      "id": "uuid-here",
      "companyName": "ABC Textiles Ltd",
      "category": "Yarn",
      ...
    }
  ],
  "total": 2
}
```

## Testing Checklist

- [ ] Health check works
- [ ] Can get companies list
- [ ] Can search companies
- [ ] Can filter by category
- [ ] Admin login works
- [ ] Can create company with token
- [ ] Can update company
- [ ] Can delete company
- [ ] Can submit forms
- [ ] Can get submissions (admin)
- [ ] Categories endpoint works
- [ ] Priorities work
