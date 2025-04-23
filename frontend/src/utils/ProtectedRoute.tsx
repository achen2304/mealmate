'use client';

import { useAuth } from '@/context/userAuth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { isProtectedRoute } from './authRedirect';

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user && isProtectedRoute(pathname)) {
        router.push('/redirect');
      }
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading || (!user && isProtectedRoute(pathname))) {
    return null;
  }

  return <>{children}</>;
}
