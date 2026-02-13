# Netlify Deployment Guide

## IMPORTANT: Do NOT upload the `out` folder manually!

Your app has API routes that need to run as serverless functions. Manual upload of static files won't work.

## Method 1: GitHub Integration (RECOMMENDED)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for Netlify deployment"
   git push origin node
   ```

2. **Connect to Netlify:**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub"
   - Select your repository
   - Select the `node` branch
   - Netlify will auto-detect Next.js settings from `netlify.toml`

3. **Deploy:**
   - Click "Deploy site"
   - Netlify will build and deploy automatically
   - Your API routes will work as serverless functions

## Method 2: Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Initialize site:**
   ```bash
   netlify init
   ```

4. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

## Environment Variables (Already Added)

You've already added these in Netlify dashboard:
- ✅ SUPABASE_URL
- ✅ SUPABASE_SERVICE_KEY
- ✅ NEXT_PUBLIC_SUPABASE_URL
- ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
- ✅ NEXT_PUBLIC_API_URL
- ✅ JWT_SECRET
- ✅ ADMIN_USERNAME
- ✅ ADMIN_PASSWORD

## Build Settings (from netlify.toml)

```toml
[build]
  command = "npm run build"
  publish = ".next"
```

This tells Netlify to:
1. Run `npm run build` to build your Next.js app
2. Publish the `.next` folder (not `out`)
3. Use the Next.js plugin to handle serverless functions

## Troubleshooting

If the catalogue is still empty after deployment:
1. Check Netlify function logs for errors
2. Verify environment variables are set correctly
3. Make sure you're deploying from GitHub, not uploading manually
4. Check that the build completed successfully

## Current Status

✅ API keys hardcoded in `src/lib/supabase.ts`
✅ `netlify.toml` configured correctly
✅ No static export in `next.config.ts`
❌ Need to deploy via GitHub or Netlify CLI (not manual upload)
