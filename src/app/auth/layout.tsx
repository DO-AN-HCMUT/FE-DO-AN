'use client';

import { ReactNode } from 'react';

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex h-screen items-center justify-center bg-[url('/images/auth/background.jpeg')]">
      <div className='flex h-1/2 w-1/2 justify-between rounded-2xl bg-white p-20'>{children}</div>
    </div>
  );
}
