'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { isUserSignedIn } from '@/lib/userSession';

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    setSignedIn(isUserSignedIn());
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-md hidden md:block transition-transform duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image 
                src="/logo.jpg" 
                alt="Logo" 
                width={120} 
                height={50} 
                className="h-12 w-auto object-contain"
                priority
              />
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-[#1e3a8a] font-medium transition-colors">Home</Link>
            <Link href="/catalogue" className="text-gray-700 hover:text-[#1e3a8a] font-medium transition-colors">Catalogue</Link>
            <Link href="/about" className="text-gray-700 hover:text-[#1e3a8a] font-medium transition-colors">About Us</Link>
            <Link href="/contact" className="text-gray-700 hover:text-[#1e3a8a] font-medium transition-colors">Contact Us</Link>
            {signedIn ? (
              <Link href="/logout" className="text-gray-700 hover:text-[#1e3a8a] font-medium transition-colors">Logout</Link>
            ) : (
              <Link href="/sign-in" className="text-gray-700 hover:text-[#1e3a8a] font-medium transition-colors">Sign In</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
