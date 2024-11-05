import DeleteIcon from '@mui/icons-material/Delete';
import { Chip } from '@mui/material';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import api from '@/services/api';

/* eslint-disable no-tabs */
type ChatItemProps = {
  id: string;
  onClickMethod: any;
  deleteMethod: any;
  isSelect: boolean;
  isOnline: boolean;
};
export default function ChatItem(props: ChatItemProps) {
  const [profile, setProfile] = useState<any>('');
  const { deleteMethod, onClickMethod, isSelect, isOnline } = props;

  const getName = async () => {
    try {
      const data = await api.get(`/user/${props.id}`);
      setProfile(data.data.payload);
    } catch (error: any) {
      toast.error(typeof error?.response?.data == 'object' ? error?.response?.data.message : error?.message);
      // console.log(error);
    }
  };
  useEffect(() => {
    getName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className='mb-2 flex flex-row items-center justify-between rounded-lg border-4 border-solid  bg-slate-50 p-2'
      style={{ borderColor: isSelect ? 'rgb(21 128 61)' : 'rgb(56 189 248)' }}
      onClick={() => {
        onClickMethod();
      }}
    >
      <div className='flex w-9/12 cursor-pointer flex-row items-center'>
        <div>
          {/* <Avatar> logo</Avatar> */}
          <Image src={profile.avatar} width={40} height={40} alt='avatar' />
        </div>
        <div className='ml-1'>{profile.fullName?.length > 0 ? profile.fullName : 'Unknow'}</div>
      </div>
      <div>
        {isOnline ? (
          <Chip label='online' color='success' variant='outlined' />
        ) : (
          <Chip label='offline' color='error' variant='outlined' />
        )}
      </div>
      <div className='cursor-pointer' onClick={() => deleteMethod()}>
        <DeleteIcon />
      </div>
    </div>
  );
}
