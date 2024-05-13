'use client';

import Image from 'next/image';

import Button from '@/components/Button';
import TextInput from '@/components/TextInput';
import AuthType from '@/types/authType';

type AuthModalProps = {
  type: AuthType;
};

export default function AuthModal({ type }: AuthModalProps) {
  const title = type === AuthType.SIGN_IN ? 'Sign In' : AuthType.SIGN_UP ? 'Sign Up' : null;

  return (
    <div className='flex h-1/2 w-1/2 justify-between rounded-2xl bg-white p-20'>
      <div>
        <Image src='/images/auth/calendar.png' alt='' width={100} height={100} className='mb-4' />
        <p className='text-6xl font-bold leading-normal text-[#414141]'>{title}</p>
      </div>
      <div className='flex w-3/5 flex-col items-stretch justify-between'>
        <div className='flex grow flex-col justify-center'>
          <TextInput className='mb-8' placeholder='Email' value='' onChange={() => {}} type='text' />
          <TextInput placeholder='Password' value='' onChange={() => {}} type='password' />
          {type === AuthType.SIGN_UP && (
            <TextInput className='mt-8' placeholder='Confirm Password' value='' onChange={() => {}} type='password' />
          )}
        </div>
        <div className='self-end'>
          <Button type='neutral-positive' className='me-4' onClick={() => {}}>
            Sign Up
          </Button>
          <Button type='positive' onClick={() => {}}>
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
}
