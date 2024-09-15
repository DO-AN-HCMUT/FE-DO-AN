/* eslint-disable no-tabs */
'use client';
import { Suspense, useEffect, useState } from 'react';

import AddChatItem from '@/components/ChatComponent/AddChatItem';
import ChatItem from '@/components/ChatComponent/ChatItem';
import ContentSpace from '@/components/ChatComponent/ContentSpace';
import api from '@/services/api';

import Loading from '../loading';

export default function Chat() {
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [conservation, setConservation] = useState<any>([]);
  const getConservation = async () => {
    try {
      const result = await api.get('/chat/all');
      if (result.data.success) {
        // console.log(result.data.payload);

        setConservation(result.data.payload);
      }
    } catch (error) {
      // console.log(error);
      window.location.href = '/auth/sign-in';
    }
  };
  useEffect(() => {
    getConservation();
  }, []);
  return (
    <div className='h-screen'>
      <div className='mb-2'>
        <AddChatItem receiver={conservation?.receiver} sender={conservation?.sender} />
      </div>
      <div className='flex h-full flex-row justify-between gap-1 lg:gap-0'>
        <div className=' max-h-screen w-6/12 overflow-y-scroll bg-red'>
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
        <div className='max-h-screen w-6/12'>
          <Suspense fallback={<Loading />}>
            <ContentSpace receiver={selectedValue} sender={conservation?.sender} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
