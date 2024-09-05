/* eslint-disable no-tabs */
'use client';
import { useState } from 'react';

import AddChatItem from '@/components/ChatComponent/AddChatItem';
import ChatItem from '@/components/ChatComponent/ChatItem';
import ContentSpace from '@/components/ChatComponent/ContentSpace';

export default function Chat() {
  const list = [0, 1, 2, 3, 4, 5];
  const [selectedValue, setSelectedValue] = useState(1);
  return (
    <div>
      <div>
        <AddChatItem />
      </div>
      <div className='flex flex-row '>
        <div className='h-screen w-1/2 bg-red'>
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
        <div className='h-screen w-1/2 bg-blue-500'>
          <ContentSpace value={selectedValue} />
        </div>
      </div>
    </div>
  );
}
