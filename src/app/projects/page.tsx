'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import Button from '@/components/Button';
import CreateProjectModal from '@/components/CreateProjectModal';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Spinner } from '@/components/Spinner';
import User from '@/components/User';
import UserService from '@/services/user';

import { GetAllProjectDto } from '@/types/project';

export default function Projects() {
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<GetAllProjectDto>();
  const [isAdding, setIsAdding] = useState(false);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<string>();
  const [sortType, setSortType] = useState<number>(1);

  const router = useRouter();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      setProjects(await UserService.getMyProjects());
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
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!projects || isLoading)
    return (
      <div className='flex h-screen w-full items-center justify-center'>
        <Spinner size='lg' />
      </div>
    );

  const processedProjects = projects.filter((project: any) =>
    project.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div className='flex h-screen flex-col justify-start'>
        {/* HEADER */}
        <Header />
        {/* BODY */}
        <div className='flex h-screen flex-row'>
          <Sidebar />
          <div className='flex flex-grow flex-col items-start p-10'>
            <h2 className='mb-5 text-3xl font-bold text-primary'>Projects</h2>
            <div className='flex w-full flex-row items-center justify-between'>
              <Button
                className='mb-5'
                onClick={() => {
                  setIsAdding(true);
                }}
              >
                + New project
              </Button>
            </div>

            {/* UTILITY BUTTONS */}
            <div className='mb-4 flex w-full items-center space-x-2'>
              <div className='flex flex-grow items-center rounded-lg border px-2'>
                <img src='/icons/search.svg' alt='search-icon' />
                <input
                  value={search}
                  onInput={(e) => {
                    setSearch(e.currentTarget.value);
                  }}
                  type='text'
                  className='ml-2 h-10 w-full border-l px-2 outline-none'
                />
              </div>
            </div>

            {/* TASKS */}
            <div className='self-center overflow-auto pb-5'>
              {processedProjects.length > 0 ? (
                <table className='w-full table-fixed border-collapse'>
                  <thead>
                    <tr className='h-12 rounded-lg bg-[#e4f8fa]'>
                      <th className='w-[10%] ps-4 text-left'>No.</th>
                      <th className='w-[45%] ps-4 text-left'>
                        <div
                          className='inline-flex cursor-pointer space-x-1'
                          onClick={() => {
                            setSortField('name');
                            setSortType(sortType * -1);
                          }}
                        >
                          <span className='select-none'>Name</span>
                          {sortField === 'name' &&
                            (sortType === -1 ? (
                              <Image src='/icons/arrow_up.svg' alt='arrow-up' width={20} height={20} />
                            ) : (
                              <Image src='/icons/arrow_down.svg' alt='arrow-up' width={20} height={20} />
                            ))}
                        </div>
                      </th>
                      <th className='w-[15%] ps-4 text-left'>Key</th>
                      <th className='w-[15%] ps-4 text-center'>Members</th>
                      <th className='w-[15%]'>
                        <div
                          className='inline-flex cursor-pointer space-x-1'
                          onClick={() => {
                            setSortField('leader');
                            setSortType(sortType * -1);
                          }}
                        >
                          <span className='select-none'>Leader</span>
                          {sortField === 'leader' &&
                            (sortType === -1 ? (
                              <Image src='/icons/arrow_up.svg' alt='arrow-up' width={20} height={20} />
                            ) : (
                              <Image src='/icons/arrow_down.svg' alt='arrow-up' width={20} height={20} />
                            ))}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedProjects.map((project, index) => {
                      return (
                        <>
                          <tr
                            className='h-12 cursor-pointer border-b transition-all duration-100 hover:bg-[#0b363b10]'
                            key={project.key}
                            onClick={() => router.push(`/projects/tasks?projectId=${project._id}`)}
                          >
                            <td className='px-4'>{index + 1}</td>
                            <td className='px-4'>{project.name}</td>
                            <td className='px-4'>{project.key}</td>
                            <td className='px-4 text-center'>{project.memberIds.length}</td>
                            <td className='px-4'>
                              <User name={project.leader.fullName} avatar={project.leader.avatar} />
                            </td>
                          </tr>
                        </>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className='mt-20 flex w-full flex-col items-center'>
                  <Image src='/images/no-task.png' alt='no-task' width={200} height={200} className='mb-3' />
                  <p className='text-lg'>You have no project. Create one now!</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <CreateProjectModal
          isAdding={isAdding}
          onClose={() => {
            setIsAdding(false);
          }}
          onSubmitSuccess={fetchData}
        />
      </div>
    </div>
  );
}
