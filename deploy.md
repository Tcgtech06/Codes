# Quick Deployment Guide

## Important: Frontend and Backend are Separate

Your project has TWO parts that must be deployed separately:
- **Frontend (Next.js)** → Deploy to Netlify
- **Backend (Go API)** → Deploy to Railway or Render

## Step 1: Deploy Backend First

### Option A: Railway (Recommended)
1. Go to https://railway.app
2. Sign up/login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect the Go application
6. Add environment variables from your `.env` file:
   - `SUPABASE_DB_URL`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`
   - `JWT_SECRET`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
7. Deploy and copy the backend URL (e.g., `https://your-app.railway.app`)

### Option B: Render
1. Go to https://render.com
2. Create a new "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Build Command: `go build -o main cmd/server/main.go`
   - Start Command: `./main`
5. Add the same environment variables as above
6. Deploy and copy the backend URL

## Step 2: Build Frontend

1. Create `.env.local` file with your backend URL:
```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api/v1
ADMIN_PASSWORD=KnitInfo2024@Admin
```

2. Build the frontend:
```bash
npm run build
```

This creates the `out` folder with static files.

## Step 3: Deploy Frontend to Netlify

### Option A: Drag & Drop (Easiest)
1. Go to https://app.netlify.com
2. Drag the `out` folder to the deploy area
3. Done! Your site is live

### Option B: Connect GitHub (Automatic Updates)
1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `out`
5. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = your Railway backend URL
6. Deploy

## Step 4: Test Everything

1. Visit your Netlify URL
2. Test the catalogue pages (should load companies from backend)
3. Test admin login and Excel upload
4. Verify data persists after backend restart

## Troubleshooting

**Backend not working?**
- Check Railway/Render logs for errors
- Verify Supabase credentials are correct
- Test backend directly: `https://your-backend-url.railway.app/api/v1/health`

**Frontend can't connect to backend?**
- Check `NEXT_PUBLIC_API_URL` in Netlify environment variables
- Rebuild frontend after changing environment variables
- Check browser console for CORS errors

**Data not persisting?**
- Verify Supabase connection in backend logs
- Check database tables exist (run migrations)
- Test Supabase connection directly

## Important Notes

- **DO NOT** upload `.next` folder to Netlify - use `out` folder
- **DO NOT** try to run Go backend on Netlify - it only hosts static files
- Backend URL must include `/api/v1` at the end
- Rebuild frontend whenever you change `NEXT_PUBLIC_API_URL`
- Backend and frontend can be on different domains (CORS is configured)
