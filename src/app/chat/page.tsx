/* eslint-disable no-tabs */
'use client';
import { useEffect, useState } from 'react';

import AddChatItem from '@/components/ChatComponent/AddChatItem';
import ChatItem from '@/components/ChatComponent/ChatItem';
import ContentSpace from '@/components/ChatComponent/ContentSpace';
import api from '@/services/api';

export default function Chat() {
  const [selectedValue, setSelectedValue] = useState(0);
  const [conservation, setConservation] = useState([]);
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
          {conservation.map((item, index) => (
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
          <ContentSpace value={selectedValue} />
        </div>
      </div>
    </div>
  );
}
