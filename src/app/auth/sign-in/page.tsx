'use client';
import { Google } from '@mui/icons-material';
import Button from '@mui/material/Button';
import Image from 'next/image';
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useContext, useEffect, useState } from 'react';

// import Button from '@/components/Button';

import TextInput from '@/components/TextInput';
import AuthContext from '@/contexts/auth';
import storage from '@/utils/storage';

export default function SignIn() {
  const [input, setInput] = useState({ email: '', password: '' });
  const [errorText, setErrorText] = useState('');
  const urlParams = useSearchParams();
  const accessToken = urlParams.get('accessToken');
  const router = useRouter();
  const { signIn } = useContext(AuthContext);

  const getGoogleOAuthURL = () => {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const options = {
      redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URL,
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ].join(' '),
    };
    const qs = new URLSearchParams(options as any);

    return `${rootUrl}?${qs.toString()}`;
  };
  const handleOAuth = () => {
    window.location.href = getGoogleOAuthURL();
  };
  useEffect(() => {
    if (accessToken) {
      storage.setItem('token', accessToken);
      redirect('/');
    }
  });
  const handleSignIn = useCallback(
    async (event: any) => {
      event.preventDefault();
      if (!input.email || !input.password) {
        setErrorText('Please fill in all fields');
        return;
      }

      try {
        await signIn(input);
        router.push('/');
        // window.location.href = '/';
      } catch (e: any) {
        console.error(e);
        setErrorText(e.response?.data?.msg);
        // TODO: Handle error message from API
      }
    },
    [signIn, input, router],
  );

  return (
    <>
      <div>
        <Image src='/images/auth/calendar.png' alt='' width={100} height={100} className='mb-4' />
        <p className='text-6xl font-bold leading-normal text-[#414141]'>Sign In</p>
      </div>
      <div className='flex w-3/5 flex-col items-stretch justify-between'>
        <form onSubmit={handleSignIn}>
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
          <div>
            <div className=' my-1 flex w-full flex-row items-center justify-between'>
              {/* <Button
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
              </Button> */}
              <Button
                className='me-4 w-36'
                variant='outlined'
                onClick={() => {
                  router.push('/auth/sign-up');
                }}
              >
                Sign Up
              </Button>
              <Button type='submit' variant='outlined' color='success' className='me-4 w-36'>
                Sign In
              </Button>
            </div>
          </div>
        </form>
        <div>
          <Button onClick={() => handleOAuth()} className='w-full gap-1' variant='outlined'>
            <Google /> Continue with Google
          </Button>
        </div>
      </div>
    </>
  );
}
