'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';

import Button from '@/components/Button';
import TextInput from '@/components/TextInput';

export default function SignIn() {
  const [input, setInput] = useState({ email: '', password: '' });

  const router = useRouter();

  const handleSignIn = useCallback(() => {
    /* eslint-disable-next-line no-console */
    console.log(input);
  }, [input]);

  return (
    <>
      <div>
        <Image src='/images/auth/calendar.png' alt='' width={100} height={100} className='mb-4' />
        <p className='text-6xl font-bold leading-normal text-[#414141]'>Sign In</p>
      </div>
      <div className='flex w-3/5 flex-col items-stretch justify-between'>
        <div className='flex grow flex-col justify-center'>
          <TextInput
            className='mb-8'
            placeholder='Email'
            value={input.email}
            onInput={(email) => {
              setInput({ ...input, email });
            }}
            type='text'
          />
          <TextInput
            placeholder='Password'
            value={input.password}
            onInput={(password) => {
              setInput({ ...input, password });
            }}
            type='password'
          />
        </div>
        <div className='self-end'>
          <Button
            type='neutral-positive'
            className='me-4'
            onClick={() => {
              router.push('/auth/sign-up');
            }}
          >
            Sign Up
          </Button>
          <Button type='positive' onClick={handleSignIn}>
            Sign In
          </Button>
        </div>
      </div>
    </>
  );
}
