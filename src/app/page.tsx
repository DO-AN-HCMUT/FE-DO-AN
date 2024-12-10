'use client';

import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Spinner } from '@/components/Spinner';
import User from '@/components/User';
import { COLOR_PAIRS, TASK_STATUS_COLOR } from '@/constants/common';
import api from '@/services/api';
import TaskService from '@/services/task';
import UserService from '@/services/user';
import { hashStringToRange } from '@/utils/common';
import getStatusString from '@/utils/get-status-string';
import storage from '@/utils/storage';

import { GetAllProjectDto } from '@/types/project';
import { GetMyTaskDto } from '@/types/task';
import { TaskStatus } from '@/types/task-status';

dayjs.extend(isBetween);

export default function MePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthStatusReady, setIsAuthStatusReady] = useState(false);
  const [tasks, setTasks] = useState<GetMyTaskDto>();
  const [projects, setProjects] = useState<GetAllProjectDto>();

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

  useEffect(() => {
    if (!storage.getItem('token')) {
      redirect('/auth/sign-in');
    } else {
      checkToken();
    }
    setIsAuthStatusReady(true);
  }, []);

  useEffect(() => {
    (async () => {
      setTasks(await TaskService.getMyTasks());
      setProjects(await UserService.getMyProjects());
      setIsLoading(false);
    })();
  }, []);

  if (!isAuthStatusReady || !tasks || !projects) return null;

  const dueTasks = tasks.filter(
    (task) => task.status !== TaskStatus.DONE && dayjs(task.endDate).isSame(dayjs(), 'day'),
  );
  const thisWeekTasks = tasks.filter(
    (task) =>
      task.status !== TaskStatus.DONE && dayjs(task.endDate).isBetween(dayjs().add(1, 'day'), dayjs().add(7, 'day')),
  );

  const dueTasksToDisplay = dueTasks?.slice(0, 3);
  const remainingDueTasksCount = dueTasks?.length - 3;

  return (
    <div className='flex max-h-screen flex-col'>
      {/* HEADER */}
      <Header />
      {/* BODY */}
      <div className='flex h-screen flex-grow overflow-hidden'>
        <Sidebar />
        {/* CONTENT */}
        <div className='flex w-11/12 items-stretch bg-[#eee] p-5'>
          <div className='flex flex-[2] flex-col pe-10'>
            <div className='flex flex-col rounded-2xl border-[1px] bg-white p-5'>
              <h3 className='mb-5 text-3xl font-bold text-primary'>Tasks Due Today</h3>
              {isLoading ? (
                <div className='flex flex-grow flex-col items-center justify-center'>
                  <Spinner size='lg' />
                </div>
              ) : dueTasks.length > 0 ? (
                <div className='px-3'>
                  <div className='mb-4 flex'>
                    <div className='flex-[1] font-semibold text-primary'>Key</div>
                    <div className='flex-[3] font-semibold text-primary'>Name</div>
                    <div className='flex-[1.5] font-semibold text-primary'>Status</div>
                    <div className='flex-[1.2] font-semibold text-primary'>Deadline</div>
                    <div className='flex-[2] font-semibold text-primary'>Project</div>
                  </div>
                  {dueTasksToDisplay.map((task) => (
                    <div key={task._id} className='item-center mb-5 flex'>
                      <div className='flex-[1]'>{task.key}</div>
                      <div className='flex-[3]'>{task.title}</div>
                      <div className='flex-[1.5]'>
                        <div
                          style={TASK_STATUS_COLOR[task.status]}
                          className='inline rounded-3xl border-[1px] border-[#ccc] px-3 py-1'
                        >
                          {getStatusString(task.status)}
                        </div>
                      </div>
                      <div className='flex-[1.2]'>{dayjs(task.endDate).format('DD/MM/YYYY')}</div>
                      <div className='flex-[2]'>
                        <div
                          style={COLOR_PAIRS[hashStringToRange(task.project.name)]}
                          className='inline rounded-lg border-[1px] border-[#ccc] px-3 py-1'
                        >
                          {task.project.name}
                        </div>
                      </div>
                    </div>
                  ))}
                  {remainingDueTasksCount > 0 && <p className='italic underline'>{remainingDueTasksCount} more</p>}
                </div>
              ) : (
                <div className='flex flex-grow flex-col justify-center'>
                  <p className='text-center'>You have no task dues today.</p>
                </div>
              )}
            </div>
            <div className='mt-2 flex flex-grow flex-col overflow-hidden rounded-2xl border-[1px] bg-white p-5'>
              <h3 className='mb-5 text-3xl font-bold text-primary'>My Projects</h3>
              {isLoading ? (
                <div className='flex flex-grow flex-col items-center justify-center'>
                  <Spinner size='lg' />
                </div>
              ) : projects.length > 0 ? (
                <div className='overflow-y-auto overflow-x-visible px-5 py-2'>
                  {projects?.map((project) => (
                    <Link
                      href={`/projects/tasks?projectId=${project._id}`}
                      key={project._id}
                      className='mb-4 block rounded-lg border-[1px] border-[#ccc] px-6 py-4 shadow transition-all duration-100 hover:scale-105'
                    >
                      <div className='mb-5 flex items-center justify-between'>
                        <div className='flex items-center'>
                          <h5 className='me-3 border-s-4 border-primary ps-2 text-2xl font-semibold'>{project.name}</h5>
                          <h6 className='text-lg font-bold text-primary'>({project.key})</h6>
                        </div>
                        <User name={project.leader.fullName} avatar={project.leader.avatar} />
                      </div>
                      <p className='mb-5 font-light'>{project.description}</p>
                      <div className='flex space-x-1'>
                        <Image src='/icons/calendar.svg' alt='calendar' width={20} height={20} className='' />
                        <p>Created at: {dayjs(project.createdAt).format('DD/MM/YYYY')}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className='flex flex-grow flex-col justify-center'>
                  <p className='text-center'>
                    You do not belong to any project. Go to{' '}
                    <a className='font-bold text-primary hover:underline' href='/projects'>
                      Project
                    </a>{' '}
                    to create a new project.
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className='flex flex-[1] flex-col rounded-2xl border-[1px] bg-white p-5'>
            <h3 className='mb-3 text-3xl font-bold text-primary'>Incoming Tasks This Week</h3>
            {isLoading ? (
              <div className='flex flex-grow flex-col items-center justify-center'>
                <Spinner size='lg' />
              </div>
            ) : thisWeekTasks.length > 0 ? (
              <div className='overflow-auto px-3'>
                {thisWeekTasks.map((task) => (
                  <div key={task._id} className='mb-4 flex flex-col rounded-lg border-[1px] p-5'>
                    <div className='mb-3 flex justify-between'>
                      <div className='inline rounded-3xl bg-[#e0e0e0] px-6 py-2 font-medium text-primary'>
                        {task.key}
                      </div>
                      <div className='flex items-center rounded-lg border-[1px] border-[#ccc] bg-[#B64DD0] px-3 py-1 text-white'>
                        {task.project.name}
                      </div>
                    </div>
                    <div>
                      <div className='mb-4 text-lg font-medium'>{task.title}</div>
                      <div className='mb-2'>
                        Status:{' '}
                        <div
                          style={TASK_STATUS_COLOR[task.status]}
                          className='inline rounded-3xl border-[1px] border-[#ccc] px-3 py-1'
                        >
                          {getStatusString(task.status)}
                        </div>
                      </div>
                      <div>Deadline: {dayjs(task.endDate).format('DD/MM/YYYY')}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='flex flex-grow flex-col justify-center'>
                <p className='text-center'>You have to task dues this week.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
