import SendIcon from '@mui/icons-material/Send';
import { Avatar, Button, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-unresolved
import { io } from 'socket.io-client';

import api from '@/services/api';

/* eslint-disable no-tabs */
export default function ContentSpace(props: any) {
  const [data, setData] = useState<any>([]);
  const { receiver, sender } = props;
  // const [willToast, setWillToast] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const socket = io(process.env.NEXT_PUBLIC_CHAT_URL as string);
  socket.on('broad', (name) => {
    // setReceive([...receive, name]);
    setData([...data, name]);
  });
  const getData = async () => {
    try {
      if (receiver.length > 0) {
        const result = await api.get(`/chat/${receiver}`);
        if (result.data.success) {
          setData(result.data.payload?.message);
        }
      }
    } catch (error) {
      // console.log(error);
      // window.location.href = '/auth/sign-in';
    }
  };
  const setNewMessage = async (newContent: any) => {
    try {
      await api.put('/chat/addMess', {
        sender,
        receiver,
        message: newContent,
      });
    } catch (error) {
      // console.log(error);
    }
  };
  const handleClick = () => {
    setNewMessage({ userID: sender, content: message });
    socket.emit('message', { userID: sender, content: message });
    // setWillToast(!willToast);
  };
  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);
  return (
    <div className='h-full'>
      <div className='h-5/6 overflow-auto bg-violet-800'>
        {data?.map((item: any, index: number) => (
          <div key={index}>
            {item.userID === receiver ? (
              <div className=' flex flex-row bg-orange-600 '>
                <Avatar>target</Avatar>
                {item.content}{' '}
              </div>
            ) : (
              <div className='flex flex-row-reverse bg-lime-400 '>
                <Avatar>me</Avatar>
                <div>{item.content}</div>
              </div>
            )}
          </div>
        ))}
      </div>
      {receiver.length > 0 ? (
        <div className=' flex flex-row justify-between px-0 pt-3 '>
          <TextField
            variant='outlined'
            label='message'
            className=' w-11/12'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button onClick={() => handleClick()}>
            <SendIcon />
          </Button>
        </div>
      ) : (
        <div className='h-1/6 bg-violet-800'></div>
      )}
      {/* {willToast   && <Toast type='success' message='hello' />} */}
    </div>
  );
}
