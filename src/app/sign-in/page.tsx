'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton';
import { getSupabaseBrowserClient } from '@/lib/supabaseClient';
import {
  completePasswordReset,
  requestPasswordReset,
  signInWithEmail,
  signUpWithEmail,
} from '@/lib/auth';

export default function SignInPage() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mode, setMode] = useState<'sign-in' | 'sign-up' | 'forgot-password' | 'reset-password'>(() =>
    typeof window !== 'undefined' && window.location.hash.includes('type=recovery')
      ? 'reset-password'
      : 'sign-in'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(
    typeof window !== 'undefined' && window.location.hash.includes('type=recovery')
  );
  const [manualForm, setManualForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [resetPassword, setResetPassword] = useState('');

  const redirectPath =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('redirect') || '/dashboard'
      : '/dashboard';

  // Check auth session and redirect authenticated users.
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    const checkSession = async () => {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          throw sessionError;
        }

        if (data.session && !isRecoveryMode) {
          router.replace(redirectPath);
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
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecoveryMode(true);
        setMode('reset-password');
        return;
      }

      if (session && !isRecoveryMode) {
        router.replace(redirectPath);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isRecoveryMode, redirectPath, router]);

  const handleManualSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      setIsSubmitting(true);

      if (mode === 'forgot-password') {
        await requestPasswordReset(manualForm.email.trim());
        setSuccess('If your email exists, a password reset link has been sent.');
        return;
      }

      if (mode === 'reset-password') {
        await completePasswordReset(resetPassword);
        setSuccess('Password updated successfully. Redirecting...');
        setMode('sign-in');
        setIsRecoveryMode(false);
        setResetPassword('');
        if (typeof window !== 'undefined') {
          window.history.replaceState({}, document.title, '/sign-in');
        }
        router.replace(redirectPath);
        return;
      }

      if (mode === 'sign-up') {
        const data = await signUpWithEmail(
          manualForm.name.trim(),
          manualForm.email.trim(),
          manualForm.password
        );

        if (data.requiresEmailConfirmation) {
          setSuccess('Account created. Please check your email to confirm your account before signing in.');
          setMode('sign-in');
          setManualForm((prev) => ({ ...prev, password: '' }));
          return;
        }

        router.replace(redirectPath);
        return;
      }

      await signInWithEmail(manualForm.email.trim(), manualForm.password);
      router.replace(redirectPath);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Authentication failed.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <p className="text-gray-600 mt-1 mb-6">Sign in with email/password or continue with Google.</p>

        {!isRecoveryMode && (
          <div className="mb-5 grid grid-cols-2 bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => {
                setMode('sign-in');
                setError(null);
                setSuccess(null);
              }}
              className={`py-2 text-sm font-semibold rounded-md transition-colors ${
                mode === 'sign-in' || mode === 'forgot-password'
                  ? 'bg-white text-[#1e3a8a] shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('sign-up');
                setError(null);
                setSuccess(null);
              }}
              className={`py-2 text-sm font-semibold rounded-md transition-colors ${
                mode === 'sign-up' ? 'bg-white text-[#1e3a8a] shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {error && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800">
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleManualSubmit} className="space-y-4 mb-6">
          {mode === 'sign-up' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={manualForm.name}
                onChange={(event) =>
                  setManualForm((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/30"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={manualForm.email}
              onChange={(event) =>
                setManualForm((prev) => ({
                  ...prev,
                  email: event.target.value,
                }))
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/30"
              required
            />
          </div>

          {mode !== 'forgot-password' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {mode === 'reset-password' ? 'New Password' : 'Password'}
              </label>
              <input
                type="password"
                value={mode === 'reset-password' ? resetPassword : manualForm.password}
                onChange={(event) => {
                  if (mode === 'reset-password') {
                    setResetPassword(event.target.value);
                    return;
                  }

                  setManualForm((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }));
                }}
                minLength={6}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/30"
                required
              />
            </div>
          )}

          {mode === 'sign-in' && (
            <button
              type="button"
              onClick={() => {
                setMode('forgot-password');
                setError(null);
                setSuccess(null);
              }}
              className="text-sm text-[#1e3a8a] hover:text-[#1e40af]"
            >
              Forgot password?
            </button>
          )}

          {mode === 'forgot-password' && (
            <button
              type="button"
              onClick={() => {
                setMode('sign-in');
                setError(null);
                setSuccess(null);
              }}
              className="text-sm text-[#1e3a8a] hover:text-[#1e40af]"
            >
              Back to sign in
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-60"
          >
            {isSubmitting
              ? 'Please wait...'
              : mode === 'sign-up'
                ? 'Create Account'
                : mode === 'forgot-password'
                  ? 'Send Reset Link'
                  : mode === 'reset-password'
                    ? 'Update Password'
                    : 'Sign In'}
          </button>
        </form>

        {mode !== 'forgot-password' && mode !== 'reset-password' && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px bg-gray-200 flex-1" />
              <span className="text-xs uppercase tracking-wide text-gray-500">Or</span>
              <div className="h-px bg-gray-200 flex-1" />
            </div>

            <GoogleLoginButton
              redirectPath={redirectPath}
              onError={(message) => {
                setError(message);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
