/* eslint-disable no-console */
/* eslint-disable no-tabs */
'use client';
import { Suspense, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import AddChatItem from '@/components/ChatComponent/AddChatItem';
import ChatItem from '@/components/ChatComponent/ChatItem';
import ContentSpace from '@/components/ChatComponent/ContentSpace';
import Header from '@/components/Header';
import SideBar from '@/components/SideBar';
import api from '@/services/api';

import Loading from '../loading';

export default function Chat() {
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [conservation, setConservation] = useState<any>([]);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isSelectedItem, setIsSelectedItem] = useState<number>(-1);
  const clickDelete = async (id: string) => {
    try {
      await api.delete(`/chat/${id}/delete`);
      toast.success('Done');
      setIsDelete(!isDelete);
    } catch (error: any) {
      console.log(error);
      toast.error(typeof error?.response?.data == 'object' ? error?.response?.data.message : error?.message);
    }
  };
  const getConservation = async () => {
    try {
      const result = await api.get('/chat/all');
      if (result.data.success) {
        setConservation(result.data.payload);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(typeof error?.response?.data == 'object' ? error?.response?.data.message : error?.message);
      //window.location.href = '/auth/sign-in';
    }
  };
  useEffect(() => {
    getConservation();
  }, [isDelete]);
  return (
    <div className='flex h-screen flex-col justify-start'>
      {/* HEADER */}
      <Header />
      {/* BODY */}
      <div className='flex h-screen flex-row '>
        <SideBar />
        <div className='h-screen w-11/12'>
          <div className='mb-2'>
            <AddChatItem receiver={conservation?.receiver} sender={conservation?.sender} />
          </div>
          <div className='flex h-screen flex-row justify-between gap-1 lg:gap-0'>
            <div className=' max-h-screen w-6/12 overflow-y-scroll bg-red'>
              {conservation?.receiver?.map((item: string, index: number) => (
                <ChatItem
                  id={item}
                  key={index}
                  deleteMethod={() => clickDelete(item)}
                  onClickMethod={() => {
                    setIsSelectedItem(index);
                    setSelectedValue(item);
                  }}
                  isSelect={isSelectedItem === index}
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
      </div>
    </div>
  );
}
