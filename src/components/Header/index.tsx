'use client';

// import { Box, Button, Modal, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';

import AuthContext from '@/contexts/auth';

// import TextInput from '../TextInput';

// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
//   boxShadow: 24,
//   p: 4,
// };
type HeaderProps = {
  socket?: any;
};
export default function Header(props: HeaderProps) {
  // const [isOpenModal, setIsOpenModal] = useState(false);
  // const handleOpen = () => setIsOpenModal(true);
  // const handleClose = () => setIsOpenModal(false);
  // const [input, setInput] = useState({ projectName: '', description: '' });
  const { socket } = props;

  const { signOut } = useContext(AuthContext);
  const handleSignOut = () => {
    if (socket) {
      socket.disconnect();
    }
    signOut();
  };
  return (
    <div className='flex w-full items-center justify-between bg-[#3c3c3c] p-4'>
      <Image src='/images/logo.png' alt='logo' width={40} height={40} className='' />
      <div className='flex'>
        {/* <Button className='rounded-lg bg-teal-500 px-4 py-2 transition-all' variant='contained' onClick={handleOpen}>
          + New Project
        </Button> */}
        {/* <Modal
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
                <Button
                  className='me-4 border-[1px] border-primary bg-white text-primary hover:bg-primary hover:text-white'
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button className='bg-primary text-white hover:bg-primary-dark'>Submit</Button>
              </div>
            </div>
          </Box>
        </Modal> */}
        <Image src='/images/header/bell.png' alt='notification' width={40} height={40} className='me-4' />
        <Link href='/profile' className='mr-1 w-[40px] rounded-full hover:bg-sky-500'>
          <Image src='/images/header/account.svg' alt='profile' width={40} height={40} className='me-4 rounded-full' />
        </Link>
        <Image
          src='/icons/logout.svg'
          alt=''
          width={40}
          height={40}
          className='hover:cursor-pointer'
          onClick={() => handleSignOut()}
        />
      </div>
    </div>
  );
}
