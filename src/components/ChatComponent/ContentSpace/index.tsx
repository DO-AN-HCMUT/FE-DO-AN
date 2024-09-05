import SendIcon from '@mui/icons-material/Send';
import { Avatar, Button, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

import Toast from '@/components/Toast';
import api from '@/services/api';

/* eslint-disable no-tabs */
export default function ContentSpace(props: any) {
  const [data, setData] = useState([]);
  const receiverID = props.value;
  const [willToast, setWillToast] = useState(false);
  const getData = async () => {
    const result = await api.get(`/chat/${receiverID}`);
    if (result.data.success) {
      setData(result.data.payload?.message);
    }
  };
  useEffect(() => {
    getData();
  }, [props]);
  return (
    <>
      <div className='h-4/5 overflow-auto bg-violet-800'>
        {data?.map((item: any, index: number) => (
          <>
            {item.userID !== 1 ? (
              <div className=' flex flex-row bg-orange-600 ' key={index}>
                <Avatar>Me</Avatar>
                {item.content}{' '}
              </div>
            ) : (
              <div className='flex flex-row-reverse bg-lime-400 ' key={index}>
                <Avatar>Me</Avatar>
                <div>{item.content}</div>
              </div>
            )}
          </>
        ))}
      </div>
      <div className='  flex flex-row justify-between p-3'>
        <TextField variant='outlined' label='chat' className='mr-1 w-10/12' />
        <Button onClick={() => setWillToast(!willToast)}>
          <SendIcon />
        </Button>
      </div>
      {willToast && <Toast type='success' message='hello' />}
    </>
  );
}
