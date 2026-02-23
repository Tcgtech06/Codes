import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken, getGoogleUserInfo } from '@/lib/googleOAuth';

export async function GET(request: NextRequest) {
  try {
    // Get authorization code and state from query params
    const code = request.nextUrl.searchParams.get('code');
    const state = request.nextUrl.searchParams.get('state');
    const error = request.nextUrl.searchParams.get('error');

    // Check for OAuth errors
    if (error) {
      return NextResponse.redirect(
        new URL(`/sign-in?error=${encodeURIComponent(error)}`, request.nextUrl.origin)
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/sign-in?error=missing_code_or_state', request.nextUrl.origin)
      );
    }

    // Verify CSRF protection - check state cookie
    const storedState = request.cookies.get('oauth_state')?.value;
    if (!storedState || storedState !== state) {
      return NextResponse.redirect(
        new URL('/sign-in?error=invalid_state', request.nextUrl.origin)
      );
    }

    // Get environment variables
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUrl = new URL('/api/v1/auth/google/callback', request.nextUrl.origin).toString();

    if (!clientId || !clientSecret) {
      console.error('Google OAuth credentials not configured');
      return NextResponse.redirect(
        new URL('/sign-in?error=oauth_not_configured', request.nextUrl.origin)
      );
    }

    // Exchange code for tokens
    const tokens = await exchangeCodeForToken(code, clientId, clientSecret, redirectUrl);

    // Get user info
    const userInfo = await getGoogleUserInfo(tokens.access_token);

    // Extract first and last name from full name
    const nameParts = userInfo.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';

    // Create signed-in user data - store as JSON in query param for frontend to process
    const userData = {
      name: userInfo.name,
      firstName,
      lastName,
      email: userInfo.email,
      provider: 'google',
      googleId: userInfo.id,
      picture: userInfo.picture,
      signedInAt: new Date().toISOString(),
    };

    // Encode user data for safe URL transmission
    const encodedUserData = encodeURIComponent(JSON.stringify(userData));

    // Redirect to sign-in success page with user data
    const response = NextResponse.redirect(
      new URL(`/sign-in?success=true&userData=${encodedUserData}`, request.nextUrl.origin)
    );

    // Clear the state cookie
    response.cookies.delete('oauth_state');

    return response;
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.redirect(
      new URL(
        `/sign-in?error=${encodeURIComponent(errorMessage)}`,
        request.nextUrl.origin
      )
    );
  }
}
