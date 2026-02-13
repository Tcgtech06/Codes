# Deploy Full Stack App to Netlify

## Overview

This project now has both frontend (Next.js) and backend (Next.js API Routes) in one codebase. Everything can be deployed to Netlify!

## Architecture

- **Frontend**: Next.js 16 with React 19
- **Backend**: Next.js API Routes (serverless functions)
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Netlify

## Prerequisites

1. Netlify account
2. Supabase project with credentials
3. GitHub repository

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Environment Variables

Create `.env.local` file:

```env
# Supabase Configuration
SUPABASE_URL=https://fykzllskgxgunjrdkopp.supabase.co
SUPABASE_SERVICE_KEY=your_service_key_here
NEXT_PUBLIC_SUPABASE_URL=https://fykzllskgxgunjrdkopp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# API Configuration (use relative path)
NEXT_PUBLIC_API_URL=/api/v1

# JWT Secret
JWT_SECRET=knitinfo-secret-key-2024

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=KnitInfo2024@Admin
```

## Step 3: Test Locally

```bash
# Run development server
npm run dev

# Test API endpoints
# Health: http://localhost:3000/api/health
# Companies: http://localhost:3000/api/v1/companies
# Categories: http://localhost:3000/api/v1/categories
```

## Step 4: Deploy to Netlify

### Option A: Connect GitHub (Recommended)

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub account
4. Select repository: `Tcgtech06/Codes`
5. Select branch: `node`
6. Build settings (auto-detected):
   - Build command: `npm run build`
   - Publish directory: `.next`
7. Add environment variables (same as `.env.local` above)
8. Click "Deploy"

### Option B: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

## Step 5: Configure Environment Variables in Netlify

In Netlify dashboard:

1. Go to Site settings → Environment variables
2. Add all variables from `.env.local`:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_API_URL` = `/api/v1`
   - `JWT_SECRET`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`

## Step 6: Test Deployment

After deployment, test these URLs:

```
https://your-site.netlify.app/api/health
https://your-site.netlify.app/api/v1/categories
https://your-site.netlify.app/api/v1/companies
```

## API Endpoints

All API routes are available at `/api/v1/`:

### Public Endpoints
- `GET /api/health` - Health check
- `GET /api/v1/companies` - List all companies
- `GET /api/v1/companies/:id` - Get company by ID
- `GET /api/v1/companies/category/:category` - Get companies by category
- `GET /api/v1/categories` - List all categories

### Protected Endpoints (require JWT token)
- `POST /api/v1/companies` - Create company
- `PUT /api/v1/companies/:id` - Update company
- `DELETE /api/v1/companies/:id` - Delete company
- `POST /api/v1/excel/parse` - Parse and upload Excel file

### Auth Endpoints
- `POST /api/v1/auth/login` - Admin login

## How It Works

1. **Frontend**: Next.js pages render the UI
2. **API Routes**: Next.js API routes handle backend logic
3. **Supabase**: Database operations via Supabase client
4. **Netlify**: Deploys everything as serverless functions

## Benefits

✅ Single deployment (no separate backend server)
✅ Automatic HTTPS
✅ Serverless scaling
✅ No server management
✅ Free tier available
✅ Automatic deployments on git push

## Troubleshooting

### API Routes Not Working

- Check Netlify function logs
- Verify environment variables are set
- Ensure `@netlify/plugin-nextjs` is installed

### Database Connection Fails

- Verify Supabase credentials
- Check Supabase project is active
- Test connection from Supabase dashboard

### Build Fails

- Run `npm run build` locally first
- Check for TypeScript errors
- Verify all dependencies are installed

## File Structure

```
src/
├── app/
│   ├── api/              # Backend API routes
│   │   ├── health/
│   │   └── v1/
│   │       ├── auth/
│   │       ├── companies/
│   │       ├── categories/
│   │       └── excel/
│   ├── (pages)/          # Frontend pages
│   └── layout.tsx
├── components/           # React components
├── lib/
│   ├── api.ts           # API client
│   └── supabase.ts      # Supabase client
└── hooks/               # Custom hooks
```

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Configure `.env.local`
3. ✅ Test locally: `npm run dev`
4. ✅ Push to GitHub
5. ✅ Deploy to Netlify
6. ✅ Add environment variables in Netlify
7. ✅ Test production deployment

Your full-stack app is now live on Netlify! 🚀
