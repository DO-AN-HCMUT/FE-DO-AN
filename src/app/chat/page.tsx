/* eslint-disable no-console */
/* eslint-disable no-tabs */
'use client';
import { Suspense, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

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
  // let currentUser: any = [];
  const [currentUser, setCurrentUser] = useState<any>([]);
  const socket = io(process.env.NEXT_PUBLIC_CHAT_URL as string, {
    reconnection: false,
  });
  if (conservation?.receiver?.length > 0) {
    socket.connect();
    socket.auth = { username: conservation?.sender };

    socket.on('users', (users) => {
      setCurrentUser(users.filter((item: any) => item.socketName !== conservation.sender));

      // put the current user first, and then sort by username
    });
  } else {
    socket.off();
    socket.close();
  }

  const clickDelete = async (id: string) => {
    try {
      await api.delete(`/chat/${id}/delete`);
      toast.success('Done');
      setIsDelete(!isDelete);
    } catch (error: any) {
      if (error?.response?.data.message === 'TokenExpiredError') {
        toast.error('Please log in', { position: 'bottom-center' });
      } else {
        toast.error(typeof error?.response?.data == 'object' ? error?.response?.data.message : error?.message);
      }
    }
  };
  const getConservation = async () => {
    try {
      const result = await api.get('/chat/all');
      if (result.data.success) {
        setConservation(result.data.payload);
      }
    } catch (error: any) {
      if (error?.response?.data.message === 'TokenExpiredError') {
        toast.error('Please log in', { position: 'bottom-center' });
        setTimeout(() => {
          window.location.href = '/auth/sign-in';
        }, 4000);
      } else {
        toast.error(typeof error?.response?.data == 'object' ? error?.response?.data.message : error?.message);
      }
      //window.location.href = '/auth/sign-in';
    }
  };
  useEffect(() => {
    getConservation();
  }, [isDelete]);
  useEffect(() => {
    const handleWindowClose = (e: any) => {
      console.log('window clos');

      e.preventDefault();
      socket.disconnect();
    };
    window.addEventListener('beforeunload', handleWindowClose);

    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
    };
  });
  return (
    <div className='flex h-screen flex-col justify-start'>
      {/* HEADER */}
      <Header socket={socket} />
      {/* BODY */}
      <div className='flex h-full flex-row '>
        <SideBar />
        <div className=' w-11/12'>
          <div className='mb-2'>
            <AddChatItem receiver={conservation?.receiver} sender={conservation?.sender} />
          </div>
          <div className='flex h-full flex-row justify-between gap-1 pl-2 lg:gap-0'>
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
                  currentUser={currentUser}
                />
              ))}
            </div>
            <div className='max-h-screen w-6/12'>
              {selectedValue.length > 0 ? (
                <Suspense fallback={<Loading />}>
                  <ContentSpace receiver={selectedValue} sender={conservation?.sender} socket={socket} />
                </Suspense>
              ) : (
                <div className='h-full overflow-auto bg-violet-800' />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
