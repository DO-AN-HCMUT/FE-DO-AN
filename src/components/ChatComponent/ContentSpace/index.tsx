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
    setMessage('');
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
              <div className=' flex flex-row  '>
                <Avatar>target</Avatar>
                <div className=' mx-1 w-5/12 overflow-auto  rounded-lg border-2 border-solid border-gray-200 bg-gray-500 p-2 text-slate-50'>
                  {item.content}
                </div>
              </div>
            ) : (
              <div className='flex flex-row-reverse  '>
                <Avatar>me</Avatar>
                <div className=' mx-1 w-5/12 overflow-auto  rounded-lg border-2 border-solid border-gray-200 bg-teal-200 p-2'>
                  {item.content}
                </div>
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
            multiline
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
