'use client';

import { redirect } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

import storage from '@/utils/storage';

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  const [isAuthStatusReady, setIsAuthStatusReady] = useState(false);

  useEffect(() => {
    if (storage.getItem('token')) {
      redirect('/');
    }
    setIsAuthStatusReady(true);
  }, []);

  if (!isAuthStatusReady) return null;

  return (
    <div className="flex h-screen items-center justify-center bg-[url('/images/auth/background.jpeg')]">
      <div className='flex h-1/2 w-1/2 justify-between rounded-2xl bg-white p-20'>{children}</div>
    </div>
  );
}
