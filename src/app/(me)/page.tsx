/* eslint-disable max-lines-per-function */

'use client';

import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

import Header from '@/components/Header';
import TaskList from '@/components/HomeComponent/TaskList';
import SideBar from '@/components/SideBar';
import api from '@/services/api';
import storage from '@/utils/storage';

export default function MePage() {
  const [isAuthStatusReady, setIsAuthStatusReady] = useState(false);

  useEffect(() => {
    if (!storage.getItem('token')) {
      redirect('/auth/sign-in');
    } else {
      checkToken();
    }
    setIsAuthStatusReady(true);
  }, []);
  const checkToken = async () => {
    try {
      const result = await api.post('/auth/checkToken');
      if (!result.data.success) {
        redirect('/auth/sign-in');
      }
    } catch (error) {
      window.localStorage.removeItem('token');
      window.location.href = '/auth/sign-in';
    }
  };
  if (!isAuthStatusReady) return null;

  return (
    <div className='justify-star flex h-screen flex-col '>
      {/* HEADER */}
      <Header />
      {/* BODY */}
      <div className='flex h-full flex-row'>
        <SideBar />
        {/* CONTENT */}
        <div className='flex w-11/12 items-stretch bg-[#eee] px-10 py-12'>
          <div className='w-full rounded bg-white'>
            <TaskList />
          </div>
        </div>
      </div>
    </div>
  );
}
