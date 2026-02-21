# Netlify Deployment Guide - Fix Catalogue Issue

## Problem
The catalogue page is not displaying because of CORS (Cross-Origin Resource Sharing) errors. The frontend deployed on Netlify cannot access the backend API due to CORS restrictions.

## Solution Overview
1. Deploy the Go backend to a hosting service (Railway, Render, or Koyeb)
2. Configure CORS in the backend to allow your Netlify domain
3. Set the correct environment variables in Netlify

## Step 1: Deploy the Backend

### Option A: Deploy to Railway (Recommended)

1. Go to [Railway.app](https://railway.app) and sign in with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository: `Tcgtech06/Codes`
4. Select the `frontend_development` branch
5. Railway will auto-detect the Go application

6. Add these environment variables in Railway:
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

7. After deployment, copy your Railway backend URL (e.g., `https://your-app.railway.app`)

### Option B: Deploy to Render

1. Go to [Render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Name: knitinfo-backend
   - Environment: Go
   - Build Command: `go build -o main cmd/server/main.go`
   - Start Command: `./main`
5. Add the same environment variables as above
6. Copy your Render backend URL

## Step 2: Update Netlify Configuration

1. Go to your Netlify dashboard
2. Select your site: `fancy-pastelito-179dc0`
3. Go to "Site configuration" → "Environment variables"
4. Add/Update this variable:
   ```
   NEXT_PUBLIC_API_URL = https://your-backend-url.railway.app/api/v1
   ```
   Replace `your-backend-url.railway.app` with your actual backend URL

5. Go to "Deploys" and click "Trigger deploy" → "Clear cache and deploy site"

## Step 3: Update Backend CORS (Already Fixed)

The backend code has been updated to properly handle CORS. The changes include:
- Explicit allowed origins (no wildcards)
- Support for custom frontend URL via `FRONTEND_URL` environment variable
- Proper CORS headers including Authorization

## Step 4: Verify Deployment

1. Wait for both deployments to complete
2. Visit your Netlify site: `https://fancy-pastelito-179dc0.netlify.app/catalogue`
3. Open browser DevTools (F12) → Console tab
4. Check for any errors

### Expected Behavior
- No CORS errors in console
- Categories should load and display
- Companies should be visible in each category

## Troubleshooting

### If catalogue still doesn't load:

1. **Check Backend Health**
   - Visit: `https://your-backend-url.railway.app/health`
   - Should return: `{"status":"ok","service":"KnitInfo API"}`

2. **Check Categories Endpoint**
   - Visit: `https://your-backend-url.railway.app/api/v1/categories`
   - Should return JSON array of categories

3. **Check CORS Headers**
   - Open DevTools → Network tab
   - Reload the catalogue page
   - Click on the failed request
   - Check "Response Headers" for `Access-Control-Allow-Origin`

4. **Verify Environment Variables**
   - In Netlify: Check `NEXT_PUBLIC_API_URL` is set correctly
   - In Railway: Check `FRONTEND_URL` matches your Netlify URL exactly

5. **Check Backend Logs**
   - In Railway: Go to your service → "Logs" tab
   - Look for any errors or CORS-related messages

## Quick Fix Commands

If you need to redeploy:

```bash
# Trigger Netlify rebuild
# Go to Netlify Dashboard → Deploys → Trigger deploy

# Or using Netlify CLI
netlify deploy --prod
```

## Important Notes

1. **HTTPS Only**: Both frontend and backend must use HTTPS in production
2. **Exact URL Match**: The `FRONTEND_URL` in backend must exactly match your Netlify URL
3. **No Trailing Slash**: Don't add trailing slashes to URLs
4. **Environment Variables**: Changes to env vars require redeployment

## Current Configuration

- Frontend: `https://fancy-pastelito-179dc0.netlify.app`
- Backend: (To be deployed)
- Database: Supabase (already configured)

## Next Steps

1. Deploy backend to Railway/Render
2. Get backend URL
3. Update `NEXT_PUBLIC_API_URL` in Netlify
4. Update `FRONTEND_URL` in Railway/Render
5. Redeploy both services
6. Test the catalogue page

## Support

If issues persist:
1. Check browser console for specific error messages
2. Check backend logs for incoming requests
3. Verify all environment variables are set correctly
4. Ensure database migrations have run successfully
