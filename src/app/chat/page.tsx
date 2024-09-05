/* eslint-disable no-tabs */
'use client';
import { useState } from 'react';

import AddChatItem from '@/components/ChatComponent/AddChatItem';
import ChatItem from '@/components/ChatComponent/ChatItem';
import ContentSpace from '@/components/ChatComponent/ContentSpace';

export default function Chat() {
  const list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const [selectedValue, setSelectedValue] = useState(1);
  return (
    <div className='h-screen'>
      <div className='mb-2'>
        <AddChatItem />
      </div>
      <div className='flex flex-row '>
        <div className='h-screen max-h-screen w-1/2 overflow-y-scroll bg-red'>
          {list.map((item, index) => (
            <ChatItem
              name='logo'
              key={index}
              onClick={() => {
                console.log(item);
                setSelectedValue(item);
              }}
            />
          ))}
        </div>
        <div className='h-screen max-h-screen w-1/2'>
          <ContentSpace value={selectedValue} />
        </div>
      </div>
    </div>
  );
}
