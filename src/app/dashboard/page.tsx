'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, User, FileText, Settings, LogOut } from 'lucide-react';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
            </div>
            <button
              onClick={() => router.push('/logout')}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-blue-50 rounded-lg">
              <User className="text-blue-600 mb-2" size={24} />
              <h3 className="font-semibold text-gray-900">Profile</h3>
              <p className="text-sm text-gray-600 mt-1">{user?.email}</p>
              {user?.mobileNumber && (
                <p className="text-sm text-gray-600">{user.mobileNumber}</p>
              )}
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <FileText className="text-green-600 mb-2" size={24} />
              <h3 className="font-semibold text-gray-900">Provider</h3>
              <p className="text-sm text-gray-600 mt-1 capitalize">{user?.provider}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => router.push('/catalogue')}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <LayoutDashboard className="text-[#1e3a8a] mb-3" size={32} />
            <h3 className="font-bold text-gray-900 text-lg mb-2">Browse Catalogue</h3>
            <p className="text-gray-600 text-sm">Explore companies by category</p>
          </button>

          <button
            onClick={() => router.push('/add-data')}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <FileText className="text-[#1e3a8a] mb-3" size={32} />
            <h3 className="font-bold text-gray-900 text-lg mb-2">Add Data</h3>
            <p className="text-gray-600 text-sm">Submit company information</p>
          </button>

          <button
            onClick={() => router.push('/collaborate')}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <Settings className="text-[#1e3a8a] mb-3" size={32} />
            <h3 className="font-bold text-gray-900 text-lg mb-2">Collaborate</h3>
            <p className="text-gray-600 text-sm">Partner with us</p>
          </button>
        </div>
      </div>
    </div>
  );
}
