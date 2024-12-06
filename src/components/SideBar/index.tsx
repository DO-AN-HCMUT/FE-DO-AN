import { Tooltip, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function SideBar() {
  const isMdOrSmaller = useMediaQuery('(max-width:960px)');
  const searchParams = useSearchParams();

  const projectId = searchParams.get('project-id')!;

  return (
    <div className='h-full min-w-[200px] cursor-pointer border-r-[1px] border-[#ccc] px-2 py-4 '>
      <Tooltip title='Home' disableHoverListener={!isMdOrSmaller}>
        <Link
          className='mb-3 flex items-center justify-center rounded-lg px-4 py-2 transition-all duration-75 hover:bg-primary hover:text-white md:justify-normal'
          href='/'
        >
          <Image src='/images/sideBar/home.png' alt='home' width={20} height={20} className='me-3' />
          <p className='hidden md:inline'>Home</p>
        </Link>
      </Tooltip>
      <Tooltip title='Timeline' disableHoverListener={!isMdOrSmaller}>
        <Link
          className='mb-3 flex items-center justify-center rounded-lg px-4 py-2 transition-all duration-75 hover:bg-primary hover:text-white md:justify-normal'
          href='/calendar'
        >
          <Image src='/images/sideBar/timeline.png' alt='timeline' width={20} height={20} className='me-3' />
          <p className='hidden md:inline'>Calendar</p>
        </Link>
      </Tooltip>

      <Tooltip title='Projects' disableHoverListener={!isMdOrSmaller}>
        <Link
          className='mb-3 flex items-center justify-center rounded-lg px-4 py-2 transition-all duration-75 hover:bg-primary hover:text-white md:justify-normal'
          href='/projects'
        >
          <Image src='/images/sideBar/project.png' alt='projects' width={20} height={20} className='me-3' />
          <p className='hidden md:inline'>Projects</p>
        </Link>
      </Tooltip>
      {projectId && (
        <Tooltip title='Members' disableHoverListener={!isMdOrSmaller}>
          <Link
            className='mb-3 flex items-center justify-center rounded-lg px-4 py-2 transition-all duration-75 hover:bg-primary hover:text-white md:justify-normal'
            href={`/projects/members?project-id=${projectId}`}
          >
            <Image src='/images/sideBar/members.png' alt='members' width={20} height={20} className='me-3' />
            <p className='hidden md:inline'>Members</p>
          </Link>
        </Tooltip>
      )}
      <Tooltip title='Messages' disableHoverListener={!isMdOrSmaller}>
        <Link
          className='mb-3 flex items-center justify-center rounded-lg px-4 py-2 transition-all duration-75 hover:bg-primary hover:text-white md:justify-normal'
          href='/chat'
        >
          <Image src='/images/sideBar/message.png' alt='message' width={20} height={20} className='me-3' />
          <p className='hidden md:inline'>Messages</p>
        </Link>
      </Tooltip>
    </div>
  );
}
