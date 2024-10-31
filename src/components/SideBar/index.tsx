import { Tooltip, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

export default function SideBar() {
  const isMdOrSmaller = useMediaQuery('(max-width:960px)');
  return (
    <div className='h-full w-[15%] cursor-pointer border-r-[1px] border-[#ccc] px-2 py-4 '>
      <Tooltip title='Home' disableHoverListener={!isMdOrSmaller}>
        <Link
          className='mb-3 flex items-center justify-center rounded-lg px-4 py-2 hover:bg-primary hover:text-white md:justify-normal'
          href='/'
        >
          <Image src='/images/sideBar/home.png' alt='home' width={20} height={20} className='me-3' />
          <p className='hidden md:inline'>Home</p>
        </Link>
      </Tooltip>
      <Tooltip title='Dashboard' disableHoverListener={!isMdOrSmaller}>
        <div className='mb-3 flex items-center justify-center rounded-lg px-4 py-2 hover:bg-primary hover:text-white md:justify-normal'>
          <Image src='/images/sideBar/dashboard.png' alt='dashboard' width={20} height={20} className='me-3' />
          <p className='hidden md:inline'>Dashboard</p>
        </div>
      </Tooltip>
      <Tooltip title='Task' disableHoverListener={!isMdOrSmaller}>
        <div className='mb-3 flex items-center justify-center rounded-lg px-4 py-2 hover:bg-primary hover:text-white md:justify-normal'>
          <Image src='/images/sideBar/task.png' alt='task' width={20} height={20} className='me-3' />
          <p className='hidden md:inline'>Task</p>
        </div>
      </Tooltip>
      <Tooltip title='Timeline' disableHoverListener={!isMdOrSmaller}>
        <Link
          className='mb-3 flex items-center justify-center rounded-lg px-4 py-2 hover:bg-primary hover:text-white md:justify-normal'
          href='/calendar'
        >
          <Image src='/images/sideBar/timeline.png' alt='timeline' width={20} height={20} className='me-3' />
          <p className='hidden md:inline'>Timeline</p>
        </Link>
      </Tooltip>

      <Tooltip title='Messages' disableHoverListener={!isMdOrSmaller}>
        <Link
          className='mb-3 flex items-center justify-center rounded-lg px-4 py-2 hover:bg-primary hover:text-white md:justify-normal'
          href='/chat'
        >
          <Image src='/images/sideBar/message.png' alt='message' width={20} height={20} className='me-3' />
          <p className='hidden md:inline'>Messages</p>
        </Link>
      </Tooltip>
    </div>
  );
}
