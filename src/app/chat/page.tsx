/* eslint-disable no-tabs */
'use client';
import { useEffect, useState } from 'react';

import AddChatItem from '@/components/ChatComponent/AddChatItem';
import ChatItem from '@/components/ChatComponent/ChatItem';
import ContentSpace from '@/components/ChatComponent/ContentSpace';
import api from '@/services/api';

export default function Chat() {
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [conservation, setConservation] = useState<any>([]);
  const getConservation = async () => {
    try {
      const result = await api.get('/chat/all');
      if (result.data.success) {
        console.log(result.data.payload);

        setConservation(result.data.payload);
      } else {
        console.log(result.data.message);
      }
    } catch (error) {
      console.log(error);
      window.location.href = '/auth/sign-in';
    }
  };
  useEffect(() => {
    getConservation();
  }, []);
  return (
    <div className='h-screen'>
      <div className='mb-2'>
        <AddChatItem />
      </div>
      <div className='flex flex-row '>
        <div className='h-screen max-h-screen w-1/2 overflow-y-scroll bg-red'>
          {conservation?.receiver?.map((item: string, index: number) => (
            <ChatItem
              id={item}
              key={index}
              onClick={() => {
                setSelectedValue(item);
              }}
            />
          ))}
        </div>
        <div className='h-screen max-h-screen w-1/2'>
          <ContentSpace receiver={selectedValue} sender={conservation?.sender} />
        </div>
      </div>
    </div>
  );
}
