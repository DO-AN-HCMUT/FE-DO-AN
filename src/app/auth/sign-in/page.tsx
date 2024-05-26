'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useCallback, useContext } from 'react';

import Button from '@/components/Button';
import TextInput from '@/components/TextInput';
import AuthContext from '@/contexts/auth';

export default function SignIn() {
  const [input, setInput] = useState({ email: '', password: '' });
  const [errorText, setErrorText] = useState('');

  const router = useRouter();
  const { signIn } = useContext(AuthContext);

  const handleSignIn = useCallback(async () => {
    if (!input.email || !input.password) {
      setErrorText('Please fill in all fields');
      return;
    }

    try {
      await signIn(input);
      router.push('/');
    } catch (e: any) {
      console.error(e);
      setErrorText(e.response.data.msg);
      // TODO: Handle error message from API
    }
  }, [signIn, input, router]);

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
          {errorText && <p className='mt-2 italic text-red'>{errorText}</p>}
        </div>
        <div className='self-end'>
          <div>
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
      </div>
    </>
  );
}
