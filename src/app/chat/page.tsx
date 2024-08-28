/* eslint-disable no-tabs */
'use client';

import ChatItem from '@/components/ChatComponent/ChatItem';
import ContentSpace from '@/components/ChatComponent/ContentSpace';

export default function Chat() {
  const list = [0, 1, 2, 3, 4, 5];
  return (
    <div className='flex flex-row '>
      <div className='h-screen w-1/2 bg-red'>
        {list.map((item) => (
          <ChatItem name='logo' key={item} avatar='https://avatar.iran.liara.run/public' />
        ))}
      </div>
      <div className='h-screen w-1/2 bg-blue-500'>
        <ContentSpace />
      </div>
    </div>
  );
}
