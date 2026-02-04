import { books } from '@/data/books';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function BooksPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">Our Books</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {books.map((book, index) => (
            <Link key={index} href={`/books/${book.id}`}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow flex flex-col cursor-pointer">
                <div className={`h-48 ${book.color} flex items-center justify-center p-6 text-white`}>
                   <BookOpen size={64} opacity={0.8} />
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{book.title}</h3>
                  <p className="text-gray-500 mb-4">{book.edition}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">₹{book.price}</span>
                    <button className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1e3a8a]/90 transition-colors">
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
