'use client';
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { Button, TextField } from '@mui/material';
import { DateRangeIcon, LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useState, useRef, useEffect, ChangeEvent } from 'react';
import toast from 'react-hot-toast';

import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { COLOR_PAIRS } from '@/constants/common';
import api from '@/services/api';
import { hashStringToRange } from '@/utils/common';

import User from '@/types/user';

export default function Profile() {
  const [hasChanged, setHasChanged] = useState(false);
  const [me, setMe] = useState<User>();
  const [nameToRender, setNameToRender] = useState<string>();

  const inputFile = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    try {
      await api.put('/user/update', me);
      setHasChanged(false);
      toast.success('Profile updated');
    } catch (error: any) {
      if (error?.response?.data.message === 'TokenExpiredError') {
        toast.error('Please log in', { position: 'bottom-center' });
      } else {
        toast.error(typeof error?.response?.data == 'object' ? error?.response?.data.message : error?.message);
      }
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const profile = await api.get('/user/me');
        setMe({ ...profile.data.payload, _id: undefined });
        setNameToRender(profile.data.payload.fullName);
      } catch (error: any) {
        if (error?.response?.data.message === 'TokenExpiredError') {
          toast.error('Please log in', { position: 'bottom-center' });
          setTimeout(() => {
            window.location.href = '/auth/sign-in';
          }, 4000);
        } else {
          toast.error(typeof error?.response?.data == 'object' ? error?.response?.data.message : error?.message);
        }
      }
    })();
  }, []);

  const handleUploadImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !me) return;

    const fileReader = new FileReader();

    fileReader.readAsDataURL(e.target.files[0]);

    fileReader.onload = () => {
      setMe({ ...me, avatar: fileReader.result?.toString() });
      setHasChanged(true);
    };
  };

  if (!me || !nameToRender) return null;

  return (
    <div>
      <div className='flex h-screen flex-col justify-start'>
        {/* HEADER */}
        <Header />
        {/* BODY */}
        <div className='flex h-screen flex-row'>
          <Sidebar />
          <div className='flex flex-grow flex-col items-start p-10'>
            <div className='w-full'>
              <div>
                <h2 className='mb-5 text-3xl font-bold text-primary'>Profile</h2>
              </div>
              <div className=' flex min-h-10 flex-row'>
                <div className='w-fit p-2 pt-0'>
                  <div className='mb-5'>
                    {me.avatar ? (
                      <img
                        src={me.avatar}
                        alt='avatar'
                        className='aspect-square w-[120px] min-w-[120px] rounded-full border border-zinc-400'
                      />
                    ) : (
                      <div
                        style={COLOR_PAIRS[hashStringToRange(nameToRender)]}
                        className='flex aspect-square w-[120px] items-center justify-center rounded-full text-[48px] font-semibold'
                      >
                        {nameToRender
                          .split(' ')
                          .splice(0, 2)
                          .map((word) => word[0]?.toUpperCase())
                          .join('')}
                      </div>
                    )}
                  </div>
                  <Button
                    variant='contained'
                    className='w-full'
                    onClick={() => {
                      inputFile?.current?.click();
                    }}
                  >
                    Upload
                  </Button>
                  <input
                    ref={inputFile}
                    type='file'
                    style={{ display: 'none' }}
                    accept='image/*'
                    onChange={handleUploadImage}
                  />
                </div>
                <div className=' w-full'>
                  <div className='w-full'>
                    <div className='mb-5 flex flex-row p-1'>
                      <PersonOutlinedIcon fontSize='large' />
                      <TextField
                        id='fullName'
                        label='Full Name'
                        value={me.fullName}
                        fullWidth
                        onChange={(e) => {
                          setMe({ ...me, fullName: e.target.value });
                          setHasChanged(true);
                        }}
                        onBlur={() => {
                          me.fullName && setNameToRender(me.fullName);
                        }}
                        type='text'
                      />
                    </div>
                    <div className='flex w-full  flex-col justify-between lg:flex-row'>
                      <div className='flex w-6/12 flex-row  p-1'>
                        <DateRangeIcon fontSize='large' />
                        <div>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label='Birthday'
                              value={dayjs(me.birthday)}
                              onChange={(value) => {
                                setMe({ ...me, birthday: value?.format('YYYY-MM-DD') });
                                setHasChanged(true);
                              }}
                              disableFuture
                              views={['year', 'month', 'day']}
                            />
                          </LocalizationProvider>
                        </div>
                      </div>
                      <div className='flex w-full flex-row  p-1'>
                        <AlternateEmailOutlinedIcon fontSize='large' />
                        <TextField
                          id='email'
                          label='Email'
                          value={me.email}
                          fullWidth
                          error={me.email.length <= 0 ? true : false}
                          helperText={me.email.length <= 0 ? 'Email must be included' : ''}
                          onChange={(e) => {
                            setMe({ ...me, email: e.target.value });
                            setHasChanged(true);
                          }}
                          type='text'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='mt-2 w-full '>
                <Button
                  variant='contained'
                  color='success'
                  disabled={!hasChanged}
                  className='w-full'
                  onClick={() => handleSave()}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
