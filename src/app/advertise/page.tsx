'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { submissionsAPI } from '@/lib/api';
import { getSignInRedirectUrl, isUserSignedIn } from '@/lib/userSession';
import { useAuth } from '@/components/AuthProvider';

export default function AdvertisePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    category: '',
    adType: '',
    budget: '',
    message: ''
  });
  const [visitingCard, setVisitingCard] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (!isUserSignedIn()) {
      router.replace(getSignInRedirectUrl('/advertise'));
      return;
    }

    setIsAuthorized(true);
  }, [router]);

  const categories = [
    'Yarn', 'Fabric Suppliers', 'Knitting', 'Buying Agents', 'Printing',
    'Threads', 'Trims & Accessories', 'Dyes & Chemicals', 'Machineries', 'Machine Spares'
  ];

  const adTypes = [
    'Banner Advertisement',
    'Featured Listing',
    'Premium Directory Placement',
    'Newsletter Sponsorship',
    'Homepage Spotlight'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleVisitingCardSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setVisitingCard(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const attachments = visitingCard
        ? [{ name: visitingCard.name, type: visitingCard.type, size: visitingCard.size, purpose: 'visiting-card' }]
        : [];

      await submissionsAPI.create({
        type: 'advertise',
        userId: user?.id || '',
        formData: {
          ...formData,
          visitingCardName: visitingCard?.name || ''
        },
        attachments,
      });

      setSubmitStatus('success');

      setTimeout(() => {
        setFormData({
          companyName: '', contactPerson: '', email: '', phone: '',
          website: '', category: '', adType: '', budget: '', message: ''
        });
        setVisitingCard(null);
        setSubmitStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Error submitting advertise form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40 md:top-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-700 hover:text-[#1e3a8a] transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Advertise With Us</h1>
            <p className="text-gray-600 mt-2">Promote your business to thousands of textile industry professionals</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Information Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Advertise With KnitInfo?</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Targeted Audience</h3>
                  <p className="text-gray-600 text-sm">Reach over 10,000+ textile industry professionals, manufacturers, and suppliers actively looking for your services.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📈</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Increased Visibility</h3>
                  <p className="text-gray-600 text-sm">Get featured prominently in search results and category listings to maximize your business exposure.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💼</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Business Growth</h3>
                  <p className="text-gray-600 text-sm">Connect with potential clients and partners to expand your business network and increase sales.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Analytics & Reports</h3>
                  <p className="text-gray-600 text-sm">Get detailed insights on your ad performance, views, clicks, and lead generation.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-[#1e3a8a]/5 rounded-lg">
              <h3 className="font-semibold text-[#1e3a8a] mb-2">Contact Information</h3>
              <p className="text-sm text-gray-600 mb-3">For immediate assistance or custom advertising solutions:</p>
              <div className="space-y-2 text-sm">
                <p><strong>Phone:</strong> +91 9943632229</p>
                <p><strong>Email:</strong> advertise@knitinfo.com</p>
                <p><strong>Business Hours:</strong> Mon-Fri, 9 AM - 6 PM IST</p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get Started Today</h2>
            
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle className="text-green-600" size={20} />
                <div>
                  <p className="text-green-800 font-medium">Request Submitted Successfully!</p>
                  <p className="text-green-600 text-sm">We&apos;ll contact you within 24 hours with advertising options.</p>
                </div>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Website URL</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Visiting Card Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleVisitingCardSelect}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none"
                  />
                  {visitingCard && (
                    <p className="mt-2 text-sm text-gray-600">Selected: {visitingCard.name}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Business Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Advertisement Type *</label>
                  <select
                    name="adType"
                    value={formData.adType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none"
                    required
                  >
                    <option value="">Select Ad Type</option>
                    {adTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Budget Range</label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none"
                >
                  <option value="">Select Budget Range</option>
                  <option value="$500-$1000">$500 - $1,000</option>
                  <option value="$1000-$2500">$1,000 - $2,500</option>
                  <option value="$2500-$5000">$2,500 - $5,000</option>
                  <option value="$5000+">$5,000+</option>
                  <option value="custom">Custom (Please specify in message)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none resize-none"
                  placeholder="Tell us about your advertising goals and any specific requirements..."
                />
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
                    <span>Submit Advertising Request</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}