'use client';

import CalendarGrid from '@/components/CalendarComponent/CalendarGrid';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

/* eslint-disable no-tabs */
export default function Calendar() {
  return (
    <div>
      <div className='flex h-screen flex-col justify-start '>
        {/* HEADER */}
        <Header />
        {/* BODY */}
        <div className='flex h-full w-full flex-row  '>
          <Sidebar />
          <div className='w-full p-10'>
            <h2 className='mb-4 text-3xl font-bold text-primary'>My Calendar</h2>
            <div className=' p-1'>
              <CalendarGrid />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
