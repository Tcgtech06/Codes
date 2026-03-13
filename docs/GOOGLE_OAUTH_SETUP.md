# Google OAuth 2.0 Setup Guide

## Overview
Google OAuth 2.0 authentication has been implemented in KnitInfo. This guide walks you through setting up Google credentials and configuring your local development environment.

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project:
   - Click on project dropdown at the top
   - Click "NEW PROJECT"
   - Enter project name (e.g., "KnitInfo")
   - Click "CREATE"

3. Wait for the project to be created, then select it

## Step 2: Enable Google + API

1. In the Cloud Console search bar, search for "Google+ API"
2. Click on "Google+ API"
3. Click "ENABLE"
4. Wait for it to be enabled

## Step 3: Create OAuth 2.0 Credentials

1. In the Cloud Console, go to **APIs & Services > Credentials**
2. Click **+ CREATE CREDENTIALS** button
3. Select **OAuth client ID**
4. If prompted to create an OAuth consent screen, click **CREATE OAUTH CONSENT SCREEN**

### Configure OAuth Consent Screen:

1. **User Type**: Select "External"
2. **Fill in the form**:
   - **App name**: KnitInfo
   - **User support email**: your-email@example.com
   - **App logo** (optional): leave blank for now
   - **Authorized domains**: localhost (for development)
   - **Developer contact**: your-email@example.com

3. Click **SAVE AND CONTINUE**

4. **Scopes**: Click **ADD OR REMOVE SCOPES**
   - Search for and add:
     - `openid`
     - `https://www.googleapis.com/auth/userinfo.email`
     - `https://www.googleapis.com/auth/userinfo.profile`
   - Click **UPDATE** and **SAVE AND CONTINUE**

5. **Test users** (optional): Add your Google account email as a test user
6. Click **SAVE AND CONTINUE**
7. Review and click **BACK TO DASHBOARD**

## Step 4: Create OAuth 2.0 Client ID

1. Back in **APIs & Services > Credentials**
2. Click **+ CREATE CREDENTIALS > OAuth client ID**
3. **Application type**: Select **Web application**
4. **Name**: KnitInfo OAuth Client
5. **Authorized JavaScript origins**:
   ```
   http://localhost:8080
   http://localhost:3000
   ```
6. **Authorized redirect URIs**:
   ```
   http://localhost:8080/api/v1/auth/google/callback
   http://localhost:3000/sign-in
   ```
7. Click **CREATE**

## Step 5: Copy Your Credentials

A dialog will appear with your credentials:
- Copy **Client ID**
- Copy **Client Secret**

Keep these safe! Never commit them to version control.

## Step 6: Add Credentials to Environment Files

### Backend (.env.local)

Update `d:\Freelancing\KnitInfo\KnitInfo_Backend\.env.local`:

```dotenv
# Replace with your actual Google OAuth credentials
GOOGLE_CLIENT_ID=<your-client-id-here>
GOOGLE_CLIENT_SECRET=<your-client-secret-here>
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<your-client-id-here>
```

### Backend (.env)

Already configured, but verify it looks like:

```dotenv
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
```

## Step 7: Test the Implementation

1. **Start the backend server**:
   ```bash
   cd d:\Freelancing\KnitInfo\KnitInfo_Backend
   npm run dev
   # Server will run on http://localhost:8080
   ```

2. **Test Google OAuth flow**:
   - Navigate to `http://localhost:8080/sign-in`
   - Click "Sign in with Google"
   - You should be redirected to Google consent screen
   - After approval, you should be redirected back and signed in

3. **Test frontend** (if running separately):
   ```bash
   cd d:\Freelancing\KnitInfo\KnitInfo_Frontend
   npm run dev
   # Frontend will run on http://localhost:3000
   ```
   - Navigate to `http://localhost:3000/sign-in`
   - Click "Sign in with Google"
   - Should redirect to backend OAuth flow

## How It Works

### OAuth Flow Diagram

```
User Browser
    ↓
[Clicks "Sign in with Google"]
    ↓
Backend: /api/v1/auth/google/init
    ↓
[Redirects to Google consent screen]
    ↓
Google OAuth Provider
    ↓
User approves consent
    ↓
[Redirects to /api/v1/auth/google/callback]
    ↓
Backend exchanges code for tokens
    ↓
Backend fetches user info
    ↓
[Redirects to /sign-in?success=true&userData=...]
    ↓
Frontend processes userData
    ↓
Frontend sets localStorage session
    ↓
User is signed in!
```

### API Endpoints

**Backend OAuth Routes:**
- `GET /api/v1/auth/google/init` - Initiates OAuth flow (redirects to Google)
- `GET /api/v1/auth/google/callback` - Handles Google callback (exchanges code for tokens)

### Data Flow

1. **Sign-in with Google button** → redirects to `/api/v1/auth/google/init`
2. **Auth init endpoint** → redirects to Google consent screen with CSRF protection (state token)
3. **User approves** → Google redirects back with authorization code
4. **Callback endpoint** → validates CSRF, exchanges code for token, fetches user info
5. **Callback endpoint** → redirects to `/sign-in?success=true&userData=...`
6. **Frontend processes** → extracts userData from URL, sets localStorage session

## Troubleshooting

### Issue: "Supabase is not configured"
- Make sure you have `.env.local` in the backend directory with correct credentials
- Restart the dev server

### Issue: "Google OAuth not configured"
- Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in `.env.local`
- Verify credentials from Google Cloud Console

### Issue: "invalid_state" error
- This means CSRF protection detected a mismatch
- Try clearing browser cookies for localhost
- Ensure you're using the same origin for initial request and callback

### Issue: "Redirect URI mismatch"
- Google is rejecting the redirect URL
- Verify the registered redirect URIs in Google Cloud Console match exactly:
  - `http://localhost:8080/api/v1/auth/google/callback`
- Make sure you're using `http://` not `https://` for localhost

### Issue: "Invalid authorization code"
- The authorization code has expired (valid for ~10 minutes)
- Try the OAuth flow again

## Security Notes

1. **Never commit credentials** - `.env.local` and secrets should be in `.gitignore`
2. **State protection** - CSRF state tokens are stored in httpOnly cookies
3. **Production setup** - For production:
   - Use `https://` not `http://`
   - Set `secure: true` on cookies
   - Use production Google OAuth credentials
   - Set proper `Authorized redirect URIs` in Google Cloud Console

## Files Modified

- `backend/src/lib/googleOAuth.ts` - OAuth utilities (token exchange, user info fetching)
- `backend/src/app/api/v1/auth/google/init/route.ts` - OAuth initialization endpoint
- `backend/src/app/api/v1/auth/google/callback/route.ts` - OAuth callback handler
- `backend/src/app/sign-in/page.tsx` - Updated sign-in form with Google button and OAuth callback handling
- `frontend/src/app/sign-in/page.tsx` - Updated sign-in form for frontend OAuth flow
- `backend/.env` - Added Google OAuth configuration template
- `backend/.env.local` - Add your actual credentials here

## Next Steps

1. Get Google OAuth credentials following this guide
2. Add credentials to `.env.local` files
3. Restart development servers
4. Test the OAuth flow locally
5. For production deployment, update credentials and URLs
