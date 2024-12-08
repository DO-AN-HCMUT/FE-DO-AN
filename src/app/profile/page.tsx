'use client';
import Header from '@/components/Header';
import ProfileLayout from '@/components/ProfileComponent/ProfileLayout';
import Sidebar from '@/components/Sidebar';
/* eslint-disable no-tabs */
export default function Profile() {
  return (
    <div>
      <div className='flex h-screen flex-col justify-start'>
        {/* HEADER */}
        <Header />
        {/* BODY */}
        <div className='flex h-screen flex-row '>
          <Sidebar />
          <div className='h-screen w-11/12'>
            <ProfileLayout />
          </div>
        </div>
      </div>
    </div>
  );
}
