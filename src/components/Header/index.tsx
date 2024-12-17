'use client';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Image from 'next/image';
import Link from 'next/link';
import { useContext, useState, useRef, useEffect } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

import AuthContext from '@/contexts/auth';
import NotificationService from '@/services/notification';

import NotificationMessage from '../NotificationMessage';
import { Spinner } from '../Spinner';
import User from '../User';

import { Notification } from '@/types/notification';

dayjs.extend(relativeTime);

type HeaderProps = {
  socket?: any;
};
export default function Header({ socket }: HeaderProps) {
  const [isShowNotification, setIsShowNotification] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>();

  const notificationRef = useRef<HTMLDivElement>(null);
  const { signOut } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      setNotifications(await NotificationService.getMyNotifications());
    })();
  }, []);

  useOnClickOutside(notificationRef, () => {
    setIsShowNotification(false);
  });

  const notReadNotifications = notifications?.filter((notification) => !notification.isRead);

  return (
    <div className='flex w-full items-center justify-between bg-[#3c3c3c] p-4'>
      <div className='flex items-center'>
        <Image src='/images/logo.png' alt='logo' width={40} height={40} className='me-3' />
        <h1 className='text-xl font-bold text-white'>TMS</h1>
      </div>
      <div className='flex'>
        <div ref={notificationRef} className='relative mr-3' onClick={() => setIsShowNotification((prev) => !prev)}>
          <div className='relative size-full cursor-pointer rounded-full p-1 hover:bg-[#135d66]'>
            <Image src='/images/header/bell.png' alt='notification' width={32} height={32} className='' />
            {notReadNotifications && notReadNotifications.length > 0 && (
              <div className='absolute right-0 top-0 flex aspect-square w-5 animate-bounce items-center justify-center rounded-full bg-red text-[8px] text-white'>
                {notReadNotifications.length}
              </div>
            )}
          </div>
          {isShowNotification && (
            <div
              onClick={(e) => e.stopPropagation()}
              className='absolute right-0 top-[48px] z-10 flex h-[800px] max-h-[800px] w-[500px] flex-col rounded border-[0.5px] bg-white shadow-md'
            >
              <div className='flex justify-between border-b-[1px] px-5 py-4'>
                <h4 className='text-lg font-bold text-primary'>Notifications</h4>
                <button
                  onClick={() => {
                    setNotifications(
                      notifications?.map((notification) => {
                        return { ...notification, isRead: true };
                      }),
                    );
                    NotificationService.markAllAsRead();
                  }}
                  className='text-primary-bright hover:underline'
                >
                  Mark all as read
                </button>
              </div>
              <div className='flex-grow overflow-auto'>
                {notifications ? (
                  notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className='relative flex cursor-pointer justify-between py-3 pe-5 ps-10 transition-all duration-75 hover:bg-slate-200'
                      onMouseLeave={() => {
                        if (notification.isRead) return;
                        setNotifications(
                          notifications?.map((n) => {
                            if (n._id === notification._id) {
                              return { ...n, isRead: true };
                            }
                            return n;
                          }),
                        );
                        NotificationService.readById(notification._id);
                      }}
                    >
                      <div className='flex'>
                        <div className='me-4 pt-1'>
                          <User
                            name={notification.author.fullName}
                            avatar={notification.author.avatar}
                            isDisplayName={false}
                          />
                        </div>
                        <NotificationMessage
                          authorName={notification.author.fullName}
                          target={notification.target}
                          type={notification.type}
                        />
                      </div>
                      <p className='text-nowrap text-xs font-light'>{dayjs(notification.createdAt).fromNow()}</p>
                      {!notification.isRead && (
                        <div className='absolute left-5 top-[calc(50%-8px)] size-2 rounded-full bg-primary-bright'></div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className='flex size-full items-center justify-center'>
                    <Spinner size='lg' />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <Link href='/profile' className='mr-3 rounded-full p-1 hover:bg-[#135d66]'>
          <Image src='/images/header/account.svg' alt='profile' width={32} height={32} />
        </Link>
        <Image
          src='/icons/logout.svg'
          alt=''
          width={32}
          height={32}
          className='hover:cursor-pointer'
          onClick={() => {
            if (socket) {
              socket.disconnect();
            }
            signOut();
          }}
        />
      </div>
    </div>
  );
}
