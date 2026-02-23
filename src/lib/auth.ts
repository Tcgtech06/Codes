import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { getSupabaseBrowserClient } from '@/lib/supabaseClient';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  provider: string;
  mobileNumber?: string;
  state?: string;
  district?: string;
};

/**
 * Maps a Supabase auth user into the app-level user model.
 */
export function mapAuthUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email ?? '',
    name: user.user_metadata?.full_name ?? user.email ?? 'User',
    avatarUrl: user.user_metadata?.avatar_url ?? '',
    provider: user.app_metadata?.provider ?? 'google',
    mobileNumber: user.user_metadata?.phone ?? '',
    state: user.user_metadata?.state ?? '',
    district: user.user_metadata?.district ?? '',
  };
}

/**
 * Starts Google OAuth flow and redirects to provider login screen.
 */
export async function signInWithGoogle(redirectPath = '/dashboard'): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const redirectTo = `${window.location.origin}/sign-in?redirect=${encodeURIComponent(redirectPath)}`;

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    throw error;
  }
}

/**
 * Returns current authenticated user from session, or null.
 */
export async function getCurrentAuthUser(): Promise<AuthUser | null> {
  const supabase = getSupabaseBrowserClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  if (!session?.user) {
    return null;
  }

  return mapAuthUser(session.user);
}

/**
 * Subscribes to Supabase auth state changes.
 */
export function subscribeToAuthState(
  callback: (event: AuthChangeEvent, session: Session | null) => void
) {
  const supabase = getSupabaseBrowserClient();
  return supabase.auth.onAuthStateChange(callback);
}

/**
 * Logs out the current user and clears Supabase session.
 */
export async function signOutUser(): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}
