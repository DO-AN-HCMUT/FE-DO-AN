'use client';

import { Button } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useContext, useState } from 'react';
// import Button from '@/components/Button';
import toast from 'react-hot-toast';

import TextInput from '@/components/TextInput';
import AuthContext from '@/contexts/auth';

export default function SignUp() {
  const [input, setInput] = useState({ email: '', password: '', confirmPassword: '' });
  // const [errorText, setErrorText] = useState('');

  const router = useRouter();
  const { signUp } = useContext(AuthContext);

  const handleSignUp = useCallback(
    async (event: any) => {
      event.preventDefault();
      if (!input.email || !input.password || !input.confirmPassword) {
        toast.error('Please fill in all fields');
        return;
      }

      if (input.password !== input.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      try {
        await signUp(input);
        toast.success('Success');
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } catch (error: any) {
        toast.error(typeof error?.response?.data == 'object' ? error?.response?.data.message : error?.message);
        // TODO: Handle error message from API
      }
    },
    [input, router, signUp],
  );

  return (
    <>
      <div>
        <Image src='/images/auth/calendar.png' alt='' width={100} height={100} className='mb-4' />
        <p className='text-6xl font-bold leading-normal text-[#414141]'>Sign Up</p>
      </div>
      <div className='flex w-3/5 flex-col items-stretch justify-between'>
        <form onSubmit={handleSignUp}>
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
            {/* {errorText && <p className='mt-2 italic text-red'>{errorText}</p>} */}
          </div>
          <div className='mt-8 flex w-full flex-row items-center justify-between'>
            <Button
              className='me-4 w-36'
              variant='outlined'
              onClick={() => {
                router.push('/auth/sign-in');
              }}
            >
              Sign In
            </Button>
            <Button type='submit' className=' w-36' variant='outlined'>
              Sign Up
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
