export interface UserSession {
  name: string;
  email: string;
  mobileNumber: string;
  state: string;
  district: string;
  signedInAt: string;
  provider: 'manual';
}

const USER_SESSION_KEY = 'knitinfo_user_session';

export function getUserSession(): UserSession | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(USER_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserSession;
  } catch {
    return null;
  }
}

export function isUserSignedIn(): boolean {
  if (getUserSession() !== null) {
    return true;
  }

  if (typeof window === 'undefined') {
    return false;
  }

  return Object.keys(localStorage).some(
    (key) => key.startsWith('sb-') && key.endsWith('-auth-token')
  );
}

export function setUserSession(session: UserSession): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(session));
}

export function clearUserSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_SESSION_KEY);
}

export function getSignInRedirectUrl(pathname: string): string {
  const encoded = encodeURIComponent(pathname);
  return `/sign-in?redirect=${encoded}`;
}
