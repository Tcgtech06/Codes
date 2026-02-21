# Answer to Your Deployment Questions

## Question 1: "Should I upload the .next folder to Netlify?"

**NO!** Upload the `out` folder, not `.next`.

Here's why:
- `.next` folder is for development and server-side rendering
- `out` folder contains static HTML/CSS/JS files ready for hosting
- Netlify hosts static files, not Next.js servers

## Question 2: "Our Stories animation not updating and backend not working"

This happens because:

### Problem 1: Wrong Configuration
Your `next.config.ts` was missing `output: "export"` - I just fixed this.

### Problem 2: Backend Not Deployed
When you upload `out` folder to Netlify, you're only deploying the frontend. The Go backend is NOT included.

## The Correct Deployment Process

### Step 1: Deploy Backend to Railway
```bash
# Your backend needs to run on Railway/Render
# It cannot run on Netlify (Netlify only hosts static files)
```

1. Go to https://railway.app
2. Deploy your GitHub repo
3. Railway will detect the Go app automatically
4. Add your `.env` variables
5. Get the backend URL: `https://your-app.railway.app`

### Step 2: Build Frontend with Backend URL
```bash
# Create .env.local file
echo "NEXT_PUBLIC_API_URL=https://your-app.railway.app/api/v1" > .env.local

# Build frontend
npm run build
```

This creates the `out` folder.

### Step 3: Deploy Frontend to Netlify
```bash
# Upload ONLY the 'out' folder to Netlify
# NOT the .next folder
# NOT the entire project
```

## Why This Separation?

Your project has TWO separate applications:

1. **Frontend (Next.js)** - Static website
   - Lives in: `src/app/`, `src/components/`
   - Builds to: `out/` folder
   - Deploys to: Netlify
   - Purpose: Show UI to users

2. **Backend (Go API)** - Server application
   - Lives in: `cmd/`, `pkg/`
   - Runs as: Go server on port 8080
   - Deploys to: Railway/Render
   - Purpose: Handle data, database, Excel uploads

## What Happens When You Deploy

### Netlify (Frontend Only)
- Hosts static HTML/CSS/JS files from `out` folder
- Serves your website to users
- Makes API calls to your Railway backend
- Cannot run Go code
- Cannot access database directly

### Railway (Backend Only)
- Runs your Go server
- Connects to Supabase database
- Handles Excel uploads
- Processes API requests from frontend
- Runs 24/7

## Quick Commands

```bash
# 1. Build frontend (after setting NEXT_PUBLIC_API_URL)
npm run build

# 2. The 'out' folder is created

# 3. Upload 'out' folder to Netlify (drag & drop)

# 4. Done! Frontend talks to Railway backend
```

## Common Mistakes to Avoid

❌ Uploading `.next` folder to Netlify
✅ Upload `out` folder to Netlify

❌ Trying to run Go backend on Netlify
✅ Deploy Go backend to Railway/Render

❌ Building without setting `NEXT_PUBLIC_API_URL`
✅ Set `NEXT_PUBLIC_API_URL` before building

❌ Using `http://localhost:8080` in production
✅ Use your Railway URL in production

## Testing Checklist

After deployment:
- [ ] Frontend loads on Netlify URL
- [ ] Catalogue pages show companies
- [ ] Admin login works
- [ ] Excel upload works
- [ ] Data persists after backend restart
- [ ] No CORS errors in browser console

## Need Help?

Check these files:
- `deploy.md` - Step-by-step deployment guide
- `NETLIFY_DEPLOYMENT.md` - Detailed Netlify instructions
- `.env.local.example` - Environment variable template
