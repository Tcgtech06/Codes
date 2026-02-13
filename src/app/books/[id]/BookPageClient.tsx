'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Book } from '@/data/books';

interface BookPageClientProps {
  book: Book;
}

export default function BookPageClient({ book }: BookPageClientProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Handle mobile browser back button
    const handlePopState = () => {
      // Check if there's history to go back to
      if (window.history.length > 1) {
        // Navigate back using Next.js router
        router.back();
      } else {
        // No history left, user can exit the app
        // This will naturally close the tab or go back to previous app
        window.history.back();
      }
    };

    // Handle scroll effect for header
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
    };

    // Add history entry for current page
    window.history.pushState({ page: 'book-detail' }, '', window.location.href);
    
    // Listen for popstate events (back/forward buttons)
    window.addEventListener('popstate', handlePopState);
    
    // Listen for scroll events
    window.addEventListener('scroll', handleScroll);

    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [router]);

  const handleWhatsAppOrder = () => {
    const message = `I Would Like to Buy this Book. Accept the Order and tell me the next step\n\nBook: ${book.title}\nEdition: ${book.edition}\nQuantity: ${quantity}\nPrice: ₹${book.price}\nTotal Price: ₹${book.price * quantity}`;
    const whatsappUrl = `https://wa.me/919943632229?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      {/* Back Button */}
      <div className={`bg-white shadow-sm sticky top-0 z-40 md:top-16 transition-opacity duration-300 ${isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-700 hover:text-[#1e3a8a] transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Book Image */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
            <div className="relative h-[400px] md:h-[500px]">
              <Image
                src={book.image}
                alt={book.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Book Details */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-[#1e3a8a]/10 text-[#1e3a8a] text-sm font-semibold rounded-full mb-3">
                {book.edition}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {book.title}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                {book.description}
              </p>
            </div>

            {/* Details List */}
            {book.details && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What&apos;s Inside:</h3>
                <ul className="space-y-2">
                  {book.details.map((detail, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-600">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Price */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-[#1e3a8a]">₹{book.price}</span>
                <span className="text-gray-500">per book</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={decrementQuantity}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-[#1e3a8a] hover:text-[#1e3a8a] transition-colors"
                >
                  <Minus size={20} />
                </button>
                <span className="text-2xl font-bold text-gray-900 w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-[#1e3a8a] hover:text-[#1e3a8a] transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {/* Total Price */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-700">Total Price:</span>
                <span className="text-3xl font-bold text-[#1e3a8a]">
                  ₹{book.price * quantity}
                </span>
              </div>
            </div>

            {/* Order Button */}
            <button
              onClick={handleWhatsAppOrder}
              className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-lg"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="currentColor"/>
              </svg>
              <span>Order via WhatsApp</span>
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Click to place an Order
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
