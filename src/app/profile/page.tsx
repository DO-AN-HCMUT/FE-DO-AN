'use client';

import Header from '@/components/Header';
import ProfileLayout from '@/components/ProfileComponent/ProfileLayout';
import SideBar from '@/components/SideBar';

/* eslint-disable no-tabs */
export default function Profile() {
  return (
    <div>
      <div className='flex h-screen flex-col justify-start'>
        {/* HEADER */}
        <Header />
        {/* BODY */}
        <div className='flex h-screen flex-row '>
          <SideBar />
          <div className='h-screen w-11/12'>
            <ProfileLayout />
          </div>
        </div>
      </div>
    </div>
  );
}
