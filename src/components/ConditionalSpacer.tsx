'use client';

import { usePathname } from 'next/navigation';

export default function ConditionalSpacer() {
  const pathname = usePathname();
  
  // Only add spacing on home page (where the header exists)
  if (pathname !== '/') return null;
  
  return <div className="md:hidden h-[58px]"></div>;
}
