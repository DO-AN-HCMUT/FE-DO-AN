import { Box, Modal, Typography } from '@mui/material';
import Image from 'next/image';
import { useState, useContext } from 'react';

import AuthContext from '@/contexts/auth';

import Button from '../Button';
import TextInput from '../TextInput';

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

export default function Header() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const handleOpen = () => setIsOpenModal(true);
  const handleClose = () => setIsOpenModal(false);
  const [input, setInput] = useState({ projectName: '', description: '' });
  const { signOut } = useContext(AuthContext);

  return (
    <div className='flex w-full items-center justify-between bg-[#3c3c3c] p-4'>
      <Image src='/images/logo.png' alt='logo' width={40} height={40} className='' />
      <div className='flex'>
        <Button className='me-4' onClick={handleOpen}>
          + New Project
        </Button>

        <Modal
          open={isOpenModal}
          onClose={handleClose}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box sx={style}>
            <Typography id='modal-modal-title' variant='h6' component='h1'>
              Create Project
            </Typography>
            <div className='flex w-full flex-col items-stretch justify-between pt-5'>
              <div className='flex grow flex-col justify-center pb-5'>
                <TextInput
                  className='mb-8'
                  placeholder='Project Name'
                  value={input.projectName}
                  onInput={(projectName) => {
                    setInput({ ...input, projectName });
                  }}
                  type='text'
                />
              </div>
              <div className='self-end'>
                <Button type='neutral-positive' className='me-4' onClick={handleClose}>
                  Cancel
                </Button>
                <Button type='positive' onClick={() => {}}>
                  Submit
                </Button>
              </div>
            </div>
          </Box>
        </Modal>
        <Image src='/images/header/bell.png' alt='notification' width={40} height={40} className='me-4' />

        <Image src='/images/header/avatar.jpeg' alt='profile' width={40} height={40} className='me-4 rounded-full' />
        <Image
          src='/icons/logout.svg'
          alt=''
          width={40}
          height={40}
          className='hover:cursor-pointer'
          onClick={() => signOut()}
        />
      </div>
    </div>
  );
}
