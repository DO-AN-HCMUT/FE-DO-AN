'use client';

import { Modal, Box, Typography, Tooltip } from '@mui/material';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import toast from 'react-hot-toast';

import Button from '@/components/Button';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Spinner } from '@/components/Spinner';
import TaskForm from '@/components/Task/TaskForm';
import TasksModal from '@/components/TasksComponent/Modal';
import TaskStatus from '@/components/TaskStatus';
import User from '@/components/User';
import api from '@/services/api';
import ProjectService from '@/services/project';

import { GetProjectByIdDto } from '@/types/project';
import Task from '@/types/task';
import UserType from '@/types/user';

export default function TaskPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState<string>();
  const [isAdding, setIsAdding] = useState(false);
  const [project, setProject] = useState<GetProjectByIdDto>();
  const [tasks, setTasks] = useState<Task[]>();
  const [search, setSearch] = useState('');
  const [memberOptions, setMemberOptions] = useState<UserType[]>();
  const [sortType, setSortType] = useState<number>(1);
  const [sortField, setSortField] = useState<string>('key');
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);

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
  const projectId = searchParams.get('projectId')!;

  const fetchMemberOptions = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await api.get(`/project/${projectId}/members`);
      setMemberOptions(result.data.payload);
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
  }, [projectId]);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    const response = await ProjectService.getProjectById(projectId);
    setProject(response);
    setTasks(await ProjectService.getAllTasksByProjectId(projectId));
    setIsLoading(false);
  }, [projectId]);

  useEffect(() => {
    fetchTasks();
    fetchMemberOptions();
  }, [fetchTasks, fetchMemberOptions]);

  useEffect(() => {
    if (isAdding) {
      taskFormRef.current?.querySelector('input')?.focus();
    }
  }, [isAdding]);

  const processedTasks = useMemo(
    () =>
      tasks
        ?.filter((task) => {
          const lowerCaseSearch = search.toLowerCase();
          return task.title.toLowerCase().includes(lowerCaseSearch) || task.key.toLowerCase().includes(lowerCaseSearch);
        })
        .sort((a, b) => {
          switch (sortField) {
            case 'key': {
              const keyA = parseInt(a.key.split('-')[1]);
              const keyB = parseInt(b.key.split('-')[1]);
              return sortType * (keyA - keyB);
            }
            case 'title':
              return sortType * a.title.localeCompare(b.title);
            case 'status': {
              const statusOrder = ['TO_DO', 'IN_PROGRESS', 'DONE'];
              return sortType * (statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));
            }
            case 'endDate': {
              const dateA = a.endDate ? new Date(a.endDate).getTime() : 0;
              const dateB = b.endDate ? new Date(b.endDate).getTime() : 0;
              return sortType * (dateA - dateB);
            }
          }
          return 0;
        }),
    [tasks, sortField, sortType, search],
  );

  if (!project || !processedTasks || !tasks || !memberOptions || isLoading)
    return (
      <div className='flex h-screen w-full items-center justify-center'>
        <Spinner size='lg' />
      </div>
    );

  return (
    <>
      <div className='flex h-screen w-full flex-col'>
        {/* HEADER */}
        <Header />
        {/* BODY */}
        <div className='flex flex-grow overflow-hidden'>
          <Sidebar />
          <div className='flex flex-grow flex-col items-start p-10'>
            <h1 className='mb-2 text-lg'>
              <Link className='hover:underline' href='/projects'>
                Projects
              </Link>{' '}
              / {project.name}
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
              {project.isMeLeader && (
                <Button
                  type='negative'
                  className='mb-5'
                  onClick={() => {
                    setIsShowDeleteModal(true);
                  }}
                >
                  Delete This Project
                </Button>
              )}
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
            <div className='flex-grow self-center overflow-auto pb-5'>
              {processedTasks.length > 0 || isAdding ? (
                <table className='w-full table-fixed border-collapse'>
                  <thead>
                    <tr className='h-12 rounded-lg bg-[#e4f8fa]'>
                      <th className='w-[10%] ps-4 text-left'>
                        <div
                          className='inline-flex cursor-pointer space-x-1'
                          onClick={() => {
                            setSortField('key');
                            setSortType(sortType * -1);
                          }}
                        >
                          <span className='select-none'>Key</span>
                          {sortField === 'key' &&
                            (sortType === -1 ? (
                              <Image src='/icons/arrow_up.svg' alt='arrow-up' width={20} height={20} />
                            ) : (
                              <Image src='/icons/arrow_down.svg' alt='arrow-up' width={20} height={20} />
                            ))}
                        </div>
                      </th>
                      <th className='w-[45%] ps-4 text-left'>
                        <div
                          className='inline-flex cursor-pointer space-x-1'
                          onClick={() => {
                            setSortField('title');
                            setSortType(sortType * -1);
                          }}
                        >
                          <span className='select-none'>Title</span>
                          {sortField === 'title' &&
                            (sortType === -1 ? (
                              <Image src='/icons/arrow_up.svg' alt='arrow-up' width={20} height={20} />
                            ) : (
                              <Image src='/icons/arrow_down.svg' alt='arrow-up' width={20} height={20} />
                            ))}
                        </div>
                      </th>
                      <th className='w-[15%] ps-4 text-left'>Assignee</th>
                      <th className='w-[15%]'>
                        <div
                          className='inline-flex cursor-pointer space-x-1'
                          onClick={() => {
                            setSortField('status');
                            setSortType(sortType * -1);
                          }}
                        >
                          <span className='select-none'>Status</span>
                          {sortField === 'status' &&
                            (sortType === -1 ? (
                              <Image src='/icons/arrow_up.svg' alt='arrow-up' width={20} height={20} />
                            ) : (
                              <Image src='/icons/arrow_down.svg' alt='arrow-up' width={20} height={20} />
                            ))}
                        </div>
                      </th>
                      <th className='w-[15%] ps-4 text-left'>
                        <div
                          className='inline-flex cursor-pointer space-x-1'
                          onClick={() => {
                            setSortField('endDate');
                            setSortType(sortType * -1);
                          }}
                        >
                          <span className='select-none'>Deadline</span>
                          {sortField === 'endDate' &&
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
                    {isAdding && (
                      <TaskForm
                        ref={taskFormRef}
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
                    {processedTasks.map((task) => {
                      const exceedUser = task.registeredMembers.slice(3).length;
                      return (
                        <>
                          <tr
                            className='h-12 cursor-pointer border-b transition-all duration-100 hover:bg-[#0b363b10]'
                            key={task.key}
                            onClick={() => {
                              setEditingTaskId(task._id);
                            }}
                          >
                            <td className='px-4'>{task.key}</td>
                            <td className='px-4'>{task.title}</td>
                            <td className='px-4'>
                              <div className='flex space-x-1'>
                                {task.registeredMembers.slice(0, 3).map((user) => (
                                  <User
                                    key={user._id}
                                    name={user.fullName}
                                    avatar={user.avatar}
                                    isDisplayName={task.registeredMembers.length < 2}
                                  />
                                ))}
                                {exceedUser > 0 && (
                                  <span className='inline rounded-full bg-gray-300 px-2 py-1 text-sm text-black'>
                                    +{exceedUser}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className='px-4 text-center'>{task.status && <TaskStatus status={task.status} />}</td>
                            <td className='px-4'>
                              {task.endDate && (
                                <div className='flex w-[70%] items-center justify-between'>
                                  <span className='me-2'>{dayjs(task.endDate).format('DD/MM/YYYY')}</span>
                                  {dayjs(task.endDate).isBefore(dayjs(), 'day') && (
                                    <Tooltip
                                      title='This task is overdue'
                                      style={{ color: 'red' }}
                                      slotProps={{
                                        popper: {
                                          modifiers: [
                                            {
                                              name: 'offset',
                                              options: {
                                                offset: [0, -12],
                                              },
                                            },
                                          ],
                                        },
                                      }}
                                    >
                                      <Image src='/icons/warning.svg' alt='warning' width={20} height={20} />
                                    </Tooltip>
                                  )}
                                </div>
                              )}
                            </td>
                          </tr>
                          {task._id === editingTaskId && (
                            <TasksModal
                              isOpenModal={task._id === editingTaskId}
                              onClose={() => setEditingTaskId(undefined)}
                              task={task}
                              updateSuccessCallback={fetchTasks}
                              memberOptions={memberOptions}
                              isMeLeader={project.isMeLeader}
                            />
                          )}
                        </>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className='mt-20 flex w-full flex-col items-center'>
                  <Image src='/images/no-task.png' alt='no-task' width={200} height={200} className='mb-3' />
                  <p className='text-lg'>
                    {tasks.length === 0
                      ? 'There are no task in this project. Add task now!'
                      : 'There is no task that matches your query.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal open={isShowDeleteModal} onClose={() => setIsShowDeleteModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id='modal-modal-title' variant='h5' component='h1'>
            Deleting this project?
          </Typography>
          <div className='flex w-full flex-col items-stretch justify-between pt-5'>
            <p className='mb-5'>Are you sure? This action is not reversible.</p>
            <div className='flex flex-row space-x-2 self-end'>
              <Button type='neutral-positive' onClick={() => setIsShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleDelete} type='negative'>
                Delete
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
}
