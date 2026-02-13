# Quick Start - Deploy to Netlify

## ✅ What's Done

Your Go backend has been converted to Node.js API routes! Everything is now in one codebase and can be deployed to Netlify.

## 🚀 Deploy Now (5 Steps)

### 1. Install Dependencies

```bash
npm install
```

### 2. Create `.env.local` File

```env
SUPABASE_URL=https://fykzllskgxgunjrdkopp.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5a3psbHNrZ3hndW5qcmRrb3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDU1MzQ5NSwiZXhwIjoyMDg2MTI5NDk1fQ.xJUvPxHfpRH91ZqszrlH7gblDVGDUHhq3-fFDbbREnA
NEXT_PUBLIC_SUPABASE_URL=https://fykzllskgxgunjrdkopp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5a3psbHNrZ3hndW5qcmRrb3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NTM0OTUsImV4cCI6MjA4NjEyOTQ5NX0.Zjf5Xj0Ah5gfnNA0uaOMzjwinF9ziuw5ek4mBmRm1iU
NEXT_PUBLIC_API_URL=/api/v1
JWT_SECRET=knitinfo-secret-key-2024
ADMIN_USERNAME=admin
ADMIN_PASSWORD=KnitInfo2024@Admin
```

### 3. Test Locally

```bash
npm run dev
```

Open http://localhost:3000

Test API: http://localhost:3000/api/health

### 4. Deploy to Netlify

Go to https://app.netlify.com

1. Click "Add new site" → "Import an existing project"
2. Connect GitHub
3. Select: `Tcgtech06/Codes`
4. Branch: `node`
5. Build command: `npm run build`
6. Publish directory: `.next`
7. Click "Deploy"

### 5. Add Environment Variables in Netlify

In Netlify dashboard → Site settings → Environment variables:

Add all variables from `.env.local` above.

## ✅ Done!

Your full-stack app is now live on Netlify!

- Frontend: `https://your-site.netlify.app`
- API: `https://your-site.netlify.app/api/v1/companies`

## 📚 More Info

See `DEPLOYMENT_NETLIFY.md` for detailed instructions.

## 🎯 What Changed

- ❌ Removed: Go backend (cmd/, pkg/, go.mod)
- ✅ Added: Node.js API routes (src/app/api/)
- ✅ Added: Supabase client (src/lib/supabase.ts)
- ✅ Updated: package.json with backend dependencies
- ✅ Updated: API client to use relative URLs

## 🔥 Benefits

- Single deployment (no separate backend)
- No cloud service needed (Railway, Koyeb, etc.)
- Deploy with `npm run build`
- Free Netlify hosting
- Automatic HTTPS
- Serverless scaling

## 📞 Support

WhatsApp: +91 9943632229
