'use client';

import { useState, useEffect } from 'react';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Star,
  Search,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { companiesAPI } from '@/lib/api';

interface CategoryPageClientProps {
  categorySlug: string;
  categoryName: string;
}

export default function CategoryPageClient({ categorySlug, categoryName }: CategoryPageClientProps) {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await companiesAPI.getByCategory(categoryName);
        setCompanies(res.companies || []);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, [categoryName]);

  const filteredCompanies = companies.filter(company =>
    company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.products?.some((p: string) => p.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 h-48"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/catalogue" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Catalogue
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{categoryName}</h1>
          <p className="text-gray-600 mt-2">
            {filteredCompanies.length} {filteredCompanies.length === 1 ? 'company' : 'companies'} found
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search companies, products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Companies List */}
        {filteredCompanies.length === 0 ? (
          <div className="text-center py-12">
            <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No companies found
            </h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'No companies in this category yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredCompanies.map((company) => (
              <div
                key={company.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {company.companyName}
                    </h3>
                    {company.contactPerson && (
                      <p className="text-gray-600 mb-2">
                        Contact: {company.contactPerson}
                      </p>
                    )}
                  </div>
                  {company.status === 'premium' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      <Star size={14} className="mr-1" />
                      Premium
                    </span>
                  )}
                </div>

                {company.description && (
                  <p className="text-gray-700 mb-4">{company.description}</p>
                )}

                {/* Products */}
                {company.products && company.products.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Products:</p>
                    <div className="flex flex-wrap gap-2">
                      {company.products.map((product: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                        >
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  {company.phone && (
                    <a
                      href={`tel:${company.phone}`}
                      className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Phone size={16} className="mr-2" />
                      <span className="text-sm">{company.phone}</span>
                    </a>
                  )}
                  {company.email && (
                    <a
                      href={`mailto:${company.email}`}
                      className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Mail size={16} className="mr-2" />
                      <span className="text-sm">{company.email}</span>
                    </a>
                  )}
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Globe size={16} className="mr-2" />
                      <span className="text-sm">Visit Website</span>
                    </a>
                  )}
                  {company.address && (
                    <div className="flex items-start text-gray-600">
                      <MapPin size={16} className="mr-2 mt-1 flex-shrink-0" />
                      <span className="text-sm">{company.address}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
