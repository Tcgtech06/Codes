# Common Commands - KnitInfo Backend

## Development Commands

### Start Server
```bash
go run cmd/server/main.go
```

### Install Dependencies
```bash
go mod tidy
```

### Clean and Reinstall
```bash
go clean -modcache
go mod download
go mod tidy
```

### Build Binary
```bash
go build -o knitinfo-api cmd/server/main.go
```

### Run Binary
```bash
# Windows
.\knitinfo-api.exe

# Linux/Mac
./knitinfo-api
```

## Testing Commands

### Health Check
```bash
curl http://localhost:8080/health
```

### Get All Companies
```bash
curl http://localhost:8080/api/v1/companies
```

### Get Companies by Category
```bash
curl http://localhost:8080/api/v1/companies/category/Yarn
```

### Search Companies
```bash
curl "http://localhost:8080/api/v1/companies/search?q=textile"
```

### Admin Login
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"KnitInfo2024@Admin\"}"
```

### Create Company (with token)
```bash
curl -X POST http://localhost:8080/api/v1/companies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "companyName": "Test Company",
    "contactPerson": "John Doe",
    "email": "test@example.com",
    "phone": "+91 9876543210",
    "address": "123 Test St",
    "category": "Yarn",
    "description": "Test description",
    "products": ["Product 1"]
  }'
```

## Database Commands (Supabase SQL Editor)

### View All Companies
```sql
SELECT * FROM companies ORDER BY created_at DESC;
```

### Count Companies by Category
```sql
SELECT category, COUNT(*) as count 
FROM companies 
WHERE status = 'active' 
GROUP BY category 
ORDER BY count DESC;
```

### View Recent Submissions
```sql
SELECT * FROM form_submissions 
ORDER BY submitted_at DESC 
LIMIT 10;
```

### View Active Priorities
```sql
SELECT * FROM priorities 
WHERE status = 'active' 
AND (expires_at IS NULL OR expires_at > NOW())
ORDER BY category, position;
```

### Delete All Test Data
```sql
-- Be careful with this!
DELETE FROM companies WHERE company_name LIKE '%Test%';
DELETE FROM priorities WHERE company_name LIKE '%Test%';
```

### Reset Sample Data
```sql
-- Delete existing
DELETE FROM companies;

-- Insert fresh samples
INSERT INTO companies (company_name, contact_person, email, phone, address, category, description, products, status)
VALUES 
    ('ABC Textiles Ltd', 'John Doe', 'john@abctextiles.com', '+91 9876543210', 
     '123 Industrial Area, Tirupur, Tamil Nadu', 'Yarn', 
     'Leading yarn manufacturer', 
     ARRAY['Cotton Yarn', 'Polyester Yarn'], 'active'),
    ('Global Yarn Suppliers', 'Jane Smith', 'jane@globalyarn.com', '+91 9876543212',
     '789 Export Zone, Chennai, Tamil Nadu', 'Yarn',
     'Premium yarn suppliers',
     ARRAY['Organic Cotton', 'Recycled Yarn'], 'active');
```

## Git Commands

### Initial Commit
```bash
git add .
git commit -m "Add Supabase integration"
git push
```

### Ignore .env
```bash
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Add .env to gitignore"
```

## Environment Commands

### View Current Environment
```bash
# Windows
type .env

# Linux/Mac
cat .env
```

### Set Environment Variable (temporary)
```bash
# Windows
set PORT=3000

# Linux/Mac
export PORT=3000
```

## Deployment Commands

### Build for Linux (from Windows)
```bash
set GOOS=linux
set GOARCH=amd64
go build -o knitinfo-api cmd/server/main.go
```

### Build for Windows (from Linux/Mac)
```bash
GOOS=windows GOARCH=amd64 go build -o knitinfo-api.exe cmd/server/main.go
```

## Troubleshooting Commands

### Check Go Version
```bash
go version
```

### Check Port Usage
```bash
# Windows
netstat -ano | findstr :8080

# Linux/Mac
lsof -i :8080
```

### Kill Process on Port
```bash
# Windows (get PID from netstat, then)
taskkill /PID <PID> /F

# Linux/Mac
kill -9 $(lsof -t -i:8080)
```

### View Go Environment
```bash
go env
```

### Clear Go Cache
```bash
go clean -cache
go clean -modcache
go clean -testcache
```

## PowerShell Commands (Windows)

### Test API with PowerShell
```powershell
# Health check
Invoke-RestMethod -Uri "http://localhost:8080/health"

# Get companies
Invoke-RestMethod -Uri "http://localhost:8080/api/v1/companies"

# Login
$response = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"username":"admin","password":"KnitInfo2024@Admin"}'

$token = $response.token
Write-Host "Token: $token"

# Create company
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$body = @{
    companyName = "PS Test Company"
    contactPerson = "Jane Doe"
    email = "jane@test.com"
    phone = "+91 9876543210"
    address = "456 PS Street"
    category = "Yarn"
    description = "Created via PowerShell"
    products = @("Product 1", "Product 2")
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/v1/companies" `
  -Method Post `
  -Headers $headers `
  -Body $body
```

## Monitoring Commands

### Watch Server Logs
```bash
# Run server with verbose logging
go run cmd/server/main.go 2>&1 | tee server.log
```

### Check Database Connection
```bash
# In Go code or separate test file
package main

import (
    "knitinfo-backend/pkg/database"
    "log"
)

func main() {
    db, err := database.NewSupabaseConnection()
    if err != nil {
        log.Fatal("Connection failed:", err)
    }
    defer db.Close()
    
    log.Println("Connection successful!")
}
```

## Useful Aliases (Optional)

Add to your shell profile:

### Bash/Zsh (.bashrc or .zshrc)
```bash
alias knitrun='cd ~/KnitInfo/KnitInfo_Backend && go run cmd/server/main.go'
alias knitbuild='cd ~/KnitInfo/KnitInfo_Backend && go build -o knitinfo-api cmd/server/main.go'
alias knittest='curl http://localhost:8080/health'
```

### PowerShell (Profile)
```powershell
function Start-KnitInfo {
    Set-Location "D:\Freelancing\KnitInfo\KnitInfo_Backend"
    go run cmd/server/main.go
}

function Test-KnitInfo {
    Invoke-RestMethod -Uri "http://localhost:8080/health"
}

Set-Alias knitrun Start-KnitInfo
Set-Alias knittest Test-KnitInfo
```

## Quick Reference

| Task | Command |
|------|---------|
| Start server | `go run cmd/server/main.go` |
| Install deps | `go mod tidy` |
| Build binary | `go build -o knitinfo-api cmd/server/main.go` |
| Test health | `curl http://localhost:8080/health` |
| Get companies | `curl http://localhost:8080/api/v1/companies` |
| Login | See "Admin Login" above |
| View logs | Check terminal output |
| Stop server | `Ctrl+C` |

---

**Pro Tip:** Keep this file open in a separate tab for quick reference! 📌
