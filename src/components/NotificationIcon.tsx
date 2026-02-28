'use client';

import { useState, useEffect } from 'react';
import { X, User, LogOut, Megaphone, Database, Handshake, Bell, Building2, MessageSquare, Megaphone as AdIcon } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function NotificationIcon() {
  const [isOpen, setIsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const signedIn = Boolean(user);
  const displayName = user?.name?.trim() || user?.email?.split('@')[0] || 'User';

  // Only show on home page
  const isHomePage = pathname === '/';

  // Mock notifications data - replace with actual API call
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'company', message: 'New company "ABC Textiles" added to the directory', time: '2 hours ago' },
    { id: 2, type: 'collaboration', message: 'New collaboration request from "XYZ Fabrics"', time: '5 hours ago' },
    { id: 3, type: 'advertisement', message: 'New advertisement enquiry received', time: '1 day ago' },
  ]);

  useEffect(() => {
    if (isOpen || isNotificationOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isNotificationOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleLogout = async () => {
    await signOut();
    setIsOpen(false);
    router.push('/');
  };

  const handleNotificationOpen = () => {
    setIsNotificationOpen(true);
    // Mark notifications as read when panel opens
    setHasUnreadNotifications(false);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setHasUnreadNotifications(false);
  };

  const clearNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (notifications.length <= 1) {
      setHasUnreadNotifications(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'company':
        return <Building2 size={20} className="text-blue-600" />;
      case 'collaboration':
        return <MessageSquare size={20} className="text-green-600" />;
      case 'advertisement':
        return <AdIcon size={20} className="text-orange-600" />;
      default:
        return <Bell size={20} className="text-gray-600" />;
    }
  };

  if (!isHomePage) return null;

  return (
    <>
      {/* Header bar with Profile Icon, Notification Bell, and Logo */}
      <div className={`md:hidden fixed top-0 left-0 right-0 z-[70] bg-white shadow-md px-4 py-3 flex items-center justify-between transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-lg relative"
          >
            <User size={24} className="text-gray-700" />
          </button>
          
          <button
            onClick={handleNotificationOpen}
            className="p-2 rounded-lg relative"
          >
            <Bell size={24} className="text-gray-700" />
            {hasUnreadNotifications && notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications.length > 9 ? '9+' : notifications.length}
              </span>
            )}
          </button>
        </div>
        
        <Link href="/" className="flex items-center">
          <img
            src="/logo.jpg"
            alt="Logo"
            className="h-10 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Profile Menu Panel */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[65] md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-0 left-0 bottom-0 w-80 bg-white z-[70] md:hidden shadow-xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">Menu</h2>
              <button onClick={() => setIsOpen(false)} className="p-2">
                <X size={24} className="text-gray-700" />
              </button>
            </div>

            {/* Profile Section */}
            <div className="p-4 bg-gray-50 border-b">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#1e3a8a] rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  {signedIn ? (
                    <p className="font-semibold text-gray-900">Welcome {displayName} to Knitinfo Online Directory</p>
                  ) : (
                    <p className="font-semibold text-gray-900">Welcome to Knitinfo Online Directory</p>
                  )}
                </div>
              </div>

              {/* Sign In / Sign Up buttons - Only show when NOT signed in */}
              {!signedIn && (
                <div className="space-y-2">
                  <Link
                    href="/sign-in"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#1e3a8a]/90 transition-colors font-medium"
                  >
                    <User size={18} />
                    <span>Login</span>
                  </Link>
                  <Link
                    href="/sign-in?mode=sign-up"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border-2 border-[#1e3a8a] text-[#1e3a8a] rounded-lg hover:bg-[#1e3a8a]/5 transition-colors font-medium"
                  >
                    <User size={18} />
                    <span>Sign Up</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Spacer - centers the menu items */}
            <div className="flex-1"></div>

            {/* Menu Items - centered */}
            <div className="py-4">
              <nav className="space-y-4 px-4">
                <Link
                  href="/advertise"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-[#1e3a8a] rounded-lg transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <Megaphone size={20} className="text-[#1e3a8a]" />
                  <span>Advertise with us</span>
                </Link>

                <Link
                  href="/add-data"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-[#1e3a8a] rounded-lg transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <Database size={20} className="text-[#1e3a8a]" />
                  <span>Add your data</span>
                </Link>

                <Link
                  href="/collaborate"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-[#1e3a8a] rounded-lg transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <Handshake size={20} className="text-[#1e3a8a]" />
                  <span>Collaborate With Us</span>
                </Link>
              </nav>
            </div>

            {/* Spacer - centers the menu items */}
            <div className="flex-1"></div>

            {/* Footer */}
            <div className="border-t">
              {signedIn && (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 text-red-600 hover:bg-red-50 transition-colors font-medium border-b"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              )}
              <a
                href="https://tcgtech.in"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-6 py-4 text-center text-sm hover:bg-gray-50 transition-colors"
              >
                <p className="text-gray-600 mb-1">Powered by</p>
                <p className="font-semibold text-lg">
                  <span className="text-red-600">T</span>
                  <span className="text-green-600">C</span>
                  <span className="text-yellow-600">G</span>
                  <span className="text-blue-600"> TECHNOLOGIES</span>
                </p>
              </a>
            </div>
          </div>
        </>
      )}

      {/* Notification Panel - Opens from top to half page */}
      {isNotificationOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[75] md:hidden"
            onClick={() => setIsNotificationOpen(false)}
          />
          <div className="fixed top-0 left-0 right-0 h-[50vh] bg-white z-[80] md:hidden shadow-xl flex flex-col rounded-b-3xl animate-slide-down">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
              <button onClick={() => setIsNotificationOpen(false)} className="p-2">
                <X size={24} className="text-gray-700" />
              </button>
            </div>

            {/* Clear All Button */}
            {notifications.length > 0 && (
              <div className="px-4 py-2 border-b bg-gray-50">
                <button
                  onClick={clearAllNotifications}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 px-4">
                  <Bell size={48} className="mb-4 opacity-50" />
                  <p className="text-center text-lg">Currently No notifications</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 font-medium">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                        <button
                          onClick={() => clearNotification(notification.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slide-down {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
