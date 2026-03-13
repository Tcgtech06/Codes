/**
 * Supabase Authentication Utilities
 * Handles OAuth sign-in and session management using Supabase
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Create Supabase client for browser/client-side authentication
 * Uses anon key which is safe to expose publicly
 */
export const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabase credentials not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
};

/**
 * Sign in with OAuth provider
 * @param provider - OAuth provider (e.g., 'google', 'github', 'discord')
 * @param redirectUrl - URL to redirect to after successful sign-in
 */
export async function signInWithOAuth(provider: string, redirectUrl: string) {
  try {
    const client = createSupabaseClient();

    const { data, error } = await client.auth.signInWithOAuth({
      provider: provider as any,
      options: {
        redirectTo: redirectUrl,
        scopes: provider === 'google' ? 'openid email profile' : undefined,
      },
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`OAuth sign-in error (${provider}):`, error);
    throw error;
  }
}

/**
 * Sign out current user
 */
export async function signOut() {
  try {
    const client = createSupabaseClient();
    const { error } = await client.auth.signOut();

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

/**
 * Get current session
 */
export async function getSession() {
  try {
    const client = createSupabaseClient();
    const {
      data: { session },
      error,
    } = await client.auth.getSession();

    if (error) {
      throw error;
    }

    return session;
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  try {
    const client = createSupabaseClient();
    const {
      data: { user },
      error,
    } = await client.auth.getUser();

    if (error) {
      throw error;
    }

    return user;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  try {
    const client = createSupabaseClient();
    return client.auth.onAuthStateChange(callback);
  } catch (error) {
    console.error('Auth state listener error:', error);
    return null;
  }
}
