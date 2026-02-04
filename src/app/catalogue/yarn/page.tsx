'use client';

import { useState } from 'react';
import { Search, Filter, Phone, MapPin, Package } from 'lucide-react';
import Link from 'next/link';
import { usePriorities, useCompanies } from '../../../hooks/useFirebaseData';

const sampleCompanies = [
  {
    id: 1,
    name: 'ABC Textiles Ltd',
    address: '123 Industrial Area, Tirupur, Tamil Nadu',
    contact: '+91 9876543210',
    products: ['Cotton Yarn', 'Polyester Yarn', 'Blended Yarn']
  },
  {
    id: 2,
    name: 'Global Yarn Suppliers',
    address: '789 Export Zone, Chennai, Tamil Nadu',
    contact: '+91 9876543212',
    products: ['Organic Cotton', 'Recycled Yarn', 'Specialty Yarn']
  },
  {
    id: 3,
    name: 'Premium Textiles Co',
    address: '321 Market Street, Erode, Tamil Nadu',
    contact: '+91 9876543213',
    products: ['Premium Cotton', 'Silk Blend', 'Luxury Yarn']
  },
];

export default function YarnPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCity, setSelectedCity] = useState('all');
  
  // Use Firebase hooks
  const { priorities, loading: prioritiesLoading } = usePriorities('Yarn');
  const { companies: firebaseCompanies, loading: companiesLoading } = useCompanies('Yarn');

  // Use Firebase companies if available, otherwise fall back to sample data
  const companies = firebaseCompanies.length > 0 ? firebaseCompanies.map(company => ({
    id: company.id || '',
    name: company.companyName,
    address: company.address,
    contact: company.phone,
    products: company.products
  })) : sampleCompanies;

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.products.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCity = selectedCity === 'all' || company.address.toLowerCase().includes(selectedCity.toLowerCase());
    
    return matchesSearch && matchesCity;
  });

  // Sort companies by priority
  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    const aPriority = priorities.find(p => 
      p.companyName.toLowerCase() === a.name.toLowerCase() && 
      p.category.toLowerCase() === 'yarn' &&
      p.status === 'active' &&
      (!p.expiresAt || new Date() < new Date(p.expiresAt.toDate())) // Check if not expired
    );
    const bPriority = priorities.find(p => 
      p.companyName.toLowerCase() === b.name.toLowerCase() && 
      p.category.toLowerCase() === 'yarn' &&
      p.status === 'active' &&
      (!p.expiresAt || new Date() < new Date(p.expiresAt.toDate())) // Check if not expired
    );

    // If both have priority, sort by position
    if (aPriority && bPriority) {
      return aPriority.position - bPriority.position;
    }
    // If only a has priority, a comes first
    if (aPriority && !bPriority) {
      return -1;
    }
    // If only b has priority, b comes first
    if (!aPriority && bPriority) {
      return 1;
    }
    // If neither has priority, maintain original order
    return 0;
  });

  const cities = ['all', 'Tirupur', 'Coimbatore', 'Chennai', 'Erode', 'Karur'];

  if (prioritiesLoading || companiesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a8a] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading catalogue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/catalogue" className="text-sm text-blue-600 mb-2 inline-block">← Back to Catalogue</Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Yarn</h1>
          
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, location, or products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`px-4 py-2 border rounded-lg flex items-center gap-2 transition-colors ${
                showFilter ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'
              }`}
            >
              <Filter size={20} />
              <span className="hidden sm:inline">Filter</span>
            </button>
          </div>

          {showFilter && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Filter by City</h3>
              <div className="flex flex-wrap gap-2">
                {cities.map(city => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCity === city
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {city === 'all' ? 'All Cities' : city}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <p className="text-gray-600 mb-4">
          {sortedCompanies.length} {sortedCompanies.length === 1 ? 'result' : 'results'} found
        </p>

        <div className="space-y-4">
          {sortedCompanies.map((company) => {
            const priority = priorities.find(p => 
              p.companyName.toLowerCase() === company.name.toLowerCase() && 
              p.category.toLowerCase() === 'yarn' &&
              p.status === 'active' &&
              (!p.expiresAt || new Date() < new Date(p.expiresAt.toDate())) // Check if not expired
            );
            
            return (
            <div key={company.id} className={`bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow ${
              priority ? 'border-[#1e3a8a] ring-1 ring-[#1e3a8a]/20' : 'border-gray-200'
            }`}>
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-xl font-bold text-gray-900">{company.name}</h2>
                {priority && (
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 bg-[#1e3a8a] text-white rounded-full text-xs font-bold">
                      {priority.position}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      priority.priorityType === 'permanent' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {priority.priorityType === 'permanent' ? 'Featured' : 'Promoted'}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start gap-3 text-gray-600">
                  <MapPin size={18} className="mt-0.5 flex-shrink-0 text-blue-600" />
                  <span className="text-sm">{company.address}</span>
                </div>
                
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone size={18} className="flex-shrink-0 text-green-600" />
                  <a href={`tel:${company.contact}`} className="text-sm hover:text-blue-600">
                    {company.contact}
                  </a>
                </div>
                
                <div className="flex items-start gap-3 text-gray-600">
                  <Package size={18} className="mt-0.5 flex-shrink-0 text-purple-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 mb-1">Products:</p>
                    <div className="flex flex-wrap gap-2">
                      {company.products.map((product, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                        >
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>

        {sortedCompanies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No results found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
