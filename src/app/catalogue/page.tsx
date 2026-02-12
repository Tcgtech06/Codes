'use client';

import { 
  Scissors, 
  Layers, 
  Shirt, 
  Users, 
  Printer, 
  Droplet, 
  Settings, 
  Wrench
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { categoriesAPI } from '@/lib/api';

const iconMap: any = {
  'Yarn': Layers,
  'Fabric': Scissors,
  'Knitting': Shirt,
  'Buying Agents': Users,
  'Printing': Printer,
  'Threads': Layers,
  'Trims': Scissors,
  'Dyes': Droplet,
  'Machineries': Settings,
  'Spares': Wrench,
};

const colorMap: any = {
  'Yarn': 'bg-blue-100 text-blue-600',
  'Fabric': 'bg-green-100 text-green-600',
  'Knitting': 'bg-purple-100 text-purple-600',
  'Buying Agents': 'bg-orange-100 text-orange-600',
  'Printing': 'bg-yellow-100 text-yellow-600',
  'Threads': 'bg-pink-100 text-pink-600',
  'Trims': 'bg-red-100 text-red-600',
  'Dyes': 'bg-indigo-100 text-indigo-600',
  'Machineries': 'bg-teal-100 text-teal-600',
  'Spares': 'bg-gray-100 text-gray-600',
};

export default function Catalogue() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoriesAPI.getAll();
        setCategories(res.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Full Catalogue</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Full Catalogue</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {categories.map((category) => {
            const Icon = iconMap[category.name] || Layers;
            const color = colorMap[category.name] || 'bg-gray-100 text-gray-600';
            return (
              <Link key={category.id} href={`/catalogue/${category.slug}`} className="group">
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col items-center text-center border border-gray-100 h-full">
                  <div className={`p-4 rounded-full mb-4 ${color} bg-opacity-20`}>
                    <Icon size={32} className={color.split(' ')[1]} />
                  </div>
                  <span className="font-semibold text-lg text-gray-800 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </span>
                  {category.count > 0 && (
                    <span className="text-sm text-gray-500 mt-1">
                      {category.count} companies
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
