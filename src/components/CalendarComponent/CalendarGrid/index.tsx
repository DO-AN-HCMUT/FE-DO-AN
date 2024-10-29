/* eslint-disable max-lines-per-function */
/* eslint-disable no-tabs */
'use client';

import { DayPilot, DayPilotCalendar } from '@daypilot/daypilot-lite-react';
import React, { useEffect, useState } from 'react';

const colors = [
  { name: 'Green', id: '#6aa84f' },
  { name: 'Blue', id: '#3d85c6' },
  { name: 'Turquoise', id: '#00aba9' },
  { name: 'Light Blue', id: '#56c5ff' },
  { name: 'Yellow', id: '#f1c232' },
  { name: 'Orange', id: '#e69138' },
  { name: 'Red', id: '#cc4125' },
  { name: 'Light Red', id: '#ff0000' },
  { name: 'Purple', id: '#af8ee5' },
];
const styles = {
  wrap: {
    display: 'flex',
  },
  left: {
    marginRight: '10px',
  },
  main: {
    flexGrow: '1',
  },
};
export default function CalendarGrid() {
  const oldParticipants = [
    { name: '1', id: 1 },
    { name: '2', id: 2 },
    { name: '3', id: 3 },
    { name: '4', id: 4 },
  ];

  const [calendar, setCalendar] = useState<DayPilot.Calendar>();

  const editEvent = async (e: DayPilot.Event) => {
    const form = [
      { name: 'Event text', id: 'text', type: 'text' },
      { name: 'Event color', id: 'backColor', type: 'select', options: colors },
      { name: 'Number of participants', id: 'tags.participants', type: 'select', options: oldParticipants },
    ];

    const modal = await DayPilot.Modal.form(form, e.data);
    if (modal.canceled) {
      return;
    }
    e.data.text = modal.result.text;
    e.data.backColor = modal.result.backColor;
    e.data.tags.participants = modal.result.tags.participants;
    calendar?.events.update(e);
  };

  const contextMenu = new DayPilot.Menu({
    items: [
      {
        text: 'Delete',
        onClick: async (args) => {
          calendar?.events.remove(args.source);
        },
      },
      {
        text: '-',
      },
      {
        text: 'Edit...',
        onClick: async (args) => {
          await editEvent(args.source);
        },
      },
    ],
  });

  const onBeforeEventRender = (args: DayPilot.CalendarBeforeEventRenderArgs) => {
    args.data.areas = [
      {
        top: 5,
        right: 5,
        width: 20,
        height: 20,
        symbol: 'icons/daypilot.svg#minichevron-down-2',
        fontColor: '#fff',
        backColor: '#00000033',
        style: 'border-radius: 25%; cursor: pointer;',
        toolTip: 'Show context menu',
        action: 'ContextMenu',
      },
    ];

    const participants = args.data.tags?.participants || 0;
    if (participants > 0) {
      args.data.areas.push({
        bottom: 5,
        left: 5,
        width: 24,
        height: 24,
        action: 'None',
        backColor: '#00000033',
        fontColor: '#fff',
        text: participants,
        style: 'border-radius: 50%; border: 2px solid #fff; font-size: 18px; text-align: center;',
      });
    }
  };

  const initialConfig: DayPilot.CalendarConfig = {
    viewType: 'Week',
    durationBarVisible: false,
  };

  const [config, setConfig] = useState(initialConfig);

  useEffect(() => {
    if (!calendar || calendar?.disposed()) {
      return;
    }
    const events: DayPilot.EventData[] = [
      {
        id: 1,
        text: 'Event 1',
        start: '2024-10-02T10:30:00',
        end: '2024-10-02T13:00:00',
        tags: {
          participants: 2,
        },
      },
      {
        id: 2,
        text: 'Event 2',
        start: '2024-10-02T09:30:00',
        end: '2024-10-05T11:30:00',
        backColor: '#6aa84f',
        tags: {
          participants: 1,
        },
      },
      {
        id: 3,
        text: 'Event 3',
        start: '2024-10-03T12:00:00',
        end: '2024-10-03T15:00:00',
        backColor: '#f1c232',
        tags: {
          participants: 3,
        },
      },
      {
        id: 4,
        text: 'Event 4',
        start: '2024-10-01T11:30:00',
        end: '2024-10-01T14:30:00',
        backColor: '#cc4125',
        tags: {
          participants: 2,
        },
      },
    ];

    const startDate = '2024-10-01';

    calendar.update({ startDate, events });
  }, [calendar]);

  const onTimeRangeSelected = async (args: DayPilot.CalendarTimeRangeSelectedArgs) => {
    const modal = await DayPilot.Modal.prompt('Create a new event:', 'Event 1');
    calendar?.clearSelection();
    if (modal.canceled) {
      return;
    }
    // console.log('modal.result', modal.result, calendar);
    calendar?.events.add({
      start: args.start,
      end: args.end,
      id: DayPilot.guid(),
      text: modal.result,
      tags: {
        participants: 1,
      },
    });
  };

  return (
    <div>
      <DayPilotCalendar
        {...config}
        onTimeRangeSelected={onTimeRangeSelected}
        onEventClick={async (args) => {
          await editEvent(args.e);
        }}
        contextMenu={contextMenu}
        onBeforeEventRender={onBeforeEventRender}
        controlRef={setCalendar}
      />
    </div>
  );
}
