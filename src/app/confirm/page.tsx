'use client';

import { Button } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import Header from '@/components/Header';
import api from '@/services/api';

/* eslint-disable no-tabs */
export default function Confirm() {
  const searchParams = useSearchParams();
  const [isError, setIsError] = useState<boolean>(false);
  const projectName = searchParams.get('projectName');
  const projectId = searchParams.get('projectID');
  const router = useRouter();
  const goHome = () => {
    router.push('/');
  };
  const addMember = async () => {
    try {
      await api.post(`/project/${projectId}/verify`);
      setIsError(false);
      toast.success('Success', { position: 'bottom-center' });
    } catch (error: any) {
      setIsError(true);
      if (error?.response?.data.message === 'TokenExpiredError') {
        toast.error('Please log in', { position: 'bottom-center' });
      } else {
        toast.error(typeof error?.response?.data == 'object' ? error?.response?.data.message : error?.message);
      }
    }
  };

  useEffect(() => {
    addMember();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className='flex h-screen flex-col justify-start'>
      {/* HEADER */}
      <Header />
      {/* BODY */}
      <div className='flex h-full flex-col items-center justify-center '>
        <div>
          <Image src={'/approval.svg'} alt='congratulation' width={200} height={50} />
        </div>
        <div>You have added to the project {projectName} .</div>
        {!isError ? (
          <div>
            <Button onClick={() => goHome()} variant='contained' size='medium'>
              Home
            </Button>
          </div>
        ) : (
          <div>
            You do not log in so please{' '}
            <Link className='text-sky-500 underline decoration-sky-500 underline-offset-2' href={'/auth/sign-in'}>
              sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
