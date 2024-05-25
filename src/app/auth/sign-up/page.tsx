'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';

import Button from '@/components/Button';
import TextInput from '@/components/TextInput';

export default function SignUp() {
  const [input, setInput] = useState({ email: '', password: '', confirmPassword: '' });

  const handleSignUp = useCallback(() => {
    /* eslint-disable-next-line no-console */
    console.log(input);
  }, [input]);

  return (
    <>
      <div>
        <Image src='/images/auth/calendar.png' alt='' width={100} height={100} className='mb-4' />
        <p className='text-6xl font-bold leading-normal text-[#414141]'>Sign Up</p>
      </div>
      <div className='flex w-3/5 flex-col items-stretch justify-between'>
        <div className='flex grow flex-col justify-center'>
          <TextInput
            className='mb-8'
            placeholder='Email'
            value={input.email}
            onInput={(email) => setInput({ ...input, email })}
            type='text'
          />
          <TextInput
            placeholder='Password'
            value={input.password}
            onInput={(password) => setInput({ ...input, password })}
            type='password'
          />
          <TextInput
            className='mt-8'
            placeholder='Confirm Password'
            value={input.confirmPassword}
            onInput={(confirmPassword) => setInput({ ...input, confirmPassword })}
            type='password'
          />
        </div>
        <div className='self-end'>
          <Button type='neutral-positive' className='me-4' onClick={() => {}}>
            Sign In
          </Button>
          <Button type='positive' onClick={handleSignUp}>
            Sign Up
          </Button>
        </div>
      </div>
    </>
  );
}
