'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useContext, useState } from 'react';
// import Button from '@/components/Button';
import toast from 'react-hot-toast';

import Button from '@/components/Button';
import TextInput from '@/components/TextInput';
import AuthContext from '@/contexts/auth';

export default function SignUp() {
  const [input, setInput] = useState({ displayName: '', email: '', password: '', confirmPassword: '' });

  const router = useRouter();
  const { signUp } = useContext(AuthContext);

  const handleSignUp = useCallback(async () => {
    if (!input.email || !input.password || !input.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (input.password !== input.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await signUp({ ...input, fullName: input.displayName });
      toast.success('Success');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error: any) {
      toast.error(typeof error?.response?.data == 'object' ? error?.response?.data.message : error?.message);
    }
  }, [input, router, signUp]);

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
            placeholder='Display Name'
            value={input.displayName}
            onInput={(displayName) => setInput({ ...input, displayName })}
            type='text'
          />
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
        <div className='mt-8 flex w-full flex-row items-center justify-end'>
          <Button
            className='me-4'
            type='neutral-positive'
            onClick={() => {
              router.push('/auth/sign-in');
            }}
          >
            Sign In
          </Button>
          <Button onClick={handleSignUp}>Sign Up</Button>
        </div>
      </div>
    </>
  );
}
