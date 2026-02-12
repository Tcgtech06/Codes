# Deployment Checklist ✅

## Current Status

✅ **Code Merged**: Frontend + Backend merged in `frontend_development` branch
✅ **Pushed to GitHub**: All code pushed to https://github.com/Tcgtech06/Codes
✅ **Build Tested**: `npm run build` creates `out` folder successfully
✅ **Static Export**: Next.js configured for static export
✅ **Supabase Ready**: Database credentials configured

---

## What You Need to Do Now

### 1. Deploy Backend to Railway (15 minutes)

```
□ Go to https://railway.app
□ Sign in with GitHub (Tcgtech06)
□ Click "New Project" → "Deploy from GitHub repo"
□ Select repository: Tcgtech06/Codes
□ Select branch: frontend_development
□ Add environment variables (copy from .env file):
  □ SUPABASE_DB_URL
  □ SUPABASE_URL
  □ SUPABASE_ANON_KEY
  □ SUPABASE_SERVICE_KEY
  □ JWT_SECRET
  □ ADMIN_USERNAME
  □ ADMIN_PASSWORD
□ Click "Deploy"
□ Wait for deployment to complete
□ Generate domain in Settings
□ Copy Railway URL (e.g., https://your-app.railway.app)
```

**Detailed Guide**: See `RAILWAY_DEPLOYMENT_GUIDE.md`

---

### 2. Build Frontend with Railway URL (5 minutes)

```bash
# Create .env.local file
echo "NEXT_PUBLIC_API_URL=https://your-app.railway.app/api/v1" > .env.local
echo "ADMIN_PASSWORD=KnitInfo2024@Admin" >> .env.local

# Build frontend
npm run build
```

This creates the `out` folder with your Railway backend URL baked in.

---

### 3. Deploy Frontend to Netlify (5 minutes)

**Option A: Drag & Drop (Easiest)**
```
□ Go to https://app.netlify.com
□ Drag the 'out' folder to deploy area
□ Done!
```

**Option B: Connect GitHub (Auto-updates)**
```
□ Go to https://app.netlify.com
□ Click "Add new site" → "Import project"
□ Connect GitHub: Tcgtech06/Codes
□ Branch: frontend_development
□ Build command: npm run build
□ Publish directory: out
□ Add environment variable:
  - NEXT_PUBLIC_API_URL = https://your-app.railway.app/api/v1
□ Deploy
```

**Detailed Guide**: See `NETLIFY_DEPLOYMENT.md`

---

### 4. Test Everything (10 minutes)

```
□ Visit your Netlify URL
□ Check home page loads
□ Click Catalogue
□ Click any category (Yarn, Fabric, etc.)
□ Go to Admin page
□ Login with: admin / KnitInfo2024@Admin
□ Upload an Excel file
□ Check if data appears in catalogue
□ Verify data persists after refresh
```

---

## Important Files Reference

| File | Purpose |
|------|---------|
| `RAILWAY_DEPLOYMENT_GUIDE.md` | Complete Railway deployment steps |
| `NETLIFY_DEPLOYMENT.md` | Complete Netlify deployment steps |
| `DEPLOYMENT_ANSWER.md` | Answers to your deployment questions |
| `deploy.md` | Quick deployment overview |
| `.env` | Your Supabase credentials (DO NOT commit) |
| `.env.local.example` | Template for environment variables |

---

## Your GitHub Repository

**Repository**: https://github.com/Tcgtech06/Codes
**Branch**: frontend_development
**Status**: ✅ All code pushed and ready

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER'S BROWSER                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              NETLIFY (Frontend)                          │
│  - Static HTML/CSS/JS from 'out' folder                 │
│  - Serves your Next.js website                          │
│  - URL: https://your-site.netlify.app                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ API Calls
                     ▼
┌─────────────────────────────────────────────────────────┐
│              RAILWAY (Backend)                           │
│  - Go API server running 24/7                           │
│  - Handles Excel uploads, data processing               │
│  - URL: https://your-app.railway.app                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Database Queries
                     ▼
┌─────────────────────────────────────────────────────────┐
│              SUPABASE (Database)                         │
│  - PostgreSQL database                                   │
│  - Stores companies, categories, etc.                   │
│  - URL: https://fykzllskgxgunjrdkopp.supabase.co       │
└─────────────────────────────────────────────────────────┘
```

---

## Common Mistakes to Avoid

❌ **DON'T** upload `.next` folder to Netlify
✅ **DO** upload `out` folder to Netlify

❌ **DON'T** try to run Go backend on Netlify
✅ **DO** deploy Go backend to Railway

❌ **DON'T** forget to set `NEXT_PUBLIC_API_URL` before building
✅ **DO** set it in `.env.local` before `npm run build`

❌ **DON'T** use `http://localhost:8080` in production
✅ **DO** use your Railway URL

---

## Troubleshooting Quick Reference

**Backend not working?**
→ Check Railway logs and environment variables

**Frontend can't connect to backend?**
→ Verify `NEXT_PUBLIC_API_URL` is correct and rebuild

**Data not persisting?**
→ Check Supabase connection in Railway logs

**CORS errors?**
→ Backend already configured for Netlify domains

**Excel upload not working?**
→ Check Railway logs for errors

---

## Estimated Time

- Railway deployment: 15 minutes
- Frontend build: 5 minutes
- Netlify deployment: 5 minutes
- Testing: 10 minutes

**Total: ~35 minutes** ⏱️

---

## Ready to Deploy?

1. Open `RAILWAY_DEPLOYMENT_GUIDE.md`
2. Follow steps 1-9
3. Your app will be live! 🚀

---

## After Deployment

Once everything is working:
- Share your Netlify URL with users
- Monitor Railway logs for any issues
- Check Supabase usage in dashboard
- Consider upgrading Railway if needed (free tier: $5/month credit)

---

## Questions?

Refer to these guides:
- Railway: `RAILWAY_DEPLOYMENT_GUIDE.md`
- Netlify: `NETLIFY_DEPLOYMENT.md`
- General: `deploy.md`
- FAQ: `DEPLOYMENT_ANSWER.md`
