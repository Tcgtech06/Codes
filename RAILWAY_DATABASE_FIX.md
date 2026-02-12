# Railway Database Connection Fix

## The Problem

Your logs show:
```
panic: Failed to connect to database: failed to connect to database: 
dial tcp [2406:da1a:f0d:f60f:dd63:a4af:f:1f:8c3]:5432: connect: network is unreachable
```

This means Railway cannot connect to Supabase database.

---

## Solution 1: Use Direct Connection Pooler (Recommended)

Supabase has a connection pooler that works better with serverless platforms like Railway.

### Step 1: Get Connection Pooler URL

1. Go to https://supabase.com/dashboard
2. Open your project: `fykzllskgxgunjrdkopp`
3. Go to **Settings** → **Database**
4. Scroll to **Connection string**
5. Select **Connection pooling** tab (NOT Session mode)
6. Copy the **Transaction mode** connection string

It should look like:
```
postgresql://postgres.fykzllskgxgunjrdkopp:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

### Step 2: Update Railway Environment Variable

1. Go to Railway dashboard
2. Click **Variables** tab
3. Find `SUPABASE_DB_URL`
4. Replace with the connection pooler URL from Step 1
5. Make sure to replace `[YOUR-PASSWORD]` with: `Vg3ZHt8mnONSOCZY`

Final URL should be:
```
postgresql://postgres.fykzllskgxgunjrdkopp:Vg3ZHt8mnONSOCZY@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

---

## Solution 2: Add SSL Mode Parameter

If Solution 1 doesn't work, try adding SSL mode to your connection string:

```
postgresql://postgres:Vg3ZHt8mnONSOCZY@db.fykzllskgxgunjrdkopp.supabase.co:5432/postgres?sslmode=require
```

Update in Railway:
1. Variables tab
2. Edit `SUPABASE_DB_URL`
3. Add `?sslmode=require` at the end

---

## Solution 3: Use IPv4 Connection

The error shows IPv6 address `[2406:da1a:...]` which Railway might not support.

Try using Supabase's IPv4 pooler:

```
postgresql://postgres.fykzllskgxgunjrdkopp:Vg3ZHt8mnONSOCZY@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
```

---

## How to Get the Correct Connection String

### Method 1: From Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **Settings** (gear icon)
4. Click **Database** in left sidebar
5. Scroll to **Connection string** section
6. You'll see multiple options:

   **Option A: Connection pooling (RECOMMENDED for Railway)**
   ```
   Transaction mode:
   postgresql://postgres.fykzllskgxgunjrdkopp:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
   ```

   **Option B: Direct connection**
   ```
   postgresql://postgres:[PASSWORD]@db.fykzllskgxgunjrdkopp.supabase.co:5432/postgres
   ```

7. Copy the **Transaction mode** URL
8. Replace `[PASSWORD]` with `Vg3ZHt8mnONSOCZY`

---

## Step-by-Step Fix

### 1. Get Correct Connection String

Go to Supabase Dashboard and get the connection pooler URL.

### 2. Update Railway Variable

```
Variable: SUPABASE_DB_URL
Value: postgresql://postgres.fykzllskgxgunjrdkopp:Vg3ZHt8mnONSOCZY@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

### 3. Verify Other Variables

Make sure these are also set correctly (no extra spaces):

```
SUPABASE_URL=https://fykzllskgxgunjrdkopp.supabase.co

SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5a3psbHNrZ3hndW5qcmRrb3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NTM0OTUsImV4cCI6MjA4NjEyOTQ5NX0.Zjf5Xj0Ah5gfnNA0uaOMzjwinF9ziuw5ek4mBmRm1iU

SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5a3psbHNrZ3hndW5qcmRrb3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDU1MzQ5NSwiZXhwIjoyMDg2MTI5NDk1fQ.xJUvPxHfpRH91ZqszrlH7gblDVGDUHhq3-fFDbbREnA

JWT_SECRET=knitinfo-secret-key-2024

ADMIN_USERNAME=admin

ADMIN_PASSWORD=KnitInfo2024@Admin
```

**Note:** PORT is automatically set by Railway, you can remove it or keep it as 8080 (doesn't matter).

### 4. Redeploy

Railway will automatically redeploy after you save the variables.

### 5. Check Logs

Wait 2-3 minutes and check logs. You should see:
```
✓ Connected to database
✓ Server listening on port 8080
```

Instead of:
```
✗ panic: Failed to connect to database
```

---

## Alternative: Check Supabase Database Status

1. Go to Supabase Dashboard
2. Check if database is active
3. Check if there are any connection limits
4. Verify password is correct: `Vg3ZHt8mnONSOCZY`

---

## Test Connection Locally

To verify the connection string works, test it locally:

```bash
# Test with direct connection
go run cmd/server/main.go
```

If it works locally but not on Railway, it's definitely a connection pooler issue.

---

## Expected Success Logs

After fixing, you should see:

```
Feb 12 2026 11:50:35  Codes  main.main()
Feb 12 2026 11:50:35  Codes  /app/cmd/server/main.go:74 (0x45e)
Feb 12 2026 11:50:36  Codes  ✓ Connected to Supabase database
Feb 12 2026 11:50:36  Codes  ✓ Initialized repositories
Feb 12 2026 11:50:36  Codes  ⇨ http server started on [::]:8080
```

---

## Quick Fix Summary

1. ✅ Go to Supabase Dashboard
2. ✅ Get **Connection pooling** → **Transaction mode** URL
3. ✅ Update `SUPABASE_DB_URL` in Railway with pooler URL
4. ✅ Wait for redeploy
5. ✅ Check logs for success message
6. ✅ Test: `https://codes-production-f14d.up.railway.app/health`

---

## Still Not Working?

If connection pooler doesn't work, try:

1. **Add SSL mode**: Add `?sslmode=require` to connection string
2. **Check Supabase IP whitelist**: Make sure Railway IPs are allowed
3. **Use Session mode**: Try session mode pooler instead of transaction mode
4. **Contact Supabase support**: They can help with connection issues

---

## PORT Variable

**Answer to your question:** Yes, PORT=8080 is fine! 

Railway actually sets its own PORT variable automatically, so you can:
- Keep it as 8080 (will be overridden by Railway)
- Remove it completely (Railway will set it)

The PORT is NOT the problem. The database connection is the issue.
