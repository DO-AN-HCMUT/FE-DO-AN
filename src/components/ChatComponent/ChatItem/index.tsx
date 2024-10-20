import DeleteIcon from '@mui/icons-material/Delete';
import { Avatar } from '@mui/material';
import { useEffect, useState } from 'react';

import api from '@/services/api';

/* eslint-disable no-tabs */
type ChatItemProps = {
  id: string;
  onClickMethod: any;
  deleteMethod: any;
  isSelect: boolean;
};
export default function ChatItem(props: ChatItemProps) {
  const [isName, setIsName] = useState<string>('');
  const { deleteMethod, onClickMethod, isSelect } = props;
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
    <div
      className='mb-2 flex flex-row items-center justify-between rounded-lg border-4 border-solid border-zinc-950 bg-slate-50 p-2'
      style={{ borderColor: isSelect ? 'rgb(21 128 61)' : 'transparent' }}
      onClick={() => {
        onClickMethod();
      }}
    >
      <div className='flex w-9/12 cursor-pointer flex-row items-center'>
        <div>
          <Avatar> logo</Avatar>
        </div>
        <div className='ml-1'>{isName.length > 0 ? isName : 'Unknow'}</div>
      </div>
      <div className='cursor-pointer' onClick={() => deleteMethod()}>
        <DeleteIcon />
      </div>
    </div>
  );
}
