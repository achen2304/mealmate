// Auth redirect utility
import { redirect } from 'next/navigation';
import { User } from '@/context/userAuth';

/**
 * Check if user is authenticated, redirect to home if not
 * To be used in pages that require authentication
 */
export function requireAuth(user: User | null) {
  if (!user) {
    redirect('/');
  }
}

export const PROTECTED_ROUTES = [
  '/recipes',
  '/grocery',
  '/store',
  '/profile',
  '/settings',
];

export function isProtectedRoute(path: string): boolean {
  return PROTECTED_ROUTES.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );
}
