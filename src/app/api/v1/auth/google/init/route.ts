import { NextRequest, NextResponse } from 'next/server';
import { getGoogleAuthUrl, generateState } from '@/lib/googleOAuth';

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUrl = new URL('/api/v1/auth/google/callback', request.nextUrl.origin).toString();

    if (!clientId) {
      return NextResponse.json(
        { error: 'Google OAuth not configured' },
        { status: 500 }
      );
    }

    // Generate CSRF protection state
    const state = generateState();

    // Get authorization URL
    const authUrl = getGoogleAuthUrl(clientId, redirectUrl, state);

    // Store state in cookie for CSRF protection (httpOnly for security)
    const response = NextResponse.redirect(authUrl);
    response.cookies.set('oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
    });

    return response;
  } catch (error) {
    console.error('Google OAuth init error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize Google OAuth' },
      { status: 500 }
    );
  }
}
