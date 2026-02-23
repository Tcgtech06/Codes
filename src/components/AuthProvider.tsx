'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
  type AuthUser,
  getCurrentAuthUser,
  signOutUser,
  subscribeToAuthState,
  mapAuthUser,
} from '@/lib/auth';

type User = AuthUser;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Bootstrap user from existing Supabase session.
    const checkSession = async () => {
      try {
        const currentUser = await getCurrentAuthUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Keep app state in sync with Supabase auth state changes.
    const authListener = subscribeToAuthState((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(mapAuthUser(session.user));
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      authListener?.data?.subscription?.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await signOutUser();
      setUser(null);
      router.push('/sign-in');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
