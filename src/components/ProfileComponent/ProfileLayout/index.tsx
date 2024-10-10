import { Button, Typography } from '@mui/material';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import api from '@/services/api';

import InputList from '../InputList';

/* eslint-disable no-tabs */
export default function ProfileLayout() {
  const [fullName, setFullName] = useState<string>('fullName');
  const [email, setEmail] = useState<string>('Email');
  const [birthday, setBirthday] = useState<string>(new Date().toString());
  const [file, setFile] = useState<string>('https://avatar.iran.liara.run/public');
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

  const inputFile = useRef(null);

  const handleChange = (e: any) => {
    // console.log(e.target.files[0]);
    const url = URL.createObjectURL(e.target.files[0]);
    setFile(url);
  };
  const handleClick = () => {
    setIsEdit(true);
    inputFile?.current?.click();
  };
  useEffect(() => {
    getProfile();
  }, []);
  return (
    <div className='w-full'>
      <div>
        <Typography variant='h2'>Profile</Typography>
      </div>
      <div className=' flex min-h-10 flex-row'>
        <div className='w-fit bg-yellow-500 p-2'>
          <Image
            src={file}
            alt='logo'
            width={500}
            height={200}
            style={{ maxHeight: '200px', maxWidth: '100%', borderRadius: '8px' }}
          />
          <Button variant='contained' className='w-full' onClick={() => handleClick()}>
            Upload
          </Button>
          <input ref={inputFile} type='file' style={{ display: 'none' }} accept='image/*' onChange={handleChange} />
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
