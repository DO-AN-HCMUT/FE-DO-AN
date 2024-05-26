import Image from 'next/image';
import { useContext } from 'react';

import AuthContext from '@/contexts/auth';

import Button from '../Button';

export default function Header() {
  const { signOut } = useContext(AuthContext);

  return (
    <div className='fixed flex w-full items-center justify-between bg-[#3c3c3c] p-4'>
      <Image src='/images/logo.png' alt='logo' width={40} height={40} className='' />
      <div className='flex'>
        <Button className='me-4' onClick={() => {}}>
          + New Project
        </Button>
        <Image src='/images/header/bell.png' alt='notification' width={40} height={40} className='me-4' />
        <Image src='/images/header/avatar.jpeg' alt='profile' width={40} height={40} className='me-4 rounded-full' />
        <Image
          src='/icons/logout.svg'
          alt=''
          width={40}
          height={40}
          className='hover:cursor-pointer'
          onClick={() => signOut()}
        />
      </div>
    </div>
  );
}
