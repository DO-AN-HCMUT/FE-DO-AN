'use client';
import { Box, Button, Modal, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDebounceValue } from 'usehooks-ts';

import Header from '@/components/Header';
import ListItem from '@/components/ProjectsComponent/ListItem';
import Sidebar from '@/components/Sidebar';
import { Spinner } from '@/components/Spinner';
import TextInput from '@/components/TextInput';
import api from '@/services/api';

/* eslint-disable no-tabs */
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function Projects() {
  const [projectList, setProjectList] = useState<any>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const handleOpen = () => setIsOpenModal(true);
  const handleClose = () => setIsOpenModal(false);
  const [projectName, setProjectName] = useState('');
  const [debouncedProjectName, setDebouncedProjectName] = useDebounceValue('', 1000);
  const [projectKey, setProjectKey] = useState('');
  const [isProjectKeyLoading, setIsProjectKeyLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const payload = {
        name: projectName.trim(),
        key: projectKey,
      };
      await api.post('/project/new', payload);
      toast.success('Project added successfully');
    } catch (error: any) {
      if (error?.response?.data.message === 'TokenExpiredError') {
        toast.error('Please log in', { position: 'bottom-center' });
      } else {
        toast.error(typeof error?.response?.data == 'object' ? error?.response?.data.message : error?.message);
      }
    }
  };

  const getData = async () => {
    try {
      const dataList = await api.get('/user/projects');
      setProjectList(dataList.data.payload);
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
  };

  const goToProject = (name: string) => {
    router.push(`/projects/tasks?projectId=${name}`);
  };

  useEffect(() => {
    getData();
  }, []);

  const generateProjectKey = useCallback(async (projectName: string) => {
    let key = projectName
      .split(' ')
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toUpperCase();

    while (true) {
      try {
        await api.post('/project/key', { key });
        break;
      } catch (e) {
        console.error(e);
        if (key.length === 2) {
          key += 'A';
        } else {
          key = key.slice(0, 2) + String.fromCharCode(key.charCodeAt(2) + 1);
        }
      }
    }

    setProjectKey(key);
    setIsProjectKeyLoading(false);
  }, []);

  useEffect(() => {
    if (!debouncedProjectName) {
      setProjectKey('');
      setIsProjectKeyLoading(false);
      return;
    }
    generateProjectKey(debouncedProjectName);
  }, [debouncedProjectName, generateProjectKey]);

  return (
    <div>
      <div className='flex h-screen flex-col justify-start'>
        {/* HEADER */}
        <Header />
        {/* BODY */}
        <div className='flex h-screen flex-row  '>
          <Sidebar />
          <div className='w-full'>
            <div>
              <Typography variant='h2'>PROJECTS</Typography>
            </div>
            <div className='grid grid-cols-4 gap-4 overflow-auto p-9'>
              <div>
                <ListItem onClickFunction={handleOpen} />
              </div>
              {projectList?.map((item: any, index: number) => {
                return (
                  <div key={index}>
                    <ListItem projectName={item.name} onClickFunction={() => goToProject(item._id)} />
                  </div>
                );
              })}
            </div>
            <Modal
              open={isOpenModal}
              onClose={handleClose}
              aria-labelledby='modal-modal-title'
              aria-describedby='modal-modal-description'
            >
              <Box sx={style}>
                <Typography id='modal-modal-title' variant='h5' component='h1'>
                  Create Project
                </Typography>
                <div className='flex w-full flex-col items-stretch justify-between pt-5'>
                  <form onSubmit={handleSubmit}>
                    <div className='mb-4 flex grow flex-col justify-center'>
                      <p className='mb-2 ps-1 font-semibold'>Project Name</p>
                      <TextInput
                        placeholder='Enter project name'
                        value={projectName}
                        onInput={(projectName) => {
                          setProjectName(projectName);
                          setDebouncedProjectName(projectName);
                          setIsProjectKeyLoading(true);
                        }}
                        type='text'
                      />
                    </div>
                    <div className='mb-4 flex grow flex-col justify-center'>
                      <p className='mb-2 ps-1 text-sm font-light'>
                        Project Key:{' '}
                        {isProjectKeyLoading ? <Spinner className='inline-block' /> : <span>{projectKey}</span>}
                      </p>
                    </div>
                    <div className='mb-4'>
                      <p className='mb-2 ps-1 font-semibold'>Description</p>
                      <textarea
                        placeholder='Describe your project'
                        className='h-20 w-full rounded-lg border-[1px] border-[#616161] p-3 placeholder:text-[#616161] '
                      />
                    </div>
                    <div className='flex flex-row justify-between self-end'>
                      <Button
                        className='me-4 border-[1px] border-primary bg-white text-primary hover:bg-rose-500 hover:text-white'
                        onClick={handleClose}
                      >
                        Cancel
                      </Button>
                      <Button
                        className='bg-primary text-white hover:bg-primary-dark'
                        type='submit'
                        disabled={!projectName.trim()}
                      >
                        Submit
                      </Button>
                    </div>
                  </form>
                </div>
              </Box>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}
