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
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [img, setImg] = useState<any>('https://avatar.iran.liara.run/public');
  const getProfile = async () => {
    try {
      const profile = await api.get('/user/me');
      setFullName(profile.data.payload.fullName);
      setEmail(profile.data.payload.email);
      setBirthday(profile.data.payload.birthday);
      if (profile.data.payload?.avatar.length > 0) {
        setImg(profile.data.payload.avatar);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  const inputFile = useRef(null);
  const uploadImg = async () => {
    if (typeof img !== 'string') {
      try {
        const formData = new FormData();
        formData.append('file', img);
        await api.post('/user/uploadImg', formData);
      } catch (error) {
        // console.log(error);
      }
    }
  };
  const updateProfile = async () => {
    try {
      const userData = {
        fullName,
        email,
        birthday,
      };
      await api.put('/user/update', userData);
    } catch (error) {
      // console.log(error);
    }
  };
  const handleSave = () => {
    uploadImg();
    updateProfile();
    setIsEdit(false);
  };
  const handleChange = (e: any) => {
    const imgLink = e.target.files[0];
    setImg(imgLink);
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
        <div className='w-fit  p-2 pt-0'>
          <Image
            src={typeof img == 'string' ? img : URL.createObjectURL(img)}
            alt='avatar'
            width={500}
            height={200}
            style={{ maxHeight: '200px', maxWidth: '100%', borderRadius: '8px' }}
            className='bg-yellow-500'
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
        <Button variant='contained' color='success' disabled={!isEdit} className='w-full' onClick={() => handleSave()}>
          Save
        </Button>
      </div>
    </div>
  );
}
