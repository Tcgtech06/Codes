# Netlify Deployment Guide

## Method 1: Automatic Deployment (RECOMMENDED)

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin frontend
```

### Step 2: Connect Netlify to GitHub
1. Go to https://netlify.com
2. Click "Add new site" → "Import an existing project"
3. Choose "Deploy with GitHub"
4. Select your repository: `Tcgtech06/Codes`
5. Select branch: `frontend`

### Step 3: Configure Build Settings
- **Base directory**: (leave empty)
- **Build command**: `npm run build`
- **Publish directory**: `out`

### Step 4: Add Environment Variables
Click "Site settings" → "Environment variables" → "Add a variable"

```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api/v1
```

### Step 5: Deploy
Click "Deploy site" - Netlify will:
1. Clone your repo
2. Run `npm install`
3. Run `npm run build`
4. Deploy the `out` folder
5. Give you a URL like `https://knitinfo.netlify.app`

---

## Method 2: Manual Upload (Static Export)

### Step 1: Build Locally
```bash
npm run build
```

This creates an `out` folder with static files.

### Step 2: Deploy to Netlify
1. Go to https://netlify.com
2. Drag and drop the `out` folder onto Netlify
3. Done!

**Note**: With manual upload, you need to:
- Re-upload every time you make changes
- No automatic deployments
- No preview deployments

---

## Which Method Should You Use?

### Use Automatic Deployment (Method 1) if:
✅ You want automatic updates when you push to GitHub
✅ You want preview deployments for pull requests
✅ You want easy rollbacks
✅ You're working in a team

### Use Manual Upload (Method 2) if:
✅ You want quick one-time deployment
✅ You don't have GitHub access
✅ You're just testing

---

## Current Configuration

Your `next.config.ts` is set to:
```typescript
output: "export"  // Creates 'out' folder for static deployment
```

This means:
- `npm run build` creates an `out` folder
- The `out` folder contains static HTML/CSS/JS
- You can upload `out` folder anywhere (Netlify, Vercel, GitHub Pages)

---

## Backend Configuration

Your backend needs to be deployed separately to Railway/Render.

### Backend URL
After deploying backend, update your frontend environment variable:

**Local (.env.local)**
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

**Production (Netlify Environment Variables)**
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api/v1
```

---

## Testing After Deployment

### 1. Test Frontend
Visit your Netlify URL: `https://knitinfo.netlify.app`

### 2. Check API Connection
Open browser console (F12) and check for errors:
- If you see CORS errors → Update backend CORS settings
- If you see 404 errors → Check API URL is correct
- If you see network errors → Backend might be down

### 3. Test Features
- ✅ Homepage loads
- ✅ Categories display
- ✅ Catalogue pages work
- ✅ Admin login works
- ✅ Excel upload works

---

## Common Issues

### Issue 1: "Our Stories" Animation Not Working
**Cause**: Old cached version
**Fix**: 
1. Clear browser cache
2. Hard refresh (Ctrl + Shift + R)
3. Check if latest code is deployed

### Issue 2: Backend Not Working
**Cause**: Backend not deployed or wrong URL
**Fix**:
1. Deploy backend to Railway first
2. Get backend URL
3. Update `NEXT_PUBLIC_API_URL` in Netlify
4. Redeploy frontend

### Issue 3: CORS Errors
**Cause**: Backend doesn't allow frontend domain
**Fix**: Update `cmd/server/main.go`:
```go
e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
    AllowOrigins: []string{
        "http://localhost:3000",
        "https://knitinfo.netlify.app",  // Your Netlify URL
        "https://*.netlify.app",
    },
    AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete},
    AllowHeaders: []string{"*"},
}))
```

### Issue 4: 404 on Refresh
**Cause**: Netlify doesn't know how to handle client-side routing
**Fix**: Already handled by `netlify.toml` redirects

---

## Deployment Checklist

Before deploying:
- [ ] Backend deployed to Railway
- [ ] Backend URL obtained
- [ ] Frontend `.env.local` updated with backend URL
- [ ] Code pushed to GitHub
- [ ] `npm run build` works locally
- [ ] No TypeScript errors
- [ ] All features tested locally

After deploying:
- [ ] Frontend accessible via Netlify URL
- [ ] API calls working (check browser console)
- [ ] Admin login works
- [ ] Excel upload works
- [ ] All pages load correctly
- [ ] Images display correctly

---

## Updating Your Deployment

### For Automatic Deployment:
```bash
# Make changes to your code
git add .
git commit -m "Update feature"
git push origin frontend
# Netlify automatically rebuilds and deploys
```

### For Manual Upload:
```bash
# Make changes to your code
npm run build
# Drag and drop 'out' folder to Netlify
```

---

## Cost Summary

- **Netlify**: FREE (100GB bandwidth/month)
- **Railway**: $5/month (or $5 free credit)
- **Supabase**: FREE (500MB database)

**Total**: ~$5/month for production deployment

