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

const categories = [
  { name: 'Yarn', icon: Layers, color: 'bg-blue-100 text-blue-600' },
  { name: 'Fabric Suppliers', icon: Scissors, color: 'bg-green-100 text-green-600' },
  { name: 'Knitting', icon: Shirt, color: 'bg-purple-100 text-purple-600' },
  { name: 'Buying Agents', icon: Users, color: 'bg-orange-100 text-orange-600' },
  { name: 'Printing', icon: Printer, color: 'bg-yellow-100 text-yellow-600' },
  { name: 'Threads', icon: Layers, color: 'bg-pink-100 text-pink-600' }, 
  { name: 'Trims & Accessories', icon: Scissors, color: 'bg-red-100 text-red-600' },
  { name: 'Dyes & Chemicals', icon: Droplet, color: 'bg-indigo-100 text-indigo-600' },
  { name: 'Machineries', icon: Settings, color: 'bg-teal-100 text-teal-600' },
  { name: 'Machine Spares', icon: Wrench, color: 'bg-gray-100 text-gray-600' },
];

export default function Catalogue() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Full Catalogue</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <Link key={index} href={`/catalogue/${category.name.toLowerCase().replace(/ /g, '-')}`} className="group">
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col items-center text-center border border-gray-100 h-full">
                <div className={`p-4 rounded-full mb-4 ${category.color} bg-opacity-20`}>
                  <category.icon size={32} className={category.color.split(' ')[1]} />
                </div>
                <span className="font-semibold text-lg text-gray-800 group-hover:text-blue-600 transition-colors">{category.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
