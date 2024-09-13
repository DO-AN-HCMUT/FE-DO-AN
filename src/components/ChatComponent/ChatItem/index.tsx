import { Avatar } from '@mui/material';
import { useEffect, useState } from 'react';

import api from '@/services/api';

/* eslint-disable no-tabs */
type ChatItemProps = {
  id: string;
  onClick: any;
};
export default function ChatItem(props: ChatItemProps) {
  const [isName, setIsName] = useState('');

  const getName = async () => {
    try {
      const data = await api.get(`/user/${props.id}`);
      setIsName(data.data.payload.fullName);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getName();
  });
  return (
    <div
      className='mb-2 flex flex-row items-center justify-start border-2 border-solid border-zinc-950 bg-slate-50 p-2'
      onClick={props.onClick}
    >
      <div>
        <Avatar>{isName.length > 0 ? isName : 'logo'}</Avatar>
      </div>
      <div className='ml-1'>{isName.length > 0 ? isName : 'Unknow'}</div>
    </div>
  );
}
