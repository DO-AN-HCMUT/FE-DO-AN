import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';

import { AuthContextProvider } from '@/contexts/auth';

import Loading from './loading';

import type { Metadata } from 'next';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Task Management System',
  description: 'Capstone Project K20',
  icons: {
    icon: '/team.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <AuthContextProvider>
          <Suspense fallback={<Loading />}>
            <Toaster position='bottom-left' />
            {children}
          </Suspense>
        </AuthContextProvider>
      </body>
    </html>
  );
}
