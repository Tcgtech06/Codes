# Supabase Setup Guide for KnitInfo Backend

## Prerequisites
- Go 1.21 or higher
- Supabase account (free tier works)
- Git

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in:
   - **Name**: knitinfo-backend
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
4. Wait for project to be created (~2 minutes)

## Step 2: Get Database Connection String

1. In your Supabase project dashboard, go to **Settings** → **Database**
2. Scroll down to **Connection string** section
3. Select **URI** tab
4. Copy the connection string (looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with your actual database password

## Step 3: Run Database Migration

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire content from `migrations/001_initial_schema.sql`
4. Paste it into the SQL editor
5. Click **Run** button
6. You should see "Success. No rows returned"

This creates all tables, indexes, and sample data.

## Step 4: Configure Environment Variables

1. Open `.env` file in the backend root directory
2. Update the following variables:

```env
PORT=8080

# Supabase Configuration
SUPABASE_DB_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key

# JWT Configuration
JWT_SECRET=knitinfo-secret-key-2024

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=KnitInfo2024@Admin
```

**To get your keys:**
- Go to **Settings** → **API**
- Copy **Project URL** → use as `SUPABASE_URL`
- Copy **anon public** key → use as `SUPABASE_ANON_KEY`
- Copy **service_role** key → use as `SUPABASE_SERVICE_KEY`

## Step 5: Install Dependencies

```bash
cd KnitInfo_Backend
go mod tidy
```

This will download:
- `github.com/jmoiron/sqlx` - SQL extensions
- `github.com/lib/pq` - PostgreSQL driver
- `github.com/google/uuid` - UUID generation
- Other existing dependencies

## Step 6: Replace Main File

Rename the current main.go and use the Supabase version:

```bash
# Backup old main
move cmd\server\main.go cmd\server\main_old.go

# Use Supabase version
move cmd\server\main_supabase.go cmd\server\main.go
```

Or manually replace the content of `cmd/server/main.go` with `cmd/server/main_supabase.go`

## Step 7: Run the Server

```bash
go run cmd/server/main.go
```

You should see:
```
   ____    __
  / __/___/ /  ___
 / _// __/ _ \/ _ \
/___/\__/_//_/\___/ v4.11.4
High performance, minimalist Go web framework
https://echo.labstack.com
____________________________________O/_______
                                    O\
⇨ http server started on [::]:8080
```

## Step 8: Test the API

### Test Health Check
```bash
curl http://localhost:8080/health
```

Expected response:
```json
{"service":"KnitInfo API","status":"ok"}
```

### Test Get Companies
```bash
curl http://localhost:8080/api/v1/companies
```

Should return the 2 sample companies.

### Test Admin Login
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"KnitInfo2024@Admin"}'
```

Should return a JWT token.

## Project Structure

```
KnitInfo_Backend/
├── cmd/
│   └── server/
│       └── main.go              # Main application entry
├── pkg/
│   ├── database/
│   │   └── supabase.go          # Database connection
│   ├── models/
│   │   └── models.go            # Data models
│   └── repository/
│       ├── company.go           # Company database operations
│       ├── priority.go          # Priority database operations
│       ├── submission.go        # Submission database operations
│       └── contact.go           # Contact database operations
├── migrations/
│   └── 001_initial_schema.sql   # Database schema
├── .env                         # Environment variables
├── go.mod                       # Go dependencies
└── README.md                    # API documentation
```

## Database Schema

### Tables Created:
1. **companies** - Business directory listings
2. **priorities** - Company ranking/priority system
3. **form_submissions** - User form submissions (add-data, advertise, collaborate)
4. **contact_messages** - Contact form messages

### Key Features:
- UUID primary keys
- Automatic timestamps (created_at, updated_at)
- Array support for products and attachments
- JSONB for flexible form data
- Indexes for performance
- Row Level Security (RLS) enabled

## API Endpoints

### Public Endpoints:
- `GET /health` - Health check
- `GET /api/v1/companies` - List companies
- `GET /api/v1/companies/:id` - Get company details
- `GET /api/v1/companies/search?q=query` - Search companies
- `GET /api/v1/companies/category/:category` - Companies by category
- `GET /api/v1/priorities` - List priorities
- `GET /api/v1/categories` - List categories with counts
- `POST /api/v1/submissions` - Submit form
- `POST /api/v1/contact` - Submit contact form
- `POST /api/v1/auth/login` - Admin login

### Protected Endpoints (require JWT):
- `POST /api/v1/companies` - Create company
- `PUT /api/v1/companies/:id` - Update company
- `DELETE /api/v1/companies/:id` - Delete company
- `POST /api/v1/priorities` - Create priority
- `PUT /api/v1/priorities/:id` - Update priority
- `DELETE /api/v1/priorities/:id` - Delete priority
- `GET /api/v1/submissions` - List submissions
- `PUT /api/v1/submissions/:id/status` - Update submission status
- `GET /api/v1/contacts` - List contact messages

## Troubleshooting

### Connection Error
If you get "failed to connect to database":
1. Check your `SUPABASE_DB_URL` is correct
2. Verify your database password
3. Ensure your IP is not blocked (Supabase allows all by default)

### Migration Errors
If migration fails:
1. Check SQL syntax in the editor
2. Run each section separately to identify issues
3. Check Supabase logs in dashboard

### Import Errors
If you get "package not found":
```bash
go mod tidy
go clean -modcache
go mod download
```

## Next Steps

1. **Connect Frontend**: Update your Next.js frontend to use `http://localhost:8080/api/v1`
2. **Deploy Backend**: Deploy to Railway, Render, or Fly.io
3. **Add File Upload**: Integrate Supabase Storage for images/documents
4. **Add Email**: Set up email notifications using Supabase Auth
5. **Add Analytics**: Track API usage and performance

## Security Notes

- Change `JWT_SECRET` in production
- Change `ADMIN_PASSWORD` in production
- Never commit `.env` file to git
- Use environment variables in production
- Enable RLS policies for admin operations
- Use HTTPS in production

## Support

For issues:
1. Check Supabase logs in dashboard
2. Check Go application logs
3. Verify environment variables
4. Test database connection separately

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Echo Framework](https://echo.labstack.com/guide/)
- [sqlx Documentation](http://jmoiron.github.io/sqlx/)
