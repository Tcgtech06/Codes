# Quick Start - KnitInfo Backend with Supabase

## 🚀 5-Minute Setup

### 1. Create Supabase Project
- Go to https://supabase.com → New Project
- Save your database password!

### 2. Run Database Migration
- Supabase Dashboard → SQL Editor → New Query
- Copy/paste from `migrations/001_initial_schema.sql`
- Click Run

### 3. Get Connection String
- Settings → Database → Connection String (URI)
- Copy the full URL

### 4. Update .env
```env
SUPABASE_DB_URL=postgresql://postgres:YOUR_PASSWORD@db.xxx.supabase.co:5432/postgres
```

### 5. Install & Run
```bash
go mod tidy
go run cmd/server/main.go
```

### 6. Test
```bash
curl http://localhost:8080/health
curl http://localhost:8080/api/v1/companies
```

## ✅ What You Get

- ✅ Full REST API with Supabase PostgreSQL
- ✅ JWT Authentication
- ✅ Company management (CRUD)
- ✅ Priority system
- ✅ Form submissions
- ✅ Contact messages
- ✅ Search & filtering
- ✅ Sample data included

## 📁 Key Files

- `cmd/server/main.go` - Main application
- `pkg/repository/*.go` - Database operations
- `migrations/001_initial_schema.sql` - Database schema
- `.env` - Configuration

## 🔑 Default Admin Login

```json
{
  "username": "admin",
  "password": "KnitInfo2024@Admin"
}
```

**Change this in production!**

## 📚 Full Documentation

See `SUPABASE_SETUP.md` for detailed instructions.

## 🆘 Common Issues

**Can't connect to database?**
- Check SUPABASE_DB_URL in .env
- Verify password is correct
- Run migration first

**Import errors?**
```bash
go mod tidy
```

**Port already in use?**
Change PORT in .env file

## 🎯 Next Steps

1. Test all endpoints with Postman
2. Connect your frontend
3. Customize admin credentials
4. Deploy to production
