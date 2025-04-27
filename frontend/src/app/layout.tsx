import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { MuiProvider } from '@/lib/MuiTheme';
import { AuthProvider } from '@/context/userAuth';
import { CartProvider } from '@/context/cartContext';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/utils/ProtectedRoute';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'MealMate',
  description: 'AI-powered recipe and grocery helper',
  keywords: 'recipes, meal planning, grocery, AI',
  authors: [{ name: 'Cai Chen' }, { name: 'Megan Chng' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <MuiProvider>
          <AuthProvider>
            <CartProvider>
            <Navbar />
            <ProtectedRoute>{children}</ProtectedRoute>
            </CartProvider>
          </AuthProvider>
        </MuiProvider>
      </body>
    </html>
  );
}
