'use client';

import { usePathname } from 'next/navigation';
import MobileHeader from './MobileHeader';
import NotificationIcon from './NotificationIcon';

export function LayoutComponents() {
  const pathname = usePathname();
  
  // Don't show any mobile components on sign-in page
  if (pathname === '/sign-in') {
    return null;
  }
  
  return (
    <>
      <MobileHeader />
      <NotificationIcon />
    </>
  );
}
