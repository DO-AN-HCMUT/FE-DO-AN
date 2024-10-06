import Image from 'next/image';
import Link from 'next/link';

export default function SideBar() {
  return (
    <div className='h-full w-[15%] cursor-pointer border-r-[1px] border-[#ccc] px-2 py-4'>
      <Link className='mb-3 flex items-center rounded-lg px-4 py-2 hover:bg-primary hover:text-white' href='/'>
        <Image src='/images/sideBar/home.png' alt='home' width={20} height={20} className='me-3' />
        <p>Home</p>
      </Link>
      <div className='mb-3 flex items-center rounded-lg px-4 py-2 hover:bg-primary hover:text-white'>
        <Image src='/images/sideBar/dashboard.png' alt='dashboard' width={20} height={20} className='me-3' />
        <p>Dashboard</p>
      </div>
      <div className='mb-3 flex items-center rounded-lg px-4 py-2 hover:bg-primary hover:text-white'>
        <Image src='/images/sideBar/task.png' alt='task' width={20} height={20} className='me-3' />
        <p>Task</p>
      </div>
      <div className='mb-3 flex items-center rounded-lg px-4 py-2 hover:bg-primary hover:text-white'>
        <Image src='/images/sideBar/timeline.png' alt='timeline' width={20} height={20} className='me-3' />
        <p>Timeline</p>
      </div>
      <Link className='mb-3 flex items-center rounded-lg px-4 py-2 hover:bg-primary hover:text-white' href='/chat'>
        <Image src='/images/sideBar/message.png' alt='message' width={20} height={20} className='me-3' />
        <p>Messages</p>
      </Link>
    </div>
  );
}
