import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthProvider';
import { Toaster } from '@/components/ui/toaster';
import { NavBar } from '@/components/NavBar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'True Feedback',
  description: 'Real feedback from real people.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={inter.className} suppressHydrationWarning={true}>
          <NavBar />
          {children}
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
