'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Send, CheckCircle, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { submissionsAPI, categoriesAPI } from '@/lib/api';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/components/AuthProvider';

export default function AddDataPage() {
  return (
    <ProtectedRoute>
      <AddDataContent />
    </ProtectedRoute>
  );
}

function AddDataContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    category: '',
    description: '',
    products: '',
    certifications: '',
    gstNumber: ''
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [visitingCard, setVisitingCard] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoriesAPI.getAll();
        setCategories(res.categories.map((c: any) => c.name));
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([
          'Yarn', 'Fabric Suppliers', 'Knitting', 'Buying Agents', 'Printing',
          'Threads', 'Trims & Accessories', 'Dyes & Chemicals', 'Machineries', 'Machine Spares'
        ]);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  };

  const handleVisitingCardSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setVisitingCard(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let visitingCardData = null;
      
      // Convert visiting card to base64 if exists
      if (visitingCard) {
        const reader = new FileReader();
        visitingCardData = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(visitingCard);
        });
      }

      const attachments = visitingCard
        ? [{ 
            name: visitingCard.name, 
            type: visitingCard.type, 
            size: visitingCard.size, 
            purpose: 'visiting-card',
            data: visitingCardData
          }]
        : [];

      const submissionData = {
        type: 'add-data',
        userId: user?.id || '',
        formData: {
          companyName: formData.companyName,
          contactPerson: formData.contactPerson,
          email: formData.email,
          phone: formData.phone,
          website: formData.website,
          address: formData.address,
          category: formData.category,
          description: formData.description,
          products: formData.products,
          certifications: formData.certifications,
          gstNumber: formData.gstNumber,
          visitingCardName: visitingCard?.name || ''
        },
        attachments
      };
      
      await submissionsAPI.create(submissionData);
      setSubmitStatus('success');
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      setTimeout(() => {
        setFormData({
          companyName: '', contactPerson: '', email: '', phone: '',
          website: '', address: '', category: '', description: '',
          products: '', certifications: '', gstNumber: ''
        });
        setSelectedFiles([]);
        setVisitingCard(null);
        setSubmitStatus('idle');
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 pb-20 md:pb-8">
      {/* Header - Hides on scroll down, shows on scroll up */}
      <div className={`bg-white shadow-sm fixed top-0 left-0 right-0 z-40 transition-transform duration-300 ${
        isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-700 hover:text-[#1e3a8a] transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Add Your Data</h1>
            <p className="text-gray-600 mt-2 text-sm md:text-base">Submit your company information to be listed in our directory</p>
          </div>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-[140px]"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Information</h2>
          
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="text-green-600" size={20} />
              <div>
                <p className="text-green-800 font-medium">Data Submitted Successfully!</p>
                <p className="text-green-600 text-sm">Your information will be reviewed and added to our directory within 2-3 business days.</p>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">Submission Failed</p>
              <p className="text-red-600 text-sm">Please try again or contact support if the problem persists.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name *</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Person *</label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none text-gray-900"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none text-gray-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Business Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none text-gray-900"
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Website URL</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none text-gray-900"
                  placeholder="https://yourwebsite.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Products/Services</label>
                <input
                  type="text"
                  name="products"
                  value={formData.products}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none text-gray-900"
                  placeholder="e.g., Cotton Yarn, Polyester Fabric, etc."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Business Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none text-gray-900 resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Company Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none text-gray-900 resize-none"
                placeholder="Describe your company, services, and expertise..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Visiting Card Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleVisitingCardSelect}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none text-gray-900"
              />
              {visitingCard && (
                <p className="mt-2 text-sm text-gray-600">Selected: {visitingCard.name}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white font-bold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send size={20} />
                  <span>Submit for Review</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
