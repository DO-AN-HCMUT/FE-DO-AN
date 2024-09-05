import { Avatar } from '@mui/material';
import { useEffect, useState } from 'react';

import api from '@/services/api';

/* eslint-disable no-tabs */
export default function ContentSpace(props: any) {
  const [data, setData] = useState([]);
  const receiverID = props.value;

  const getData = async () => {
    const result = await api.get(`/chat/${receiverID}`);
    if (result.data.success) {
      console.log(result.data.payload);
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
      <div>input</div>
    </>
  );
}
