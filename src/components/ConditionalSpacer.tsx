'use client';

import { usePathname } from 'next/navigation';

export default function ConditionalSpacer() {
  const pathname = usePathname();
  
  // Don't add spacing on home page or sign-in page
  if (pathname === '/' || pathname === '/sign-in') return null;
  
  return <div className="md:hidden h-[58px]"></div>;
}
