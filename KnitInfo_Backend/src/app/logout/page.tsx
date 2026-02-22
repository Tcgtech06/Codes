'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clearUserSession } from '@/lib/userSession';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    clearUserSession();
    router.replace('/sign-in');
  }, [router]);

  return null;
}
