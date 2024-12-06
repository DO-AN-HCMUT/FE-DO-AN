/* eslint-disable max-lines-per-function */
/* eslint-disable no-tabs */
'use client';

import { DayPilot, DayPilotMonth } from '@daypilot/daypilot-lite-react';
import dayjs from 'dayjs';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import api from '@/services/api';

export default function CalendarGrid() {
  const [calendar, setCalendar] = useState<DayPilot.Calendar>();
  const [offset, setOffset] = useState(0);

  const initialConfig: any = {
    eventHeight: 30,
    headerHeight: 30,
    cellHeaderHeight: 20,
    onBeforeEventRender: (args: any) => {
      args.data.borderColor = 'darker';
      if (args.data.backColor) {
        args.data.barColor = DayPilot.ColorUtil.lighter(args.data.backColor, 1);
      }
    },
  };
  const [events, setEvents] = useState<any>([]);
  const getTask = async () => {
    try {
      const result = await api.get('/task/getAll');
      if (!calendar || calendar?.disposed()) {
        return;
      }
      const tasksEvent = result.data.payload.map((item: any) => {
        return {
          id: item.code,
          text: item.title,
          start: new Date(item.createdAt).toISOString(),
          end: new Date(item.endDate).toISOString(),
        };
      });

      setEvents(tasksEvent);
    } catch (error: any) {
      if (error?.response?.data.message === 'TokenExpiredError') {
        toast.error('Please log in', { position: 'bottom-center' });
      } else {
        toast.error(typeof error?.response?.data == 'object' ? error?.response?.data.message : error?.message);
      }
    }
  };
  useEffect(() => {
    getTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendar]);

  const showingDay = dayjs().add(offset, 'month');

  return (
    <div>
      {/* <DayPilotCalendar
        {...config}
        onTimeRangeSelected={onTimeRangeSelected}
        onEventClick={async (args) => {
          await editEvent(args.e);
        }}
        contextMenu={contextMenu}
        onBeforeEventRender={onBeforeEventRender}
        controlRef={setCalendar}
      /> */}
      <div>
        <div className='mb-3 flex items-stretch space-x-3'>
          <div className='w-[200px] self-center ps-2 text-2xl font-bold'>{showingDay.format('MMMM YYYY')}</div>
          <button className='rounded-sm bg-gray-100 p-0' onClick={() => setOffset((prev) => prev - 1)}>
            <Image src='/icons/chevron-left.svg' alt='chevron' width={32} height={32} className='' />
          </button>
          <button className='bg-gray-100 p-2' onClick={() => setOffset(0)}>
            Today
          </button>
          <button className='rounded-sm bg-gray-100 p-0' onClick={() => setOffset((prev) => prev + 1)}>
            <Image src='/icons/chevron-right.svg' alt='chevron' width={32} height={32} className='' />
          </button>
        </div>
      </div>
      <DayPilotMonth startDate={showingDay.toISOString()} events={events} {...initialConfig} controlRef={setCalendar} />
    </div>
  );
}
