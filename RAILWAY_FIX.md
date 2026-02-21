# Railway Deployment Fix

## The Problem

Railway is failing to build because it's auto-detecting the wrong build configuration.

## The Solution

You need to manually configure the build settings in Railway.

---

## Step-by-Step Fix

### 1. In Railway Dashboard

After connecting your GitHub repo, **BEFORE deploying**:

1. Click on your service (keen-renewal)
2. Go to **Settings** tab
3. Scroll to **Build** section

### 2. Configure Build Settings

Set these values:

**Build Command:**
```bash
go build -o main cmd/server/main.go
```

**Start Command:**
```bash
./main
```

**Root Directory:** (leave empty or set to `/`)

**Watch Paths:** (leave default)

### 3. Set Environment Variables

Go to **Variables** tab and add:

```
SUPABASE_DB_URL=postgresql://postgres:Vg3ZHt8mnONSOCZY@db.fykzllskgxgunjrdkopp.supabase.co:5432/postgres
SUPABASE_URL=https://fykzllskgxgunjrdkopp.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5a3psbHNrZ3hndW5qcmRrb3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NTM0OTUsImV4cCI6MjA4NjEyOTQ5NX0.Zjf5Xj0Ah5gfnNA0uaOMzjwinF9ziuw5ek4mBmRm1iU
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5a3psbHNrZ3hndW5qcmRrb3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDU1MzQ5NSwiZXhwIjoyMDg2MTI5NDk1fQ.xJUvPxHfpRH91ZqszrlH7gblDVGDUHhq3-fFDbbREnA
JWT_SECRET=knitinfo-secret-key-2024
ADMIN_USERNAME=admin
ADMIN_PASSWORD=KnitInfo2024@Admin
PORT=8080
```

### 4. Redeploy

1. Go to **Deployments** tab
2. Click **Deploy** button (or it will auto-deploy after saving settings)
3. Wait for build to complete

---

## Alternative: Use Railway CLI

If the web interface doesn't work, you can use Railway CLI:

### Install Railway CLI

```bash
# Windows (PowerShell)
iwr https://railway.app/install.ps1 | iex

# Or download from: https://railway.app/cli
```

### Deploy via CLI

```bash
# Login to Railway
railway login

# Link to your project
railway link

# Set environment variables
railway variables set SUPABASE_DB_URL="postgresql://postgres:Vg3ZHt8mnONSOCZY@db.fykzllskgxgunjrdkopp.supabase.co:5432/postgres"
railway variables set SUPABASE_URL="https://fykzllskgxgunjrdkopp.supabase.co"
railway variables set SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5a3psbHNrZ3hndW5qcmRrb3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NTM0OTUsImV4cCI6MjA4NjEyOTQ5NX0.Zjf5Xj0Ah5gfnNA0uaOMzjwinF9ziuw5ek4mBmRm1iU"
railway variables set SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5a3psbHNrZ3hndW5qcmRrb3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDU1MzQ5NSwiZXhwIjoyMDg2MTI5NDk1fQ.xJUvPxHfpRH91ZqszrlH7gblDVGDUHhq3-fFDbbREnA"
railway variables set JWT_SECRET="knitinfo-secret-key-2024"
railway variables set ADMIN_USERNAME="admin"
railway variables set ADMIN_PASSWORD="KnitInfo2024@Admin"

# Deploy
railway up
```

---

## Verify Build Configuration Files

I've created these files to help Railway auto-detect:

1. **nixpacks.toml** - Nixpacks configuration
2. **railway.toml** - Railway configuration  
3. **Procfile** - Process file

These should be committed to your repo.

---

## Expected Build Output

When it works correctly, you should see:

```
✓ Initialization (00:02)
✓ Build - Build Image (00:45)
  - Installing Go 1.21
  - Running: go build -o main cmd/server/main.go
  - Build successful
✓ Deploy (00:05)
  - Starting ./main
  - Server listening on port 8080
```

---

## Troubleshooting

### Error: "failed to build an image"

**Solution**: Manually set build command in Railway Settings:
- Build Command: `go build -o main cmd/server/main.go`
- Start Command: `./main`

### Error: "go.mod not found"

**Solution**: Make sure Root Directory is set to `/` or empty in Railway Settings

### Error: "package not found"

**Solution**: Railway needs to run `go mod download` first. Update build command:
```bash
go mod download && go build -o main cmd/server/main.go
```

### Error: "port binding failed"

**Solution**: Railway automatically sets PORT environment variable. Your code already handles this with:
```go
port := os.Getenv("PORT")
if port == "" {
    port = "8080"
}
```

---

## Quick Fix Steps

1. ✅ Go to Railway Settings
2. ✅ Set Build Command: `go build -o main cmd/server/main.go`
3. ✅ Set Start Command: `./main`
4. ✅ Add all environment variables
5. ✅ Click Deploy
6. ✅ Wait 2-3 minutes
7. ✅ Check logs for "Server listening on port..."

---

## After Successful Deployment

1. Go to Settings → Networking
2. Click "Generate Domain"
3. Copy your Railway URL (e.g., `https://keen-renewal.up.railway.app`)
4. Test: `https://your-url.railway.app/api/v1/health`
5. Use this URL in your frontend `.env.local`

---

## Need More Help?

Check Railway logs:
1. Go to Deployments tab
2. Click on latest deployment
3. View build logs and runtime logs
4. Look for specific error messages

Common issues are usually:
- Missing environment variables
- Wrong build command
- Wrong start command
- Go version mismatch
