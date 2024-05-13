'use client';

import { ReactNode } from 'react';

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex h-screen items-center justify-center bg-[url('/images/auth/background.jpeg')]">{children}</div>
  );
}
