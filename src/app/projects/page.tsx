'use client';
import { Box, Button, Modal, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import Header from '@/components/Header';
import ListItem from '@/components/ProjectsComponent/ListItem';
import SideBar from '@/components/SideBar';
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
  // const [input, setInput] = useState({ projectName: '' });
  const [projectName, setProjectName] = useState('');
  const [projectCode, setProjectCode] = useState('');
  const router = useRouter();

  // const code = projectName
  //   .split(" ")
  //   .slice(0, 3)
  //   .map((word) => word[0])
  //   .join("")
  //   .toUpperCase();

  const handleSubmit = async () => {
    try {
      const payload = {
        members: [],
        taskIDs: [],
        projectName,
        projectCode,
      };
      await api.post('/project/new', payload);
      toast.success('Done');
    } catch (error: any) {
      toast.error(typeof error?.response?.data == 'object' ? error?.response?.data.message : error?.message);
    }
  };
  const getData = async () => {
    try {
      const dataList = await api.get('/user/projects');
      setProjectList(dataList.data.payload);
    } catch (error: any) {
      toast.error(typeof error?.response?.data == 'object' ? error?.response?.data.message : error?.message);
      setTimeout(() => {
        window.location.href = '/auth/sign-in';
      }, 4000);
    }
  };
  const goToProject = (name: string) => {
    // window.localStorage.setItem('currentProject', name);
    router.push(`/project?id=${name}`);
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <div className='flex h-screen flex-col justify-start'>
        {/* HEADER */}
        <Header />
        {/* BODY */}
        <div className='flex h-screen flex-row  '>
          <SideBar />
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
                    <ListItem projectName={item.projectName} onClickFunction={() => goToProject(item._id)} />
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
                    <div className='flex grow flex-col justify-center'>
                      <p className='mb-2 ps-1 font-semibold'>Project Name</p>
                      <TextInput
                        className='mb-8'
                        placeholder='Enter project name'
                        value={projectName}
                        onInput={(projectName) => {
                          setProjectName(projectName);
                        }}
                        type='text'
                      />
                    </div>
                    <div className='flex grow flex-col justify-center'>
                      <p className='mb-2 ps-1 font-semibold'>Project Code</p>
                      <TextInput
                        className='mb-8'
                        placeholder='Enter project code'
                        value={projectCode}
                        onInput={(projectCode) => {
                          setProjectCode(projectCode);
                        }}
                        type='text'
                      />
                    </div>
                    <div className='flex flex-row justify-between self-end'>
                      <Button
                        className='me-4 border-[1px] border-primary bg-white text-primary hover:bg-rose-500 hover:text-white'
                        onClick={handleClose}
                      >
                        Cancel
                      </Button>
                      <Button className='bg-primary text-white hover:bg-primary-dark' type='submit'>
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
