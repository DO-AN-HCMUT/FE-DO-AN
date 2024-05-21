import Image from 'next/image';

import Button from '../Button';

export default function Header() {
  return (
    <div className='fixed flex w-full items-center justify-between bg-[#3c3c3c] p-4'>
      <Image src='/images/logo.png' alt='logo' width={40} height={40} className='' />
      <div className='flex'>
        <Button className='me-4' onClick={() => {}}>
          + New Project
        </Button>
        <Image src='/images/header/bell.png' alt='notification' width={40} height={40} className='me-2' />
        <Image src='/images/header/avatar.jpeg' alt='profile' width={40} height={40} className='rounded-full' />
      </div>
    </div>
  );
}
