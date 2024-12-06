/* eslint-disable max-lines-per-function */
/* eslint-disable no-tabs */
'use client';

import { DayPilot, DayPilotMonth } from '@daypilot/daypilot-lite-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import api from '@/services/api';
// import { start } from 'repl';
// import { text } from 'stream/consumers';

// const colors = [
//   { name: 'Green', id: '#6aa84f' },
//   { name: 'Blue', id: '#3d85c6' },
//   { name: 'Turquoise', id: '#00aba9' },
//   { name: 'Light Blue', id: '#56c5ff' },
//   { name: 'Yellow', id: '#f1c232' },
//   { name: 'Orange', id: '#e69138' },
//   { name: 'Red', id: '#cc4125' },
//   { name: 'Light Red', id: '#ff0000' },
//   { name: 'Purple', id: '#af8ee5' },
// ];

export default function CalendarGrid() {
  const [calendar, setCalendar] = useState<DayPilot.Calendar>();

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
  // const [config] = useState(initialConfig);
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

      // calendar.update({ startDate, events });
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
      <DayPilotMonth startDate={new Date().toISOString()} events={events} {...initialConfig} controlRef={setCalendar} />
    </div>
  );
}
