# Quick Fix Checklist for Catalogue Not Displaying

## ✅ What I've Fixed in the Code

1. **CORS Configuration** - Updated `cmd/server/main.go` to properly handle CORS
   - Removed wildcard patterns that don't work
   - Added explicit origin support
   - Added `FRONTEND_URL` environment variable support

2. **Netlify Configuration** - Updated `netlify.toml` with better settings

## 🚀 What You Need to Do Now

### Step 1: Deploy Backend (Choose One)

#### Option A: Railway (Easiest)
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select: `Tcgtech06/Codes` repo, `frontend_development` branch
4. Add environment variables (copy from `.env` file + add `FRONTEND_URL`)
5. Copy the deployed URL (e.g., `https://knitinfo-production.up.railway.app`)

#### Option B: Render
1. Go to https://render.com
2. New Web Service → Connect GitHub
3. Build: `go build -o main cmd/server/main.go`
4. Start: `./main`
5. Add environment variables
6. Copy the deployed URL

### Step 2: Configure Netlify

1. Go to Netlify Dashboard → Your Site
2. Site configuration → Environment variables
3. Add/Update:
   ```
   Key: NEXT_PUBLIC_API_URL
   Value: https://YOUR-BACKEND-URL/api/v1
   ```
4. Deploys → Trigger deploy → Clear cache and deploy

### Step 3: Update Backend Environment

1. In Railway/Render, add this environment variable:
   ```
   Key: FRONTEND_URL
   Value: https://fancy-pastelito-179dc0.netlify.app
   ```
2. Redeploy the backend

### Step 4: Test

1. Visit: `https://fancy-pastelito-179dc0.netlify.app/catalogue`
2. Open DevTools (F12) → Console
3. Should see NO CORS errors
4. Categories should load

## 🔍 Quick Tests

Test these URLs after deployment:

1. **Backend Health Check**
   ```
   https://YOUR-BACKEND-URL/health
   ```
   Expected: `{"status":"ok","service":"KnitInfo API"}`

2. **Categories API**
   ```
   https://YOUR-BACKEND-URL/api/v1/categories
   ```
   Expected: JSON array of categories

3. **Frontend Catalogue**
   ```
   https://fancy-pastelito-179dc0.netlify.app/catalogue
   ```
   Expected: Categories displayed, no console errors

## 📋 Environment Variables Needed

### Backend (Railway/Render)
```
PORT=8080
SUPABASE_DB_URL=postgresql://postgres:Vg3ZHt8mnONSOCZY@db.fykzllskgxgunjrdkopp.supabase.co:5432/postgres
SUPABASE_URL=https://fykzllskgxgunjrdkopp.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5a3psbHNrZ3hndW5qcmRrb3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NTM0OTUsImV4cCI6MjA4NjEyOTQ5NX0.Zjf5Xj0Ah5gfnNA0uaOMzjwinF9ziuw5ek4mBmRm1iU
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5a3psbHNrZ3hndW5qcmRrb3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDU1MzQ5NSwiZXhwIjoyMDg2MTI5NDk1fQ.xJUvPxHfpRH91ZqszrlH7gblDVGDUHhq3-fFDbbREnA
JWT_SECRET=knitinfo-secret-key-2024
ADMIN_USERNAME=admin
ADMIN_PASSWORD=KnitInfo2024@Admin
FRONTEND_URL=https://fancy-pastelito-179dc0.netlify.app
```

### Frontend (Netlify)
```
NEXT_PUBLIC_API_URL=https://YOUR-BACKEND-URL/api/v1
```

## ⚠️ Common Mistakes to Avoid

1. ❌ Don't add trailing slashes to URLs
2. ❌ Don't forget to redeploy after changing environment variables
3. ❌ Don't use HTTP in production (must be HTTPS)
4. ❌ Don't forget to clear cache when redeploying Netlify

## 🎯 The Root Cause

The issue was:
1. **CORS Misconfiguration**: The wildcard pattern `https://*.netlify.app` doesn't work in Go's Echo framework
2. **Missing Backend URL**: Frontend needs to know where the backend is deployed
3. **Missing Frontend URL**: Backend needs to know which domain to allow

## 💡 Why This Fix Works

1. Backend explicitly allows your Netlify domain
2. Frontend knows the correct backend API URL
3. CORS headers are properly configured
4. Both services can communicate securely over HTTPS

## 📞 Still Having Issues?

Check:
1. Browser console for specific error messages
2. Backend logs in Railway/Render dashboard
3. Network tab in DevTools to see failed requests
4. Verify all URLs are HTTPS (not HTTP)
5. Ensure no typos in environment variable names
