import SendIcon from '@mui/icons-material/Send';
import { Avatar, Button, TextField } from '@mui/material';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-unresolved
import { io } from 'socket.io-client';

import Toast from '@/components/Toast';
import api from '@/services/api';

/* eslint-disable no-tabs */
export default function ContentSpace(props: any) {
  const [data, setData] = useState([]);
  const receiverID = props.value;
  // const [willToast, setWillToast] = useState<boolean>(false);

  const [message, setMessage] = useState<string>('');
  const [receive, setReceive] = useState<string[]>([]);

  const socket = io(process.env.NEXT_PUBLIC_CHAT_URL as string);
  const handleClick = () => {
    socket.emit('message', message);
    // setWillToast(!willToast);
  };
  socket.on('broad', (name: string) => {
    setReceive([...receive, name]);
  });
  const getData = async () => {
    try {
      const result = await api.get(`/chat/${receiverID}`);
      if (result.data.success) {
        setData(result.data.payload?.message);
      } else {
        console.log('vao else');
      }
    } catch (error) {
      window.location.href = '/auth/sign-in';
    }
  };
  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);
  return (
    <>
      <div className='h-4/5 overflow-auto bg-violet-800'>
        {data?.map((item: any, index: number) => (
          <>
            {item.userID === receiverID ? (
              <div className=' flex flex-row bg-orange-600 ' key={index}>
                <Avatar>target</Avatar>
                {item.content}{' '}
              </div>
            ) : (
              <div className='flex flex-row-reverse bg-lime-400 ' key={index}>
                <Avatar>me</Avatar>
                <div>{item.content}</div>
              </div>
            )}
          </>
        ))}
        {receive}
      </div>
      <div className='  flex flex-row justify-between p-3'>
        <TextField
          variant='outlined'
          label='chat'
          className='mr-1 w-10/12'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button onClick={() => handleClick()}>
          <SendIcon />
        </Button>
      </div>
      {/* {willToast   && <Toast type='success' message='hello' />} */}
    </>
  );
}
