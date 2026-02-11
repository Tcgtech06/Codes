# 🎓 Backend Configuration Guide for Beginners

## Table of Contents
1. [Understanding .env Files](#understanding-env-files)
2. [Getting Your Supabase Credentials](#getting-supabase-credentials)
3. [Creating Your .env File](#creating-your-env-file)
4. [Validating Backend Readiness](#validating-backend-readiness)
5. [What Requires npm vs What Doesn't](#npm-requirements)
6. [Next Steps](#next-steps)

---

## Understanding .env Files

### What is a .env file?
A `.env` file is a simple text file that stores **environment variables** - think of them as settings that your application needs to run.

### Why do we need it?
- Stores **sensitive information** (passwords, API keys)
- Keeps secrets **OUT of your code** (security best practice)
- Allows **different settings** for different environments (development, production)

### When is it needed?
- ✅ When **RUNNING** the application
- ✅ When **CONNECTING** to database
- ❌ NOT needed for viewing code
- ❌ NOT needed for checking file structure

---

## Getting Your Supabase Credentials

### Step 1: Login to Supabase
1. Go to https://supabase.com
2. Login to your account
3. Select your KnitInfo project

### Step 2: Get Database Connection String
1. Click **Settings** (gear icon in sidebar)
2. Click **Database**
3. Scroll to **Connection String** section
4. Select **URI** tab
5. Copy the connection string (looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghijk.supabase.co:5432/postgres
   ```
6. **IMPORTANT**: Replace `[YOUR-PASSWORD]` with your actual database password

### Step 3: Get API Keys
1. Click **Settings** (gear icon in sidebar)
2. Click **API**
3. You'll see:
   - **Project URL**: `https://abcdefghijk.supabase.co`
   - **anon public key**: Long string starting with `eyJ...`
   - **service_role key**: Another long string starting with `eyJ...`
4. Copy all three values

### Visual Guide:
```
Supabase Dashboard
├── Settings
│   ├── Database
│   │   └── Connection String (URI) ← Copy this
│   └── API
│       ├── Project URL ← Copy this
│       ├── anon public ← Copy this
│       └── service_role ← Copy this
```

---

## Creating Your .env File

### Method 1: Using the Template (Recommended)

1. **Locate the template file**:
   - File: `KnitInfo_Backend\.env.example`
   - This file was just created for you

2. **Copy and rename**:
   ```
   Copy: .env.example
   Paste as: .env
   ```

3. **Edit the .env file**:
   - Open `.env` in any text editor (Notepad, VS Code, etc.)
   - Replace placeholder values with your actual Supabase credentials

### Method 2: Create from Scratch

1. **Create new file**:
   - Location: `KnitInfo_Backend\.env`
   - Use Notepad or any text editor

2. **Copy this template**:
```env
PORT=8080

SUPABASE_DB_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here

JWT_SECRET=knitinfo-secret-key-2024

ADMIN_USERNAME=admin
ADMIN_PASSWORD=KnitInfo2024@Admin
```

3. **Replace these values**:
   - `YOUR_PASSWORD` → Your Supabase database password
   - `YOUR_PROJECT_REF` → Your project reference (from Supabase URL)
   - `your-anon-key-here` → Your anon public key
   - `your-service-role-key-here` → Your service role key

### Example of Filled .env:
```env
PORT=8080

SUPABASE_DB_URL=postgresql://postgres:MySecretPass123@db.abcdefghijk.supabase.co:5432/postgres
SUPABASE_URL=https://abcdefghijk.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

JWT_SECRET=knitinfo-secret-key-2024

ADMIN_USERNAME=admin
ADMIN_PASSWORD=KnitInfo2024@Admin
```

---

## Validating Backend Readiness

You can check if your backend is ready **WITHOUT running the server**!

### ✅ Checklist for Backend Readiness:

#### 1. Check Go Installation
```bash
go version
```
**Expected output**: `go version go1.21.x windows/amd64` (or similar)

#### 2. Check Project Structure
```bash
cd d:\Freelancing\KnitInfo\KnitInfo_Backend
dir
```
**Should see**:
- ✅ `cmd` folder
- ✅ `pkg` folder
- ✅ `go.mod` file
- ✅ `go.sum` file

#### 3. Check Dependencies
```bash
cd d:\Freelancing\KnitInfo\KnitInfo_Backend
go mod download
```
**Expected**: Downloads complete without errors

#### 4. Compile Check (No Errors)
```bash
cd d:\Freelancing\KnitInfo\KnitInfo_Backend
go build ./cmd/server/main.go
```
**Expected**: 
- ✅ No error messages
- ✅ Creates `main.exe` file

#### 5. Check .env File Exists
```bash
cd d:\Freelancing\KnitInfo\KnitInfo_Backend
dir .env
```
**Expected**: File exists (you just created it)

#### 6. Verify Database Connection (Optional)
This requires the server to run briefly, but you can test:
```bash
go run cmd/server/main.go
```
**Expected**:
- If .env is correct: Server starts on port 8080
- If .env is wrong: Error message about database connection
- Press `Ctrl+C` to stop

### 🎯 Backend is Ready When:
- ✅ Go is installed
- ✅ All files exist
- ✅ Code compiles without errors
- ✅ .env file is created with correct values
- ✅ Dependencies are downloaded

---

## npm Requirements

### What Requires npm/Node.js? ❌ (Backend)

**Your Go Backend does NOT need npm!**

| Task | Requires npm? | Why? |
|------|---------------|------|
| View backend code | ❌ No | Just viewing files |
| Create .env file | ❌ No | It's a text file |
| Compile Go code | ❌ No | Uses Go compiler |
| Run Go server | ❌ No | Uses Go runtime |
| Check database | ❌ No | Go connects directly |

### What Requires npm/Node.js? ✅ (Frontend)

**Your React Frontend DOES need npm!**

| Task | Requires npm? | Why? |
|------|---------------|------|
| Install React packages | ✅ Yes | npm installs dependencies |
| Run React dev server | ✅ Yes | npm runs the frontend |
| Build React for production | ✅ Yes | npm builds the app |
| View frontend code | ❌ No | Just viewing files |

### Summary:
```
Backend (Go)     → No npm needed ✅
Frontend (React) → npm required ✅
```

---

## Next Steps

### Phase 1: Backend Verification (Current Phase) ✅
- [x] Create Supabase project
- [x] Run SQL migration
- [x] Verify tables exist
- [x] Create .env file
- [ ] Test backend server runs

### Phase 2: Backend Testing (After .env is ready)
1. **Start the backend server**:
   ```bash
   cd d:\Freelancing\KnitInfo\KnitInfo_Backend
   go run cmd/server/main.go
   ```

2. **Test health endpoint**:
   - Open browser
   - Go to: `http://localhost:8080/health`
   - Should see: `{"status":"ok","service":"KnitInfo API"}`

3. **Test login**:
   - Use Postman or any API testing tool
   - POST to: `http://localhost:8080/api/v1/auth/login`
   - Body:
     ```json
     {
       "username": "admin",
       "password": "KnitInfo2024@Admin"
     }
     ```
   - Should receive a JWT token

### Phase 3: Frontend Setup (Requires npm)
1. **Install Node.js**:
   - Download from: https://nodejs.org
   - Install LTS version (Long Term Support)
   - Verify: `node --version` and `npm --version`

2. **Install frontend dependencies**:
   ```bash
   cd d:\Freelancing\KnitInfo\KnitInfo_Frontend
   npm install
   ```

3. **Run frontend**:
   ```bash
   npm run dev
   ```

### Phase 4: Excel Upload Feature Testing
1. **Ensure backend is running**
2. **Login to get JWT token**
3. **Test Excel parse endpoint**:
   - POST to: `http://localhost:8080/api/v1/excel/parse`
   - Header: `Authorization: Bearer YOUR_JWT_TOKEN`
   - Body: Form-data with file field
   - Upload your Excel file

---

## Quick Reference Commands

### Backend Commands (No npm needed):
```bash
# Navigate to backend
cd d:\Freelancing\KnitInfo\KnitInfo_Backend

# Check Go version
go version

# Download dependencies
go mod download

# Compile code
go build ./cmd/server/main.go

# Run server
go run cmd/server/main.go
```

### Frontend Commands (Requires npm):
```bash
# Navigate to frontend
cd d:\Freelancing\KnitInfo\KnitInfo_Frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

---

## Troubleshooting

### Problem: "SUPABASE_DB_URL not set"
**Solution**: Create .env file with correct database URL

### Problem: "Failed to connect to database"
**Solution**: 
1. Check database password in .env
2. Verify Supabase project is active
3. Check internet connection

### Problem: "go: command not found"
**Solution**: Install Go from https://go.dev/dl/

### Problem: "Port 8080 already in use"
**Solution**: 
1. Change PORT in .env to 8081
2. Or stop other application using port 8080

---

## Summary

### What You've Learned:
1. ✅ .env files store sensitive configuration
2. ✅ .env is NOT auto-generated (security reasons)
3. ✅ Backend (Go) doesn't need npm
4. ✅ Frontend (React) needs npm
5. ✅ How to get Supabase credentials
6. ✅ How to create .env file manually
7. ✅ How to verify backend readiness

### Current Status:
- ✅ Supabase project created
- ✅ Database schema created
- ✅ Backend code exists
- ✅ .env template created
- ⏳ Need to fill .env with your credentials
- ⏳ Need to test backend server

### Next Immediate Step:
**Fill in your .env file with actual Supabase credentials!**

---

## Need Help?

If you encounter any issues:
1. Check this guide first
2. Verify all credentials are correct
3. Ensure Go is installed
4. Check Supabase project is active
5. Review error messages carefully

Good luck! 🚀
