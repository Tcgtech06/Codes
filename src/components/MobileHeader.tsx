'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileHeader() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
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

  // Don't show on home page (it has its own header)
  if (pathname === '/') return null;

  return (
    <div className={`md:hidden fixed top-0 left-0 right-0 z-[60] bg-white shadow-md transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="flex items-center justify-center px-4 py-3">
        <Link href="/" className="flex items-center">
          <Image 
            src="/logo.jpg" 
            alt="KnitInfo Logo" 
            width={120} 
            height={50} 
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>
      </div>
    </div>
  );
}
