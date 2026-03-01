'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Star,
  Search,
  ArrowLeft,
  Filter,
  X
} from 'lucide-react';
import Link from 'next/link';
import { companiesAPI } from '@/lib/api';
import { localStorageService, Priority } from '@/lib/localStorage';

interface CategoryPageClientProps {
  categorySlug: string;
  categoryName: string;
}

export default function CategoryPageClient({ categorySlug, categoryName }: CategoryPageClientProps) {
  void categorySlug;
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [priorityMap, setPriorityMap] = useState<Map<string, number>>(new Map());

  const normalizeProducts = (products: unknown): string[] => {
    if (Array.isArray(products)) {
      return products.map((item) => String(item).trim()).filter(Boolean);
    }

    if (typeof products === 'string') {
      return products
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return [];
  };

  const normalizeCompany = useCallback(
    (company: any) => ({
      ...company,
      products: normalizeProducts(company.products)
    }),
    []
  );

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await companiesAPI.getByCategory(categoryName);
        console.log('=== PRODUCTS DEBUG ===');
        console.log('Fetched companies:', res.companies?.length, 'companies');
        console.log('First company:', res.companies?.[0]);
        console.log('First company products:', res.companies?.[0]?.products);
        console.log('Products type:', typeof res.companies?.[0]?.products);
        console.log('Is array?:', Array.isArray(res.companies?.[0]?.products));
        console.log('===================');
        setCompanies((res.companies || []).map(normalizeCompany));
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, [categoryName, normalizeCompany]);

  useEffect(() => {
    const priorities = localStorageService
      .getPriorities()
      .filter((priority: Priority) => priority.category.toLowerCase() === categoryName.toLowerCase());

    const nextMap = new Map<string, number>();
    priorities.forEach((priority: Priority) => {
      nextMap.set(priority.companyName.trim().toLowerCase(), priority.position);
    });

    setPriorityMap(nextMap);
  }, [categoryName]);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showFilter && !target.closest('.filter-container')) {
        setShowFilter(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilter]);

  const filteredCompanies = (() => {
    const searchedCompanies = companies.filter(company =>
      company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      normalizeProducts(company.products).some((p: string) => p.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Calculate data completeness score (0-6 based on 6 fields)
    const getCompletenessScore = (company: any) => {
      let score = 0;
      if (company.companyName) score++;
      if (company.phone) score++;
      if (company.address) score++;
      if (company.email) score++;
      if (company.products && Array.isArray(company.products) && company.products.length > 0) score++;
      if (company.website) score++;
      return score;
    };

    const sortByDate = (a: any, b: any) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    };

    const prioritizedCompanies = searchedCompanies
      .map((company) => ({
        company,
        priority: priorityMap.get(String(company.companyName || '').trim().toLowerCase()),
      }))
      .filter((item) => item.priority !== undefined)
      .sort((a, b) => {
        if (a.priority !== b.priority) {
          return (a.priority as number) - (b.priority as number);
        }

        return sortByDate(a.company, b.company);
      });

    const nonPrioritized = searchedCompanies
      .filter((company) => !priorityMap.has(String(company.companyName || '').trim().toLowerCase()))
      .sort((a, b) => {
        // First sort by data completeness (higher score first)
        const scoreA = getCompletenessScore(a);
        const scoreB = getCompletenessScore(b);
        
        if (scoreA !== scoreB) {
          return scoreB - scoreA; // Higher score first
        }
        
        // If same completeness score, sort by date
        return sortByDate(a, b);
      });

    const arranged = [...nonPrioritized];
    prioritizedCompanies.forEach(({ company, priority }) => {
      const targetIndex = Math.max(0, Math.min((priority as number) - 1, arranged.length));
      arranged.splice(targetIndex, 0, company);
    });

    return arranged;
  })();

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
          <div className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute right-3 md:right-auto md:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10" size={20} />
              <input
                type="text"
                placeholder="Search companies"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 md:pl-12 md:pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 relative"
              />
            </div>
            
            {/* Filter Button */}
            <div className="relative filter-container">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className={`p-3 border-2 rounded-lg transition-colors ${
                  showFilter 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-700 hover:border-blue-500'
                }`}
              >
                <Filter className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              
              {/* Filter Dropdown */}
              {showFilter && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">Sort By</h3>
                      <button
                        onClick={() => setShowFilter(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X size={18} />
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setSortOrder('newest');
                          setShowFilter(false);
                        }}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          sortOrder === 'newest'
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        New Companies
                      </button>
                      
                      <button
                        onClick={() => {
                          setSortOrder('oldest');
                          setShowFilter(false);
                        }}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          sortOrder === 'oldest'
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Old Companies
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
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
            {filteredCompanies.map((company, index) => {
              // Assign different colors to each company card
              const colors = [
                'bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500',
                'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500',
                'bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500',
                'bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-500',
                'bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500',
                'bg-gradient-to-r from-indigo-50 to-blue-50 border-l-4 border-indigo-500',
                'bg-gradient-to-r from-teal-50 to-cyan-50 border-l-4 border-teal-500',
                'bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500',
              ];
              const colorClass = colors[index % colors.length];
              
              return (
              <div
                key={company.id}
                className={`${colorClass} rounded-lg shadow-sm hover:shadow-md transition-shadow p-6`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {company.companyName}
                    </h3>
                    {company.contactPerson && (
                      <p className="text-gray-800 mb-2 font-medium">
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
                  <p className="text-gray-800 mb-4">{company.description}</p>
                )}

                {/* Products */}
                {company.products && Array.isArray(company.products) && company.products.length > 0 ? (
                  <div className="mb-4">
                    <p className="text-sm font-bold text-gray-900 mb-2">Products:</p>
                    <div className="flex flex-wrap gap-2">
                      {company.products.map((product: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-white/80 text-gray-900 rounded-full text-sm font-medium border border-gray-300"
                        >
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 text-xs text-gray-500">
                    {/* Debug: Products data: {JSON.stringify(company.products)} */}
                  </div>
                )}

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-300">
                  {company.phone && (
                    <a
                      href={`tel:${company.phone}`}
                      className="flex items-center text-gray-900 hover:text-blue-600 transition-colors font-medium"
                    >
                      <Phone size={16} className="mr-2 flex-shrink-0" />
                      <span className="text-sm truncate">{company.phone}</span>
                    </a>
                  )}
                  {company.email && (
                    <a
                      href={`mailto:${company.email}`}
                      className="flex items-center text-gray-900 hover:text-blue-600 transition-colors font-medium"
                    >
                      <Mail size={16} className="mr-2 flex-shrink-0" />
                      <span className="text-sm truncate">{company.email}</span>
                    </a>
                  )}
                  {company.address && (
                    <div className="flex items-start text-gray-900">
                      <MapPin size={16} className="mr-2 mt-1 flex-shrink-0" />
                      <span className="text-sm font-medium">{company.address}</span>
                    </div>
                  )}
                  {company.website && (
                    <a
                      href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-900 hover:text-blue-600 transition-colors font-medium"
                    >
                      <Globe size={16} className="mr-2 flex-shrink-0" />
                      <span className="text-sm truncate">{company.website}</span>
                    </a>
                  )}
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
