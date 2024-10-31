'use client';

import { Typography } from '@mui/material';

import CalendarGrid from '@/components/CalendarComponent/CalendarGrid';
import Header from '@/components/Header';
import SideBar from '@/components/SideBar';

/* eslint-disable no-tabs */
export default function Calendar() {
  return (
    <div>
      <div className='flex h-screen flex-col justify-start '>
        {/* HEADER */}
        <Header />
        {/* BODY */}
        <div className='flex h-full w-full flex-row  '>
          <SideBar />
          <div className='w-full'>
            <Typography variant='h3'>CALENDAR</Typography>
            <div className='bg-black'>
              <CalendarGrid />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
