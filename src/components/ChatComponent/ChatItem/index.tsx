import DeleteIcon from '@mui/icons-material/Delete';
import { Avatar } from '@mui/material';
import { useEffect, useState } from 'react';

import api from '@/services/api';

/* eslint-disable no-tabs */
type ChatItemProps = {
  id: string;
  onClick: any;
  deleteMethod: any;
};
export default function ChatItem(props: ChatItemProps) {
  const [isName, setIsName] = useState('');
  const { deleteMethod } = props;
  const getName = async () => {
    try {
      const data = await api.get(`/user/${props.id}`);
      setIsName(data.data.payload.fullName);
    } catch (error) {
      // console.log(error);
    }
  };
  useEffect(() => {
    getName();
  });
  return (
    <div className='mb-2 flex flex-row items-center justify-between border-2 border-solid border-zinc-950 bg-slate-50 p-2'>
      <div className='flex cursor-pointer flex-row items-center justify-center' onClick={props.onClick}>
        <div>
          <Avatar>{isName.length > 0 ? isName : 'logo'}</Avatar>
        </div>
        <div className='ml-1'>{isName.length > 0 ? isName : 'Unknow'}</div>
      </div>
      <div className='cursor-pointer' onClick={() => deleteMethod()}>
        <DeleteIcon />
      </div>
    </div>
  );
}
