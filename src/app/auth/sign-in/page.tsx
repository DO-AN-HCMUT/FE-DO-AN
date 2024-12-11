'use client';
// import { Google } from '@mui/icons-material';
import Image from 'next/image';
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import Button from '@/components/Button';
import TextInput from '@/components/TextInput';
import AuthContext from '@/contexts/auth';
import storage from '@/utils/storage';

export default function SignIn() {
  const [input, setInput] = useState({ email: '', password: '' });
  const urlParams = useSearchParams();
  const accessToken = urlParams.get('accessToken');
  const router = useRouter();
  const { signIn } = useContext(AuthContext);

  // const getGoogleOAuthURL = () => {
  //   const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  //   const options = {
  //     redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URL,
  //     client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
  //     access_type: 'offline',
  //     response_type: 'code',
  //     prompt: 'consent',
  //     scope: [
  //       'https://www.googleapis.com/auth/userinfo.profile',
  //       'https://www.googleapis.com/auth/userinfo.email',
  //     ].join(' '),
  //   };
  //   const qs = new URLSearchParams(options as any);

  //   return `${rootUrl}?${qs.toString()}`;
  // };
  // const handleOAuth = () => {
  //   window.location.href = getGoogleOAuthURL();
  // };
  useEffect(() => {
    if (accessToken) {
      storage.setItem('token', accessToken);
      redirect('/');
    }
  });
  const handleSignIn = useCallback(async () => {
    if (!input.email || !input.password) {
      toast.error('Please fill in all fields');
      // setErrorText('Please fill in all fields');
      return;
    }

    try {
      await signIn(input);
      toast.success('Success');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error: any) {
      toast.error(typeof error?.response?.data == 'object' ? error?.response?.data.message : error?.message);
    }
  }, [signIn, input, router]);

  return (
    <div className='flex size-full items-center justify-between'>
      <div>
        <Image src='/images/auth/calendar.png' alt='' width={100} height={100} className='mb-4' />
        <p className='text-6xl font-bold leading-normal text-[#414141]'>Sign In</p>
      </div>
      <div className='flex w-3/5 flex-col items-stretch justify-between'>
        <div className='mb-5 flex grow flex-col justify-center'>
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
          {/* {errorText && <p className='mt-2 italic text-red'>{errorText}</p>} */}
        </div>
        <div>
          <div className=' my-1 flex w-full flex-row items-center justify-end'>
            <Button
              className='me-4'
              type='neutral-positive'
              onClick={() => {
                router.push('/auth/sign-up');
              }}
            >
              Sign Up
            </Button>
            <Button onClick={handleSignIn}>Sign In</Button>
          </div>
        </div>
        {/* <div>
          <Button onClick={() => handleOAuth()} className='w-full gap-1'>
            <Google /> Continue with Google
          </Button>
        </div> */}
      </div>
    </div>
  );
}
