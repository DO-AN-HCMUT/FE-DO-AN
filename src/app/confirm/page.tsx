'use client';

import { Button } from '@mui/material';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import Header from '@/components/Header';
import api from '@/services/api';

/* eslint-disable no-tabs */
export default function Confirm() {
  const searchParams = useSearchParams();
  const [isError, setIsError] = useState<boolean>(false);
  const invitationId = searchParams.get('invitationId');
  const projectName = searchParams.get('projectName');

  const router = useRouter();
  const goHome = () => {
    router.replace('/');
  };

  const addMember = async () => {
    try {
      await api.post(`/project/verify?invitationId=${invitationId}`);
      setIsError(false);
      toast.success('Success', { position: 'bottom-center' });
    } catch (error: any) {
      setIsError(true);
      toast.error(typeof error?.response?.data == 'object' ? error?.response?.data.message : error?.message);
      // router.replace('/auth/sign-in');
    }
  };

  useEffect(() => {
    addMember();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invitationId]);
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
        <div>
          {!isError ? (
            <div>
              <Button onClick={() => goHome()} variant='contained' size='medium'>
                Home
              </Button>
            </div>
          ) : (
            <div>
              There is a problem so please contact with us via mail
              <span className='text-sky-500 underline decoration-sky-500'>mail@gmail.com</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
