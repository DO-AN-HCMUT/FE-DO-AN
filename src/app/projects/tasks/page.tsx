'use client';

import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';

import Button from '@/components/Button';
import Header from '@/components/Header';
import SideBar from '@/components/SideBar';
import TaskForm from '@/components/Task/TaskForm';
import TasksModal from '@/components/TasksComponent/Modal';
import User from '@/components/User';
import { TASK_STATUS_COLOR } from '@/constants/common';
import api from '@/services/api';
import ProjectService from '@/services/project';
import getStatusString from '@/utils/get-status-string';

import Task from '@/types/task';

export default function TaskPage() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalItem, setModalItem] = useState<Task>();
  const [isAdding, setIsAdding] = useState(false);
  const [projectName, setProjectName] = useState<string>();
  const [tasks, setTasks] = useState<Task[]>();
  const [search, setSearch] = useState('');
  const handleOpen = (item: Task) => {
    setIsOpenModal(true);
    setModalItem(item);
  };
  const handleDelete = async () => {
    try {
      await api.delete(`/project/${projectId}/deleteProject`);
      window.location.href = '/projects';
    } catch (error: any) {
      if (error?.response?.data.message === 'TokenExpiredError') {
        toast.error('Please log in', { position: 'bottom-center' });
      } else {
        toast.error(typeof error?.response?.data == 'object' ? error?.response?.data.message : error?.message);
      }
    }
  };
  const taskFormRef = useRef<HTMLTableRowElement>(null);
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project-id')!;

  const fetchTasks = useCallback(async () => {
    const response = await ProjectService.getProjectById(projectId);
    setProjectName(response.name);
    setTasks(await ProjectService.getAllTasksByProjectId(projectId));
  }, [projectId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    if (isAdding) {
      taskFormRef.current?.querySelector('input')?.focus();
    }
  }, [isAdding]);

  if (!projectName || !tasks) return null;

  return (
    <>
      <div className='flex h-screen w-full flex-col'>
        {/* HEADER */}
        <Header />
        {/* BODY */}
        <div className='flex flex-grow overflow-hidden'>
          <SideBar />
          <div className='flex flex-grow flex-col items-start p-10'>
            <h1 className='mb-2 text-lg'>
              <Link className='hover:underline' href='/projects'>
                Projects
              </Link>{' '}
              / {projectName}
            </h1>
            <h2 className='mb-5 text-3xl font-bold text-primary'>Tasks</h2>
            <div className='flex w-full flex-row items-center justify-between'>
              <Button
                className='mb-5'
                onClick={() => {
                  setIsAdding(true);
                }}
              >
                + New task
              </Button>
              <Button
                className='mb-5 bg-red'
                onClick={() => {
                  handleDelete();
                }}
              >
                Delete This Project
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
              <button className='inline-flex items-center rounded border p-2'>
                <img className='me-2' src='/icons/tune.svg' alt='tune-icon' />
                <span>Filter</span>
              </button>
              <button className='inline-flex items-center rounded border p-2'>
                <img className='me-2' src='/icons/sort.svg' alt='sort-icon' />
                <span>Sort</span>
              </button>
            </div>

            {/* TASKS */}
            <div className='self-center overflow-auto pb-5'>
              {tasks.length > 0 || isAdding ? (
                <table className='w-full table-fixed border-collapse'>
                  <thead>
                    <tr className='h-12 rounded-lg bg-[#e4f8fa]'>
                      <th className='w-[10%] ps-4 text-left'>Key</th>
                      <th className='w-[45%] ps-4 text-left'>Title</th>
                      <th className='w-[15%] ps-4 text-left'>Assignee</th>
                      <th className='w-[15%] ps-4'>Status</th>
                      <th className='w-[15%] ps-4 text-left'>Deadline</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isAdding && (
                      <TaskForm
                        ref={taskFormRef}
                        key={tasks.length}
                        projectId={projectId}
                        onBlur={() => {
                          setIsAdding(false);
                        }}
                        onAddTaskSuccess={() => {
                          fetchTasks();
                          setIsAdding(false);
                        }}
                      />
                    )}
                    {tasks
                      .filter((task) => {
                        const lowerCaseSearch = search.toLowerCase();
                        return (
                          task.title.toLowerCase().includes(lowerCaseSearch) ||
                          task.key.toLowerCase().includes(lowerCaseSearch)
                        );
                      })
                      .map((task) => {
                        const exceedUser = task.registeredMembers.slice(3).length;

                        return (
                          <tr
                            className='h-12 cursor-pointer border-b transition-all duration-100 hover:bg-[#0b363b10]'
                            key={task.key}
                            onClick={() => handleOpen(task)}
                          >
                            <td className='px-4'>{task.key}</td>
                            <td className='px-4'>{task.title}</td>
                            <td className='px-4'>
                              <div className='flex space-x-1'>
                                {task.registeredMembers.slice(0, 3).map((user) => (
                                  <User
                                    key={user._id}
                                    name={user.fullName}
                                    avatar={user.avatar ?? '/icons/avatar.svg'}
                                    isDisplayName={task.registeredMembers.length < 2}
                                  />
                                ))}
                                {exceedUser > 0 && (
                                  <span className='inline rounded-full bg-gray-300 px-2 py-1 text-black'>
                                    +{exceedUser}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className='px-4 text-center'>
                              {task.status && (
                                <div
                                  style={TASK_STATUS_COLOR[task.status]}
                                  className='inline rounded bg-green px-2 py-1 font-semibold text-white'
                                >
                                  {getStatusString(task.status)}
                                </div>
                              )}
                            </td>
                            <td className='px-4'>{task.endDate ? dayjs(task.endDate).format('DD/MM/YYYY') : ''}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              ) : (
                <div className='mt-20 flex w-full flex-col items-center'>
                  <Image src='/images/no-task.png' alt='no-task' width={200} height={200} className='mb-3' />
                  <p className='text-lg'>There are no task in this project. Add task now!</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <TasksModal isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal} taskId={modalItem?._id} />
      </div>
      {/* <TaskFilterModal /> */}
    </>
  );
}
