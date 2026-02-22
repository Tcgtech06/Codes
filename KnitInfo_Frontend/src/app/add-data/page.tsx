'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Send, CheckCircle, Upload, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { submissionsAPI, categoriesAPI } from '@/lib/api';

export default function AddDataPage() {
  const router = useRouter();
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
      const submissionData = {
        type: 'add-data',
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
        },
        attachments: [] // File uploads will be implemented later
      };
      
      await submissionsAPI.create(submissionData);
      setSubmitStatus('success');
      
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
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-900">Add Your Data</h1>
            <p className="text-gray-600 mt-2">Submit your company information to be listed in our directory</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Information Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Directory Benefits</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">🌐</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Online Presence</h3>
                    <p className="text-gray-600 text-xs">Get discovered by potential clients searching for your services.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">📞</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Direct Contact</h3>
                    <p className="text-gray-600 text-xs">Customers can reach you directly through our platform.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">🏆</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Industry Recognition</h3>
                    <p className="text-gray-600 text-xs">Build credibility in the textile industry network.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">📈</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Business Growth</h3>
                    <p className="text-gray-600 text-xs">Expand your customer base and increase sales.</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-[#1e3a8a]/5 rounded-lg">
                <h3 className="font-semibold text-[#1e3a8a] text-sm mb-2">Need Help?</h3>
                <div className="space-y-1 text-xs text-gray-600">
                  <p><strong>Phone:</strong> +91 9943632229</p>
                  <p><strong>Email:</strong> support@knitinfo.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2">
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
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">!</span>
                  </div>
                  <div>
                    <p className="text-red-800 font-medium">Submission Failed</p>
                    <p className="text-red-600 text-sm">Please try again or contact support if the problem persists.</p>
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

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">GST Number</label>
                  <input
                    type="text"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none"
                    placeholder="22AAAAA0000A1Z5"
                  />
                </div>

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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Business Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none resize-none"
                    required
                  />
                </div>

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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Company Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none resize-none"
                    placeholder="Describe your company, services, and expertise..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Products & Services</label>
                  <textarea
                    name="products"
                    value={formData.products}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none resize-none"
                    placeholder="List your main products and services..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Certifications & Awards</label>
                  <textarea
                    name="certifications"
                    value={formData.certifications}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent outline-none resize-none"
                    placeholder="ISO certifications, industry awards, etc..."
                  />
                </div>

                {/* Visiting Card Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Visiting Card</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#1e3a8a] transition-colors">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleVisitingCardSelect}
                      className="hidden"
                      id="visiting-card-upload"
                    />
                    <label
                      htmlFor="visiting-card-upload"
                      className="cursor-pointer text-[#1e3a8a] hover:text-[#1e3a8a]/80 font-medium"
                    >
                      {visitingCard ? visitingCard.name : 'Click to upload visiting card'}
                    </label>
                    <p className="text-sm text-gray-500 mt-1">
                      JPG, PNG, or PDF (Max 5MB)
                    </p>
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Supporting Documents</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#1e3a8a] transition-colors">
                    <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer text-[#1e3a8a] hover:text-[#1e3a8a]/80 font-medium"
                    >
                      Click to upload files
                    </label>
                    <p className="text-sm text-gray-500 mt-2">
                      Company brochure, certificates, product catalogs (PDF, DOC, Images)
                    </p>
                    {selectedFiles.length > 0 && (
                      <div className="mt-4 text-left">
                        <p className="text-sm font-medium text-gray-700 mb-2">Selected Files:</p>
                        {selectedFiles.map((file, index) => (
                          <p key={index} className="text-sm text-gray-600">• {file.name}</p>
                        ))}
                      </div>
                    )}
                  </div>
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
      </div>
    </div>
  );
}