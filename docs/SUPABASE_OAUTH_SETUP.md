# Supabase OAuth Setup Guide

## Overview

KnitInfo uses Supabase's built-in OAuth authentication. Supabase simplifies OAuth by handling the OAuth flow directly, supporting multiple providers including Google, GitHub, Discord, Spotify, and more.

## Supported OAuth Providers

- ✅ Google
- ✅ GitHub
- ✅ Discord
- ✅ Spotify
- ✅ Twitch
- ✅ Facebook
- ✅ Notion

Currently enabled in KnitInfo:
- Google
- GitHub

## Step 1: Get Your Supabase Project

You should already have a Supabase project. If not:

1. Go to [supabase.com](https://supabase.com)
2. Sign up/login
3. Create a new project
4. Get your credentials:
   - **SUPABASE_URL**: Project settings > API
   - **SUPABASE_ANON_KEY**: Project settings > API (public key)
   - **SUPABASE_SERVICE_ROLE_KEY**: Project settings > API (service role key)

## Step 2: Configure OAuth in Supabase Dashboard

### For Google OAuth:

1. Go to your Supabase project dashboard
2. Navigate to **Authentication > Providers**
3. Find **Google** in the list
4. Click on Google to expand settings
5. You'll need Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create new OAuth 2.0 Client ID (Web application)
   - Set authorized URIs:
     ```
     http://localhost:3000
     http://localhost:8080
     https://fykzllskgxgunjrdkopp.supabase.co
     ```
   - Set authorized redirect URIs:
     ```
     http://localhost:3000/auth/callback
     http://localhost:8080/auth/callback
     https://fykzllskgxgunjrdkopp.supabase.co/auth/v1/callback?provider=google
     ```
6. Copy your Google **Client ID** and **Client Secret**
7. Paste them into Supabase's Google provider settings
8. Click **Save**

### For GitHub OAuth:

1. In Supabase dashboard: **Authentication > Providers > GitHub**
2. Go to GitHub Settings > Developer settings > OAuth Apps
3. Create New OAuth App:
   - Application name: KnitInfo
   - Homepage URL: `http://localhost:8080`
   - Authorization callback URL: `https://fykzllskgxgunjrdkopp.supabase.co/auth/v1/callback?provider=github`
4. Copy **Client ID** and **Client Secret**
5. Paste into Supabase's GitHub provider settings
6. Click **Save**

## Step 3: Update Environment Variables

Your Supabase credentials should already be in `.env.local`:

**Backend (.env.local)**
```dotenv
SUPABASE_URL=https://fykzllskgxgunjrdkopp.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SUPABASE_URL=https://fykzllskgxgunjrdkopp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

**Frontend (.env.local)**
```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://fykzllskgxgunjrdkopp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

## Step 4: Test Locally

### Start Backend
```bash
cd KnitInfo_Backend
npm install  # if needed
npm run dev
# Server runs on http://localhost:8080
```

### Start Frontend (optional, if running separately)
```bash
cd KnitInfo_Frontend
npm install  # if needed
npm run dev
# App runs on http://localhost:3000
```

### Test OAuth Flow

1. Navigate to `/sign-in` page
2. Click "Sign in with Google" or "Sign in with GitHub"
3. You'll be redirected to the OAuth provider (Google/GitHub)
4. Grant permission to KnitInfo
5. You'll be redirected back and signed in automatically
6. User data is saved to localStorage and form submissions table

## How Supabase OAuth Works

```
User → Sign in with Google/GitHub
  ↓
Browser redirected to OAuth provider
  ↓
User authenticates & grants permission
  ↓
Provider redirects back to:
  http://localhost:8080/auth/callback (or frontend URL)
  with authorization code
  ↓
Supabase client exchanges code for JWT tokens
  ↓
User session stored in localStorage
  ↓
Frontend detects authenticated user
  ↓
User is signed in! ✅
```

## Architecture

### Files Updated

**Backend:**
- `src/lib/supabaseAuth.ts` - Supabase auth utilities
- `src/app/sign-in/page.tsx` - Sign-in form with OAuth buttons
- `.env.local` - Supabase credentials

**Frontend:**
- `src/app/sign-in/page.tsx` - Sign-in form with OAuth buttons
- `.env.local` - Supabase public credentials

### Key Functions

**Backend/Frontend (supabaseAuth.ts)**
```typescript
signInWithOAuth(provider, redirectUrl)  // Initiate OAuth flow
signOut()                                // Sign out user
getSession()                             // Get current session
getCurrentUser()                         // Get current user
onAuthStateChange(callback)              // Listen to auth changes
```

## Data Flow

When user signs in via OAuth:

1. **Sign-in Page** calls `supabase.auth.signInWithOAuth('google')`
2. **Supabase** handles redirect to Google/GitHub OAuth
3. **User** authenticates with OAuth provider
4. **Provider** redirects back with auth code
5. **Supabase Client** automatically exchanges code for JWT
6. **Session** is established and stored in localStorage
7. **User** data is accessible via `getCurrentUser()`
8. **Frontend** extracts user info and saves to localStorage
9. **Subsequent requests** include JWT token automatically

## Session Management

Sessions are managed automatically by Supabase:

### Session Persistence
```typescript
const supabase = createClient(url, key, {
  auth: {
    persistSession: true,      // Persist in localStorage
    autoRefreshToken: true,    // Auto-refresh expired tokens
    detectSessionInUrl: true,  // Detect auth callback
  }
});
```

### Session Expiry
- Default expiry: 24 hours
- Auto-refresh happens before expiry
- User can manually sign out

## Troubleshooting

### Issue: "Supabase is not configured"
**Solution**: Ensure Supabase credentials are in `.env.local`:
```
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Issue: OAuth button doesn't work
**Solution**: 
1. Check Supabase OAuth provider is enabled in dashboard
2. Verify OAuth app credentials are configured correctly
3. Check redirect URIs match your setup (localhost vs domain)

### Issue: "Authorization URL is invalid"
**Solution**: Supabase OAuth provider not enabled
- Go to Authentication > Providers in Supabase dashboard
- Enable the provider you're trying to use

### Issue: User can't sign in on production
**Solution**: 
1. Update redirect URIs in OAuth apps to production domain
2. Update `NEXT_PUBLIC_SUPABASE_URL` to production Supabase URL
3. Ensure HTTPS is used on production

### Issue: Session lost after refresh
**Solution**: Verify `persistSession: true` is set in Supabase client config

## Logout Implementation

```typescript
// Logout button in your app
const handleLogout = async () => {
  await clearUserSession();  // Clear localStorage
  const { error } = await supabase.auth.signOut();
  if (!error) {
    router.push('/sign-in');
  }
};
```

## Manual Sign-in Still Available

The manual sign-in form (name, email, mobile, state, district) is still available as an alternative to OAuth.

## Security Notes

1. **Never commit credentials** - Use `.env.local` with `.gitignore`
2. **Use HTTPS in production** - OAuth requires secure connections
3. **Token storage** - Tokens are in localStorage; consider using httpOnly cookies for production
4. **Scope limiting** - OAuth requests minimal scopes (openid, email, profile)

## More Information

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [OAuth Provider Setup](https://supabase.com/docs/guides/auth/social-login)
- [Session Management](https://supabase.com/docs/guides/auth/managing-user-sessions)

## Support

For issues:
1. Check Supabase status: https://status.supabase.com
2. Review Supabase logs in project dashboard
3. Check browser console for errors
4. Verify OAuth app configuration in Google/GitHub
