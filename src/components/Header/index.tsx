'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';

import AuthContext from '@/contexts/auth';

type HeaderProps = {
  socket?: any;
};
export default function Header(props: HeaderProps) {
  const { socket } = props;

  const { signOut } = useContext(AuthContext);
  const handleSignOut = () => {
    if (socket) {
      socket.disconnect();
    }
    signOut();
  };
  return (
    <div className='flex w-full items-center justify-between bg-[#3c3c3c] p-4'>
      <div className='flex items-center'>
        <Image src='/images/logo.png' alt='logo' width={40} height={40} className='me-3' />
        <h1 className='text-xl font-bold text-white'>TMS</h1>
      </div>
      <div className='flex'>
        {/* <Image src='/images/header/bell.png' alt='notification' width={40} height={40} className='me-4' /> */}
        <Link href='/profile' className='mr-3 rounded-full p-1 hover:bg-sky-500'>
          <Image src='/images/header/account.svg' alt='profile' width={32} height={32} className='rounded-full' />
        </Link>
        <Image
          src='/icons/logout.svg'
          alt=''
          width={32}
          height={32}
          className='hover:cursor-pointer'
          onClick={() => handleSignOut()}
        />
      </div>
    </div>
  );
}
