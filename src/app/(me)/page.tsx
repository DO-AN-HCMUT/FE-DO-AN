/* eslint-disable max-lines-per-function */

'use client';

import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

import Header from '@/components/Header';
import SideBar from '@/components/SideBar';
import api from '@/services/api';
import storage from '@/utils/storage';

export default function MePage() {
  const [isAuthStatusReady, setIsAuthStatusReady] = useState(false);

  useEffect(() => {
    if (!storage.getItem('token')) {
      redirect('/auth/sign-in');
    } else {
      checkToken();
    }
    setIsAuthStatusReady(true);
  }, []);
  const checkToken = async () => {
    try {
      const result = await api.post('/auth/checkToken');
      if (!result.data.success) {
        redirect('/auth/sign-in');
      }
    } catch (error) {
      window.localStorage.removeItem('token');
      window.location.href = '/auth/sign-in';
    }
  };
  if (!isAuthStatusReady) return null;

  return (
    <div className='h-screen'>
      {/* HEADER */}
      <Header />
      {/* BODY */}
      <div className='flex h-full pt-[72px]'>
        <SideBar />
        {/* CONTENT */}
        <div className='flex w-11/12 items-stretch bg-[#eee] px-10 py-12'>
          <div className='flex flex-[2] flex-col justify-between pe-10'>
            <div className='rounded-2xl border-[1px] bg-white p-5'>
              <h3 className='mb-5 text-3xl font-bold text-primary'>Today Tasks</h3>
              <div className='px-3'>
                <div className='mb-4 flex'>
                  <div className='flex-[1] font-semibold text-primary'>ID</div>
                  <div className='flex-[3] font-semibold text-primary'>Name</div>
                  <div className='flex-[1] font-semibold text-primary'>Status</div>
                  <div className='flex-[2] font-semibold text-primary'>Deadline</div>
                  <div className='flex-[2] font-semibold text-primary'>Project</div>
                </div>
                <div className='item-center mb-3 flex'>
                  <div className='flex-[1]'>P01_01</div>
                  <div className='flex-[3]'>Integrate API to Frontend</div>
                  <div className='flex-[1]'>
                    <div className='inline rounded-3xl border-[1px] border-[#ccc] bg-green px-3 py-1 text-white'>
                      Done
                    </div>
                  </div>
                  <div className='flex-[2]'>2021-10-10</div>
                  <div className='flex-[2]'>
                    <div className='inline rounded-lg border-[1px] border-[#ccc] bg-[#B64DD0] px-3 py-1 text-white'>
                      Project 1
                    </div>
                  </div>
                </div>
                <div className='item-center mb-3 flex'>
                  <div className='flex-[1]'>P01_02</div>
                  <div className='flex-[3]'>Complete API Document</div>
                  <div className='flex-[1]'>
                    <div className='inline rounded-3xl border-[1px] border-[#ccc] bg-green px-3 py-1 text-white'>
                      Done
                    </div>
                  </div>
                  <div className='flex-[2]'>2021-10-10</div>
                  <div className='flex-[2]'>
                    <div className='inline rounded-lg border-[1px] border-[#ccc] bg-[#B64DD0] px-3 py-1 text-white'>
                      Project 1
                    </div>
                  </div>
                </div>
                <div className='item-center mb-3 flex'>
                  <div className='flex-[1]'>P02_01</div>
                  <div className='flex-[3]'>Insert mock data to database</div>
                  <div className='flex-[1]'>
                    <div className='inline rounded-3xl border-[1px] border-[#ccc] bg-red px-3 py-1 text-white'>
                      Overdue
                    </div>
                  </div>
                  <div className='flex-[2]'>2021-10-10</div>
                  <div className='flex-[2]'>
                    <div className='inline rounded-lg border-[1px] border-[#ccc] bg-[#4DC8D0] px-3 py-1 text-white'>
                      Project 2
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='rounded-2xl border-[1px] bg-white p-5'>
              <h3 className='mb-5 text-3xl font-bold text-primary'>My Projects</h3>
              <div className='px-3'>
                <div className='mb-4 rounded-lg border-[1px] border-[#ccc] px-6 py-4'>
                  <h5 className='mb-2 text-2xl font-semibold'>Project 1</h5>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates temporibus eos distinctio fugiat
                    cumque est eaque commodi iure, nulla explicabo, facilis aperiam ea ex et quam aliquam ipsum incidunt
                    error?
                  </p>
                </div>
                <div className='mb-4 rounded-lg border-[1px] border-[#ccc] px-6 py-4'>
                  <h5 className='mb-2 text-2xl font-semibold'>Project 2</h5>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates temporibus eos distinctio fugiat
                    cumque est eaque commodi iure, nulla explicabo, facilis aperiam ea ex et quam aliquam ipsum incidunt
                    error?
                  </p>
                </div>
                <div className='mb-4 rounded-lg border-[1px] border-[#ccc] px-6 py-4'>
                  <h5 className='mb-2 text-2xl font-semibold'>Project 3</h5>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates temporibus eos distinctio fugiat
                    cumque est eaque commodi iure, nulla explicabo, facilis aperiam ea ex et quam aliquam ipsum incidunt
                    error?
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='flex-[1] rounded-2xl border-[1px] bg-white p-5'>
            <h3 className='mb-3 text-3xl font-bold text-primary'>Incoming Tasks</h3>
            <div className='px-3'>
              <div className='mb-4 flex flex-col rounded-lg border-[1px] p-5'>
                <div className='mb-3 flex justify-between'>
                  <div className='inline rounded-3xl bg-[#e0e0e0] px-6 py-2 font-medium text-primary'>P01_03</div>
                  <div className='flex items-center rounded-lg border-[1px] border-[#ccc] bg-[#B64DD0] px-3 py-1 text-white'>
                    Project 1
                  </div>
                </div>
                <div>
                  <div className='mb-4 text-lg font-medium'>Re-config ESlint to new convention</div>
                  <div className='mb-2'>
                    Status:{' '}
                    <div className='inline rounded-3xl border-[1px] border-[#ccc] bg-[#FFE0B1] px-3 py-1'>
                      In Progress
                    </div>
                  </div>
                  <div>Deadline: 15/05/2024</div>
                </div>
              </div>
              <div className='mb-4 flex flex-col rounded-lg border-[1px] p-5'>
                <div className='mb-3 flex justify-between'>
                  <div className='inline rounded-3xl bg-[#e0e0e0] px-6 py-2 font-medium text-primary'>P02_02</div>
                  <div className='flex items-center rounded-lg border-[1px] border-[#ccc] bg-[#4DC8D0] px-3 py-1 text-white'>
                    Project 2
                  </div>
                </div>
                <div>
                  <div className='mb-4 text-lg font-medium'>Fix modal not responding to click events</div>
                  <div className='mb-2'>
                    Status:{' '}
                    <div className='inline rounded-3xl border-[1px] border-[#ccc] bg-[#FFE0B1] px-3 py-1'>
                      In Progress
                    </div>
                  </div>
                  <div>Deadline: 15/05/2024</div>
                </div>
              </div>
              <div className='mb-4 flex flex-col rounded-lg border-[1px] p-5'>
                <div className='mb-3 flex justify-between'>
                  <div className='inline rounded-3xl bg-[#e0e0e0] px-6 py-2 font-medium text-primary'>P03_01</div>
                  <div className='flex items-center rounded-lg border-[1px] border-[#ccc] bg-[#208a50] px-3 py-1 text-white'>
                    Project 3
                  </div>
                </div>
                <div>
                  <div className='mb-4 text-lg font-medium'>Init code base</div>
                  <div className='mb-2'>
                    Status:{' '}
                    <div className='inline rounded-3xl border-[1px] border-[#ccc] bg-[#e0e0e0] px-3 py-1'>
                      Not Started
                    </div>
                  </div>
                  <div>Deadline: 15/05/2024</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
