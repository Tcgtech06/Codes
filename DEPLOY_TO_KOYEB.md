# 🚀 Deploy to Koyeb - Quick Guide

## Why Koyeb?

Railway has IPv6 issues with Supabase. Koyeb handles this better and is just as easy!

---

## Quick Steps (10 minutes)

### 1. Go to Koyeb
https://www.koyeb.com → Sign up with GitHub

### 2. Create App
- Click **"Create App"**
- Select **GitHub**
- Choose: `Tcgtech06/Codes`
- Branch: `frontend_development`

### 3. Configure
- Service name: `knitinfo-backend`
- Build: Dockerfile (auto-detected)
- Port: `8080`
- Region: Singapore or closest to you

### 4. Add Environment Variables

Copy-paste these (one by one):

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

### 5. Deploy
Click **"Deploy"** → Wait 3-5 minutes

### 6. Get URL
Copy your Koyeb URL (e.g., `https://knitinfo-backend-xyz.koyeb.app`)

### 7. Test
Open: `https://your-url.koyeb.app/health`

Should see: `{"status":"ok","service":"KnitInfo API"}`

---

## Then Deploy Frontend

### 1. Update .env.local
```bash
NEXT_PUBLIC_API_URL=https://your-koyeb-url.koyeb.app/api/v1
ADMIN_PASSWORD=KnitInfo2024@Admin
```

### 2. Build
```bash
npm run build
```

### 3. Deploy to Netlify
Drag `out` folder to https://app.netlify.com

---

## Done! 🎉

Your app is now live:
- Backend on Koyeb
- Frontend on Netlify
- Database on Supabase

---

## Need Help?

See `KOYEB_DEPLOYMENT.md` for detailed instructions.
