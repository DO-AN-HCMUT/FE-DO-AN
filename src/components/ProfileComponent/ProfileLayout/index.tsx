import { Button, Typography } from '@mui/material';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import api from '@/services/api';

import InputList from '../InputList';

/* eslint-disable no-tabs */
export default function ProfileLayout() {
  const [fullName, setFullName] = useState<string>('fullName');
  const [email, setEmail] = useState<string>('Email');
  const [birthday, setBirthday] = useState<string>(new Date().toString());
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const getProfile = async () => {
    try {
      const profile = await api.get('/user/me');
      setFullName(profile.data.payload.fullName);
      setEmail(profile.data.payload.email);
      setBirthday(profile.data.payload.birthday);
    } catch (error) {
      // console.log(error);
    }
  };
  useEffect(() => {
    getProfile();
  }, []);
  return (
    <div className='w-full'>
      <div>
        <Typography variant='h1'>Profile</Typography>
      </div>
      <div className=' flex min-h-10 flex-row'>
        <div className='w-fit bg-yellow-500 p-2'>
          <Image
            src='data:image/jpeg;base64,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2GVoiIirCmURERERERERERERERERERERERERERERERF//9k='
            alt='logo'
            width={250}
            height={200}
          />
          <Button variant='contained' className='w-full'>
            Upload
          </Button>
        </div>
        <div className=' w-full'>
          <InputList
            fullName={fullName}
            email={email}
            birthday={birthday}
            setFullName={setFullName}
            setEmail={setEmail}
            setBirthday={setBirthday}
            setIsEdit={setIsEdit}
          />
        </div>
      </div>
      <div className=' w-full pt-1'>
        <Button variant='contained' color='success' disabled={!isEdit} className='w-full'>
          Save
        </Button>
      </div>
    </div>
  );
}
