# Deploy to Netlify via GitHub

The Netlify CLI is having issues. Use GitHub integration instead:

## Steps:

1. **Go to your Netlify site:**
   - https://app.netlify.com/sites/fancy-pastelito-1799c0

2. **Connect to GitHub:**
   - Go to "Site configuration" → "Build & deploy"
   - Click "Link repository"
   - Choose GitHub
   - Select repository: `Tcgtech06/Codes`
   - Select branch: `node`

3. **Build settings (should auto-detect from netlify.toml):**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Base directory: (leave empty)

4. **Deploy:**
   - Click "Deploy site"
   - Netlify will automatically build and deploy
   - Your API routes will work as serverless functions

## Your Site Info:
- Site ID: `8389e880-a7e6-4a87-a13c-eff0d3444e93`
- Site name: `fancy-pastelito-1799c0`
- URL: https://fancy-pastelito-1799c0.netlify.app

## Environment Variables (Already Set):
✅ All environment variables are already configured in Netlify dashboard

## After Deployment:
Your catalogue page will show all companies with counts!
