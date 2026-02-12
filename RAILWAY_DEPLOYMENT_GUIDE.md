# Railway Backend Deployment Guide

## Step-by-Step Guide to Deploy Your Go Backend on Railway

### Prerequisites
- GitHub account (you already have: Tcgtech06)
- GitHub repository: https://github.com/Tcgtech06/Codes
- Supabase credentials (from your .env file)

---

## Step 1: Sign Up for Railway

1. Go to https://railway.app
2. Click "Login" or "Start a New Project"
3. Sign in with your GitHub account (Tcgtech06)
4. Authorize Railway to access your GitHub repositories

---

## Step 2: Create New Project from GitHub

1. Click "New Project" button
2. Select "Deploy from GitHub repo"
3. You'll see a list of your repositories
4. Find and select: **Tcgtech06/Codes**
5. Railway will ask which branch to deploy
6. Select: **frontend_development** (this has all the merged code)

---

## Step 3: Railway Auto-Detection

Railway will automatically:
- Detect that it's a Go project (from `go.mod`)
- Set build command: `go build -o main cmd/server/main.go`
- Set start command: `./main`
- Assign a port (Railway provides PORT environment variable)

If it doesn't auto-detect, you can manually configure:
- **Build Command**: `go build -o main cmd/server/main.go`
- **Start Command**: `./main`

---

## Step 4: Add Environment Variables

Click on your project → Go to "Variables" tab → Add these variables:

```bash
# Database Connection
SUPABASE_DB_URL=postgresql://postgres:Vg3ZHt8mnONSOCZY@db.fykzllskgxgunjrdkopp.supabase.co:5432/postgres

# Supabase Configuration
SUPABASE_URL=https://fykzllskgxgunjrdkopp.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5a3psbHNrZ3hndW5qcmRrb3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NTM0OTUsImV4cCI6MjA4NjEyOTQ5NX0.Zjf5Xj0Ah5gfnNA0uaOMzjwinF9ziuw5ek4mBmRm1iU
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5a3psbHNrZ3hndW5qcmRrb3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDU1MzQ5NSwiZXhwIjoyMDg2MTI5NDk1fQ.xJUvPxHfpRH91ZqszrlH7gblDVGDUHhq3-fFDbbREnA

# JWT Secret
JWT_SECRET=knitinfo-secret-key-2024

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=KnitInfo2024@Admin

# Port (Railway provides this automatically, but you can set default)
PORT=8080
```

**Important**: Copy these EXACTLY as shown above (from your .env file)

---

## Step 5: Deploy

1. After adding environment variables, click "Deploy"
2. Railway will:
   - Clone your repository
   - Install Go dependencies
   - Build your application
   - Start the server
3. Wait 2-3 minutes for deployment to complete

---

## Step 6: Get Your Backend URL

1. Once deployed, go to "Settings" tab
2. Scroll to "Domains" section
3. Click "Generate Domain"
4. Railway will give you a URL like: `https://your-app-name.up.railway.app`
5. **Copy this URL** - you'll need it for frontend configuration

---

## Step 7: Test Your Backend

Test if backend is working:

```bash
# Health check (replace with your Railway URL)
https://your-app-name.up.railway.app/api/v1/health

# Test categories endpoint
https://your-app-name.up.railway.app/api/v1/categories
```

You should see JSON responses if everything is working.

---

## Step 8: Update Frontend Configuration

Now that backend is deployed, update your frontend:

1. **Local Development** - Create/update `.env.local`:
```bash
NEXT_PUBLIC_API_URL=https://your-app-name.up.railway.app/api/v1
ADMIN_PASSWORD=KnitInfo2024@Admin
```

2. **Build Frontend**:
```bash
npm run build
```

3. **Deploy to Netlify**:
   - Upload the `out` folder to Netlify
   - OR set environment variable in Netlify:
     - Key: `NEXT_PUBLIC_API_URL`
     - Value: `https://your-app-name.up.railway.app/api/v1`

---

## Step 9: Verify Everything Works

1. Visit your Netlify site
2. Go to Catalogue page
3. Click on any category (Yarn, Fabric, etc.)
4. Go to Admin Dashboard
5. Upload an Excel file
6. Check if data appears in the catalogue

---

## Troubleshooting

### Backend Not Starting?

Check Railway logs:
1. Go to your Railway project
2. Click "Deployments" tab
3. Click on the latest deployment
4. View logs for errors

Common issues:
- Missing environment variables
- Wrong Supabase credentials
- Port binding issues (Railway handles this automatically)

### Database Connection Failed?

- Verify `SUPABASE_DB_URL` is correct
- Check Supabase dashboard to ensure database is active
- Test connection from Railway logs

### CORS Errors?

Your backend already has CORS configured for:
- `http://localhost:3000` (local development)
- `https://*.netlify.app` (Netlify deployments)
- `https://*.netlify.com` (Netlify deployments)

If you use a custom domain, add it to CORS in `cmd/server/main.go`

---

## Railway Features You Should Know

### Automatic Deployments
- Every push to `frontend_development` branch triggers auto-deploy
- You can disable this in Settings if needed

### View Logs
- Real-time logs available in "Deployments" tab
- Useful for debugging

### Metrics
- CPU, Memory, Network usage
- Available in "Metrics" tab

### Pricing
- Free tier: $5 credit per month
- Enough for small projects
- Upgrade if you need more resources

---

## Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `SUPABASE_DB_URL` | Database connection string | `postgresql://...` |
| `SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Public API key | `eyJhbGc...` |
| `SUPABASE_SERVICE_KEY` | Admin API key | `eyJhbGc...` |
| `JWT_SECRET` | Token signing key | `knitinfo-secret-key-2024` |
| `ADMIN_USERNAME` | Admin login username | `admin` |
| `ADMIN_PASSWORD` | Admin login password | `KnitInfo2024@Admin` |
| `PORT` | Server port | `8080` (Railway sets this) |

---

## Quick Commands Summary

```bash
# 1. Push code to GitHub (already done)
git push origin frontend_development

# 2. Deploy on Railway (via web interface)
# - Connect GitHub repo
# - Select frontend_development branch
# - Add environment variables
# - Deploy

# 3. Get Railway URL
# - Copy from Railway dashboard

# 4. Update frontend
echo "NEXT_PUBLIC_API_URL=https://your-app.railway.app/api/v1" > .env.local
npm run build

# 5. Deploy frontend to Netlify
# - Upload 'out' folder
```

---

## Next Steps After Deployment

1. ✅ Backend deployed on Railway
2. ✅ Frontend built with Railway URL
3. ✅ Frontend deployed on Netlify
4. ✅ Test all features
5. 🎉 Your app is live!

---

## Support

If you encounter issues:
1. Check Railway logs
2. Check browser console for errors
3. Verify environment variables
4. Test backend endpoints directly
5. Check Supabase connection

---

## Your Deployment URLs

After deployment, you'll have:
- **Backend**: `https://your-app-name.up.railway.app`
- **Frontend**: `https://your-site-name.netlify.app`
- **Database**: Supabase (already configured)

Both will work together seamlessly! 🚀
