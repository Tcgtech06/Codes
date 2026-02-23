'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton';
import { getSupabaseBrowserClient } from '@/lib/supabaseClient';

export default function SignInPage() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check auth session and redirect authenticated users.
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    const checkSession = async () => {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          throw sessionError;
        }

        if (data.session) {
          const redirect = new URLSearchParams(window.location.search).get('redirect') || '/dashboard';
          router.replace(redirect);
          return;
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unable to load auth session.';
        setError(message);
      } finally {
        setCheckingSession(false);
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const redirect = new URLSearchParams(window.location.search).get('redirect') || '/dashboard';
        router.replace(redirect);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm p-6 md:p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a8a] mx-auto"></div>
          <p className="text-gray-600 mt-4">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm p-6 md:p-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-700 hover:text-[#1e3a8a] transition-colors mb-4"
        >
          <ArrowLeft size={18} />
          <span className="font-medium">Back</span>
        </button>

        <h1 className="text-2xl font-bold text-gray-900">Sign In</h1>
        <p className="text-gray-600 mt-1 mb-6">Use your Google account to continue.</p>

        {error && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <GoogleLoginButton
          redirectPath="/dashboard"
          onError={(message) => {
            setError(message);
          }}
        />
      </div>
    </div>
  );
}
