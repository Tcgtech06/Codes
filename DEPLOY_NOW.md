# 🚀 Deploy Your Full Stack App to Netlify

## ✅ Everything is Ready!

Your Go backend has been converted to Node.js API routes. You can now deploy everything to Netlify with a single command!

---

## 📋 How It Works

### Excel Upload Flow:

1. **Admin uploads Excel** → Admin dashboard (`/admin/dashboard`)
2. **File is parsed** → API route `/api/v1/excel/parse`
3. **Data stored in Supabase** → `companies` table
4. **Frontend fetches data** → API route `/api/v1/companies/category/:category`
5. **Displayed in catalogue** → Category page shows containers

### Architecture:

```
Frontend (Next.js Pages)
    ↓
API Routes (Node.js Serverless Functions)
    ↓
Supabase (PostgreSQL Database)
```

---

## 🎯 Deploy to Netlify (3 Steps)

### Step 1: Go to Netlify

1. Visit https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Click **"Deploy with GitHub"**
4. Authorize Netlify to access your GitHub
5. Select repository: **Tcgtech06/Codes**
6. Select branch: **node**

### Step 2: Configure Build Settings

Netlify will auto-detect Next.js. Verify these settings:

- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Functions directory**: (leave empty, auto-detected)

### Step 3: Add Environment Variables

Click **"Add environment variables"** and add these:

```
SUPABASE_URL=https://fykzllskgxgunjrdkopp.supabase.co

SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5a3psbHNrZ3hndW5qcmRrb3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDU1MzQ5NSwiZXhwIjoyMDg2MTI5NDk1fQ.xJUvPxHfpRH91ZqszrlH7gblDVGDUHhq3-fFDbbREnA

NEXT_PUBLIC_SUPABASE_URL=https://fykzllskgxgunjrdkopp.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5a3psbHNrZ3hndW5qcmRrb3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NTM0OTUsImV4cCI6MjA4NjEyOTQ5NX0.Zjf5Xj0Ah5gfnNA0uaOMzjwinF9ziuw5ek4mBmRm1iU

NEXT_PUBLIC_API_URL=/api/v1

JWT_SECRET=knitinfo-secret-key-2024

ADMIN_USERNAME=admin

ADMIN_PASSWORD=KnitInfo2024@Admin
```

**Important**: Copy each value exactly as shown above!

Then click **"Deploy site"**

---

## ⏱️ Deployment Time

- Build: 2-3 minutes
- Deploy: 30 seconds
- **Total: ~3 minutes**

---

## ✅ After Deployment

### 1. Get Your URL

Netlify will give you a URL like:
```
https://your-site-name.netlify.app
```

### 2. Test Your API

Open these URLs in your browser:

**Health Check:**
```
https://your-site-name.netlify.app/api/health
```
Should return: `{"status":"ok","service":"KnitInfo API"}`

**Categories:**
```
https://your-site-name.netlify.app/api/v1/categories
```
Should return: `{"categories":[...]}`

**Companies:**
```
https://your-site-name.netlify.app/api/v1/companies
```
Should return: `{"companies":[...]}`

### 3. Test Excel Upload

1. Go to `https://your-site-name.netlify.app/admin`
2. Login with:
   - Username: `admin`
   - Password: `KnitInfo2024@Admin`
3. Go to Dashboard
4. Select a category (e.g., "Yarn")
5. Upload an Excel file
6. Click "Upload"
7. Go to Catalogue → Click the category
8. You should see the uploaded companies as containers!

---

## 📊 Excel File Format

Your Excel file should have these columns:

| COMPANY NAME | ADDRESS | PHONE NUMBER | E-MAIL ID | CONTACT PERSON | PRODUCTS |
|--------------|---------|--------------|-----------|----------------|----------|
| ABC Textiles | Chennai | 9876543210   | abc@...   | John Doe       | Cotton   |

**Supported column name formats:**
- `COMPANY NAME` or `Company Name` or `company_name`
- `ADDRESS` or `Address` or `address`
- `PHONE NUMBER` or `Phone Number` or `phone`
- `E-MAIL ID` or `Email` or `email`
- `CONTACT PERSON` or `Contact Person` or `contact_person`
- `PRODUCTS` or `Products` or `products`

---

## 🎉 What You Get

✅ **Full-stack app** - Frontend + Backend in one deployment
✅ **Automatic HTTPS** - Free SSL certificate
✅ **Serverless scaling** - Handles traffic automatically
✅ **Free hosting** - Netlify free tier
✅ **Auto-deploy** - Push to GitHub = auto-deploy
✅ **Excel upload** - Parse and store in Supabase
✅ **Admin dashboard** - Manage data easily
✅ **Mobile-first** - Responsive design

---

## 🔧 Troubleshooting

### Build Fails

**Check:**
- All environment variables are set correctly
- No typos in variable names
- Values don't have extra spaces or newlines

**Solution:**
- Go to Site settings → Environment variables
- Verify each variable
- Redeploy

### API Returns 500 Error

**Check:**
- Supabase credentials are correct
- Database tables exist
- Check Netlify function logs

**Solution:**
- Go to Netlify dashboard → Functions
- Click on the failing function
- View logs for error details

### Excel Upload Not Working

**Check:**
- File is .xlsx format
- Category is selected
- File has correct column names

**Solution:**
- Use the exact column names from the format above
- Ensure at least "COMPANY NAME" column exists
- Check Netlify function logs for errors

### Data Not Showing in Catalogue

**Check:**
- Data was uploaded successfully (check admin dashboard response)
- Category name matches exactly
- Supabase has the data (check Supabase dashboard)

**Solution:**
- Go to Supabase dashboard → Table Editor → companies
- Verify data exists
- Check category field matches the catalogue category

---

## 📱 Test on Mobile

Your app is mobile-first! Test on your phone:

1. Open your Netlify URL on mobile
2. You'll see bottom navigation
3. Test all features:
   - Browse catalogue
   - View company details
   - Admin login (on mobile too!)
   - Excel upload

---

## 🎯 Next Steps

1. ✅ Deploy to Netlify (follow steps above)
2. ✅ Test all features
3. ✅ Upload some Excel files
4. ✅ Share your Netlify URL with users
5. ✅ Enjoy your live app!

---

## 💡 Pro Tips

- **Custom domain**: Add your own domain in Netlify settings
- **Auto-deploy**: Every push to `node` branch auto-deploys
- **Preview deploys**: Pull requests get preview URLs
- **Rollback**: Easy rollback to previous deployments
- **Analytics**: Enable Netlify Analytics for visitor stats

---

## 📞 Support

WhatsApp: +91 9943632229

---

**Your app is ready to deploy! Just follow the 3 steps above and you'll be live in 3 minutes! 🚀**
