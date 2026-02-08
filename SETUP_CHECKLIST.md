# Setup Checklist - KnitInfo Backend with Supabase

## ✅ Pre-Setup

- [ ] Go 1.21+ installed (`go version`)
- [ ] Git installed
- [ ] Text editor/IDE ready (VS Code recommended)
- [ ] Terminal/Command Prompt open
- [ ] Internet connection active

## ✅ Supabase Setup

- [ ] Created account at https://supabase.com
- [ ] Created new project named "knitinfo-backend"
- [ ] Saved database password securely
- [ ] Project fully initialized (wait ~2 minutes)
- [ ] Opened SQL Editor in Supabase dashboard
- [ ] Copied content from `migrations/001_initial_schema.sql`
- [ ] Pasted into SQL Editor
- [ ] Clicked "Run" button
- [ ] Verified "Success. No rows returned" message
- [ ] Checked Tables section - should see 4 tables:
  - [ ] companies
  - [ ] priorities
  - [ ] form_submissions
  - [ ] contact_messages

## ✅ Get Supabase Credentials

- [ ] Opened Settings → Database
- [ ] Copied Connection String (URI format)
- [ ] Replaced `[YOUR-PASSWORD]` with actual password
- [ ] Opened Settings → API
- [ ] Copied Project URL
- [ ] Copied anon public key
- [ ] Copied service_role key

## ✅ Configure Backend

- [ ] Opened `.env` file in backend root
- [ ] Updated `SUPABASE_DB_URL` with connection string
- [ ] Updated `SUPABASE_URL` with project URL
- [ ] Updated `SUPABASE_ANON_KEY` with anon key
- [ ] Updated `SUPABASE_SERVICE_KEY` with service key
- [ ] Changed `ADMIN_PASSWORD` (recommended)
- [ ] Saved `.env` file

## ✅ Install Dependencies

- [ ] Opened terminal in `KnitInfo_Backend` directory
- [ ] Ran `go mod tidy`
- [ ] Verified no errors
- [ ] Checked new dependencies downloaded:
  - [ ] github.com/jmoiron/sqlx
  - [ ] github.com/lib/pq
  - [ ] github.com/google/uuid

## ✅ Update Main File

Choose ONE option:

### Option A: Rename Files (Recommended)
- [ ] Renamed `cmd/server/main.go` to `cmd/server/main_old.go`
- [ ] Renamed `cmd/server/main_supabase.go` to `cmd/server/main.go`

### Option B: Replace Content
- [ ] Opened `cmd/server/main.go`
- [ ] Deleted all content
- [ ] Copied content from `cmd/server/main_supabase.go`
- [ ] Pasted into `cmd/server/main.go`
- [ ] Saved file

## ✅ First Run

- [ ] Opened terminal in `KnitInfo_Backend` directory
- [ ] Ran `go run cmd/server/main.go`
- [ ] Verified server started message:
  ```
  ⇨ http server started on [::]:8080
  ```
- [ ] No error messages appeared
- [ ] Server is running (don't close terminal)

## ✅ Test API

Open a NEW terminal/command prompt:

### Test 1: Health Check
- [ ] Ran: `curl http://localhost:8080/health`
- [ ] Got response: `{"service":"KnitInfo API","status":"ok"}`

### Test 2: Get Companies
- [ ] Ran: `curl http://localhost:8080/api/v1/companies`
- [ ] Got JSON response with 2 sample companies
- [ ] Companies have UUID ids (long strings)

### Test 3: Get Categories
- [ ] Ran: `curl http://localhost:8080/api/v1/categories`
- [ ] Got list of 10 categories with counts

### Test 4: Admin Login
- [ ] Ran login command (see API_TESTING.md)
- [ ] Got JWT token in response
- [ ] Copied token for next test

### Test 5: Protected Endpoint
- [ ] Used token to access protected endpoint
- [ ] Got successful response (not 401 error)

## ✅ Verify Database

- [ ] Opened Supabase dashboard
- [ ] Went to Table Editor
- [ ] Clicked on "companies" table
- [ ] Saw 2 sample companies
- [ ] Data looks correct

## ✅ Documentation Review

- [ ] Read QUICKSTART.md
- [ ] Read SUPABASE_SETUP.md (at least skimmed)
- [ ] Bookmarked API_TESTING.md for reference
- [ ] Reviewed ARCHITECTURE.md (optional but helpful)

## ✅ Next Steps

- [ ] Tested all API endpoints (use Postman or curl)
- [ ] Created a few test companies
- [ ] Verified data persists after server restart
- [ ] Updated frontend to use new API URL
- [ ] Tested frontend with backend
- [ ] Changed default admin password
- [ ] Committed code to git (excluding .env)

## ✅ Production Preparation (Later)

- [ ] Changed JWT_SECRET to strong random string
- [ ] Changed ADMIN_PASSWORD to strong password
- [ ] Set up proper RLS policies in Supabase
- [ ] Configured CORS for production domain
- [ ] Set up environment variables in hosting platform
- [ ] Tested with production Supabase project
- [ ] Set up monitoring/logging
- [ ] Configured backups
- [ ] Set up CI/CD pipeline
- [ ] Load tested API

## 🆘 Troubleshooting

### Can't connect to database?
- [ ] Checked SUPABASE_DB_URL is correct
- [ ] Verified password has no typos
- [ ] Confirmed migration ran successfully
- [ ] Checked Supabase project is active

### Import errors?
- [ ] Ran `go mod tidy` again
- [ ] Ran `go clean -modcache`
- [ ] Ran `go mod download`
- [ ] Checked Go version is 1.21+

### Server won't start?
- [ ] Checked port 8080 is not in use
- [ ] Verified .env file exists
- [ ] Checked for syntax errors in main.go
- [ ] Reviewed error messages carefully

### API returns errors?
- [ ] Checked server logs in terminal
- [ ] Verified request format is correct
- [ ] Confirmed JWT token is valid (for protected routes)
- [ ] Checked Supabase dashboard logs

## 📝 Notes

Write any issues or observations here:

```
Date: ___________

Issues encountered:


Solutions found:


Additional notes:


```

## ✨ Success Criteria

You're done when:
- ✅ Server starts without errors
- ✅ Health check returns OK
- ✅ Can get companies list
- ✅ Can login as admin
- ✅ Can create a company with JWT
- ✅ Data persists in Supabase
- ✅ Frontend can connect to API

---

**Congratulations!** 🎉 Your backend is now running with Supabase!

Next: Connect your frontend and start building features!
