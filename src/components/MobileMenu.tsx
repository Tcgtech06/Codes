'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();
  const signedIn = Boolean(user);
  const displayName = user?.name?.trim() || user?.email?.split('@')[0] || 'User';

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleLogout = async () => {
    await signOut();
    setIsOpen(false);
    router.push('/');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        <Menu size={24} className="text-gray-700" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-0 left-0 bottom-0 w-80 bg-white z-50 md:hidden shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">Menu</h2>
              <button onClick={() => setIsOpen(false)} className="p-2">
                <X size={24} className="text-gray-700" />
              </button>
            </div>

            {signedIn && (
              <div className="p-4 bg-[#1e3a8a]/5 border-b flex items-center gap-3">
                <div className="w-12 h-12 bg-[#1e3a8a] rounded-full flex items-center justify-center">
                  <User size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Welcome</p>
                  <p className="font-semibold text-gray-900">{displayName}</p>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto py-4">
              <nav className="space-y-1 px-2">
                {!signedIn && (
                  <>
                    <Link
                      href="/sign-in"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <User size={20} />
                      <span className="font-medium">Sign In</span>
                    </Link>
                    <Link
                      href="/sign-up"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <User size={20} />
                      <span className="font-medium">Sign Up</span>
                    </Link>
                  </>
                )}
              </nav>
            </div>

            <div className="border-t">
              {signedIn && (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-6 py-4 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Logout</span>
                </button>
              )}
              <div className="px-6 py-4 text-center text-sm text-gray-500 border-t">
                Powered by <span className="font-semibold">TCG Technologies</span>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
