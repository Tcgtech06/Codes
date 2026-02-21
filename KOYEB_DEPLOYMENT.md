# Deploy Backend to Koyeb

## Step-by-Step Guide

### Step 1: Sign Up for Koyeb

1. Go to https://www.koyeb.com
2. Click **"Sign Up"** or **"Get Started"**
3. Sign up with GitHub (recommended) or email
4. Verify your email if needed

### Step 2: Create New App

1. Click **"Create App"** or **"Deploy"**
2. Select **"GitHub"** as deployment method
3. Connect your GitHub account if not already connected
4. Authorize Koyeb to access your repositories

### Step 3: Configure Deployment

**Repository Settings:**
- Repository: `Tcgtech06/Codes`
- Branch: `frontend_development`
- Build method: `Dockerfile` (Koyeb will auto-detect)

**Service Settings:**
- Service name: `knitinfo-backend`
- Region: Choose closest to you (e.g., `Singapore` or `Frankfurt`)
- Instance type: `Nano` (free tier)

**Port Configuration:**
- Port: `8080`
- Protocol: `HTTP`

### Step 4: Add Environment Variables

Click **"Environment Variables"** and add these:

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

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait 3-5 minutes for build and deployment
3. Koyeb will:
   - Clone your repository
   - Build Docker image
   - Deploy the container
   - Assign a public URL

### Step 6: Get Your Backend URL

Once deployed, Koyeb will provide a URL like:
```
https://knitinfo-backend-your-org.koyeb.app
```

Copy this URL!

### Step 7: Test Backend

Open these URLs in your browser:

**Health Check:**
```
https://knitinfo-backend-your-org.koyeb.app/health
```
Should return: `{"status":"ok","service":"KnitInfo API"}`

**Categories:**
```
https://knitinfo-backend-your-org.koyeb.app/api/v1/categories
```
Should return: `{"categories":[...]}`

### Step 8: Update Frontend

1. Update `.env.local`:
```bash
NEXT_PUBLIC_API_URL=https://knitinfo-backend-your-org.koyeb.app/api/v1
ADMIN_PASSWORD=KnitInfo2024@Admin
```

2. Rebuild frontend:
```bash
npm run build
```

3. Deploy `out` folder to Netlify

---

## Why Koyeb Works Better

- ✅ Better IPv4/IPv6 handling than Railway
- ✅ Free tier with 2 services
- ✅ Automatic HTTPS
- ✅ Good network connectivity to Supabase
- ✅ Docker support
- ✅ Auto-deploy on GitHub push

---

## Troubleshooting

### Build Fails

Check build logs in Koyeb dashboard. Common issues:
- Missing Dockerfile (we added it)
- Go version mismatch (Dockerfile uses Go 1.21)
- Missing dependencies (go.mod should have all)

### Database Connection Fails

- Verify all environment variables are set
- Check Supabase credentials are correct
- Ensure no extra spaces or newlines in variables

### Service Won't Start

- Check logs for panic messages
- Verify PORT is set to 8080
- Ensure all required env vars are present

---

## Koyeb Free Tier

- 2 web services
- 512 MB RAM per service
- Shared CPU
- 2.5 GB disk
- 100 GB bandwidth/month

Perfect for your backend!

---

## Next Steps

1. ✅ Deploy backend to Koyeb
2. ✅ Get Koyeb URL
3. ✅ Update frontend `.env.local`
4. ✅ Build frontend: `npm run build`
5. ✅ Deploy `out` folder to Netlify
6. ✅ Test everything works!

---

## Your URLs After Deployment

**Backend (Koyeb):**
```
https://knitinfo-backend-your-org.koyeb.app
```

**Frontend (Netlify):**
```
https://your-site.netlify.app
```

**Database (Supabase):**
```
https://fykzllskgxgunjrdkopp.supabase.co
```

All three working together! 🚀
