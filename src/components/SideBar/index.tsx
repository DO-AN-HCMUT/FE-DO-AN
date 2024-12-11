import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function Sidebar() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId')!;

  return (
    <div className='h-full min-w-[200px] cursor-pointer border-r-[1px] border-[#ccc] px-2 py-4 '>
      <Link
        className='mb-3 flex items-center justify-center rounded-lg px-4 py-2 transition-all duration-100 hover:bg-primary hover:text-white md:justify-normal'
        href='/'
      >
        <Image src='/images/sideBar/home.png' alt='home' width={20} height={20} className='me-3' />
        <p className='hidden md:inline'>Home</p>
      </Link>
      <Link
        className='mb-3 flex items-center justify-center rounded-lg px-4 py-2 transition-all duration-100 hover:bg-primary hover:text-white md:justify-normal'
        href='/calendar'
      >
        <Image src='/images/sideBar/timeline.png' alt='timeline' width={20} height={20} className='me-3' />
        <p className='hidden md:inline'>Calendar</p>
      </Link>

      <Link
        className='mb-3 flex items-center justify-center rounded-lg px-4 py-2 transition-all duration-100 hover:bg-primary hover:text-white md:justify-normal'
        href='/projects'
      >
        <Image src='/images/sideBar/project.png' alt='projects' width={20} height={20} className='me-3' />
        <p className='hidden md:inline'>Projects</p>
      </Link>

      {projectId && (
        <>
          <Link
            className='mb-3 flex items-center justify-center rounded-lg px-4 py-2 transition-all duration-100 hover:bg-primary hover:text-white md:justify-normal'
            href={`/projects/tasks?projectId=${projectId}`}
          >
            <Image src='/icons/task.svg' alt='projects' width={20} height={20} className='me-3 ms-4' />
            <p className='hidden md:inline'>Tasks</p>
          </Link>

          <Link
            className='mb-3 flex items-center justify-center rounded-lg px-4 py-2 transition-all duration-100 hover:bg-primary hover:text-white md:justify-normal'
            href={`/projects/members?projectId=${projectId}`}
          >
            <Image src='/icons/group.svg' alt='projects' width={20} height={20} className='me-3 ms-4' />
            <p className='hidden md:inline'>Members</p>
          </Link>
        </>
      )}
      <Link
        className='mb-3 flex items-center justify-center rounded-lg px-4 py-2 transition-all duration-100 hover:bg-primary hover:text-white md:justify-normal'
        href='/chat'
      >
        <Image src='/images/sideBar/message.png' alt='message' width={20} height={20} className='me-3' />
        <p className='hidden md:inline'>Messagess</p>
      </Link>
    </div>
  );
}
