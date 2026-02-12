# Next Steps - Your Backend is Deployed! 🎉

## Your Railway URL
```
https://codes-production-f14d.up.railway.app
```

---

## Issue: Backend Returns 502 Error

The backend is deployed but not responding. This usually means:
1. Environment variables are missing
2. Database connection failed
3. App crashed on startup

---

## Fix: Add Environment Variables in Railway

### Step 1: Go to Railway Dashboard

1. Open https://railway.app
2. Go to your project: **keen-renewal** or **codes-production**
3. Click on your service

### Step 2: Add Variables

Click **Variables** tab and add these:

```bash
SUPABASE_DB_URL=postgresql://postgres:Vg3ZHt8mnONSOCZY@db.fykzllskgxgunjrdkopp.supabase.co:5432/postgres

SUPABASE_URL=https://fykzllskgxgunjrdkopp.supabase.co

SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5a3psbHNrZ3hndW5qcmRrb3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NTM0OTUsImV4cCI6MjA4NjEyOTQ5NX0.Zjf5Xj0Ah5gfnNA0uaOMzjwinF9ziuw5ek4mBmRm1iU

SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5a3psbHNrZ3hndW5qcmRrb3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDU1MzQ5NSwiZXhwIjoyMDg2MTI5NDk1fQ.xJUvPxHfpRH91ZqszrlH7gblDVGDUHhq3-fFDbbREnA

JWT_SECRET=knitinfo-secret-key-2024

ADMIN_USERNAME=admin

ADMIN_PASSWORD=KnitInfo2024@Admin
```

### Step 3: Check Logs

1. Go to **Deployments** tab
2. Click on latest deployment
3. Look for errors in logs

Common errors:
- "Failed to connect to database" → Check SUPABASE_DB_URL
- "Port already in use" → Railway handles this automatically
- "panic" → Check all environment variables are set

### Step 4: Redeploy

After adding variables:
1. Railway will auto-redeploy
2. Wait 2-3 minutes
3. Check logs again

---

## Test Backend is Working

Once logs show "Server listening on port...", test these URLs in your browser:

### Health Check
```
https://codes-production-f14d.up.railway.app/health
```
Should return: `{"status":"ok","service":"KnitInfo API"}`

### Categories
```
https://codes-production-f14d.up.railway.app/api/v1/categories
```
Should return: `{"categories":[...]}`

### Companies
```
https://codes-production-f14d.up.railway.app/api/v1/companies
```
Should return: `{"companies":[...]}`

---

## Once Backend is Working

### Step 1: Build Frontend

I've already created `.env.local` with your Railway URL:
```bash
NEXT_PUBLIC_API_URL=https://codes-production-f14d.up.railway.app/api/v1
ADMIN_PASSWORD=KnitInfo2024@Admin
```

Build the frontend:
```bash
npm run build
```

This creates the `out` folder.

### Step 2: Deploy to Netlify

**Option A: Drag & Drop (Easiest)**
1. Go to https://app.netlify.com
2. Drag the `out` folder to deploy
3. Done!

**Option B: Connect GitHub**
1. Go to https://app.netlify.com
2. New site → Import from Git
3. Select: Tcgtech06/Codes
4. Branch: frontend_development
5. Build command: `npm run build`
6. Publish directory: `out`
7. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = `https://codes-production-f14d.up.railway.app/api/v1`
8. Deploy

### Step 3: Test Everything

1. Visit your Netlify URL
2. Check catalogue pages load
3. Test admin login
4. Upload Excel file
5. Verify data appears

---

## Quick Checklist

```
□ Add environment variables in Railway
□ Check Railway logs for "Server listening"
□ Test backend health endpoint
□ Build frontend with npm run build
□ Deploy out folder to Netlify
□ Test full application
```

---

## Troubleshooting

### Backend Still Returns 502

1. Check Railway logs for specific error
2. Verify all environment variables are set
3. Test Supabase connection directly
4. Check if database tables exist (run migrations)

### Frontend Can't Connect

1. Verify `NEXT_PUBLIC_API_URL` in `.env.local`
2. Rebuild: `npm run build`
3. Check browser console for CORS errors
4. Verify backend is responding to health check

### Database Errors

1. Check Supabase dashboard
2. Verify database is active
3. Run migrations if tables don't exist
4. Check connection string is correct

---

## Railway Logs Location

1. Railway Dashboard
2. Your project
3. Deployments tab
4. Click latest deployment
5. View logs

Look for:
- ✅ "Server listening on port 8080" (or other port)
- ❌ "Failed to connect to database"
- ❌ "panic: ..."
- ❌ "Error: ..."

---

## Need Help?

1. Check Railway logs first
2. Verify environment variables
3. Test backend endpoints
4. Check browser console
5. Review error messages

---

## Summary

**Current Status:**
- ✅ Backend deployed to Railway
- ✅ Frontend code ready
- ⏳ Need to add environment variables
- ⏳ Need to deploy frontend to Netlify

**Next Action:**
1. Add environment variables in Railway
2. Wait for successful deployment
3. Test backend endpoints
4. Build and deploy frontend
