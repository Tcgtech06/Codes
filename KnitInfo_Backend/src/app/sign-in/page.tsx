'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { localStorageService } from '@/lib/localStorage';
import { setUserSession } from '@/lib/userSession';

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    state: '',
    district: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    localStorageService.addFormSubmission({
      type: 'signin',
      formData: {
        ...formData,
        provider: 'manual'
      }
    });

    setUserSession({
      ...formData,
      signedInAt: new Date().toISOString(),
      provider: 'manual',
    });

    await new Promise((resolve) => setTimeout(resolve, 600));
    setSuccess(true);
    setSubmitting(false);

    setTimeout(() => {
      setSuccess(false);
      setFormData({
        name: '',
        email: '',
        mobileNumber: '',
        state: '',
        district: ''
      });
      const redirect =
        typeof window !== 'undefined'
          ? new URLSearchParams(window.location.search).get('redirect') || '/'
          : '/';
      router.push(redirect);
    }, 1800);
  };

  const handleGoogleSignIn = () => {
    if (typeof window !== 'undefined') {
      window.location.href = 'https://accounts.google.com/signin';
    }
  };

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
        <p className="text-gray-600 mt-1 mb-6">Enter your details to continue.</p>

        {success && (
          <div className="mb-5 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
            <CheckCircle size={18} />
            <span>Signed in details submitted successfully.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number *</label>
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
              <input
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">District *</label>
              <input
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60"
          >
            {submitting ? 'Submitting...' : 'Sign In'}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-sm text-gray-500">or</span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full border border-gray-300 hover:border-gray-400 text-gray-800 font-medium py-3 rounded-lg transition-colors"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
