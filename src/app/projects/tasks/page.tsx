'use client';

import dayjs from 'dayjs';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import Button from '@/components/Button';
import Header from '@/components/Header';
import SideBar from '@/components/SideBar';
import TaskForm from '@/components/Task/TaskForm';
import User from '@/components/User';
import { TASK_STATUS_COLOR } from '@/constants/common';
import ProjectService from '@/services/project';
import getStatusString from '@/utils/get-status-string';

import Task from '@/types/task';
import { TaskStatus } from '@/types/task-status';

export default function TaskPage() {
  const searchParams = useSearchParams();

  const projectId = searchParams.get('project-id')!;

  const [isAdding, setIsAdding] = useState(false);
  const [projectName, setProjectName] = useState<string>();
  const [tasks, setTasks] = useState<Task[]>();

  const fetchTasks = useCallback(async () => {
    const response = await ProjectService.getProjectById(projectId);
    setProjectName(response.name);
    setTasks(await ProjectService.getAllTasksByProjectId(projectId));
  }, [projectId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (!projectName || !tasks) return null;

  return (
    <>
      <div className='h-screen'>
        {/* HEADER */}
        <Header />
        {/* BODY */}
        <div className='flex h-full'>
          <SideBar />
          <div className='flex flex-grow flex-col items-start p-10'>
            <h1 className='mb-2 text-3xl font-semibold'>{projectName}</h1>
            <h2 className='mb-5 text-3xl'>Tasks</h2>
            <Button
              className='mb-10'
              onClick={() => {
                setIsAdding(true);
              }}
            >
              + New task
            </Button>

            {/* SEARCH BAR */}
            <div className='mb-5 flex w-full items-center rounded-lg border px-2'>
              <img src='/icons/search.svg' alt='search-icon' />
              <input type='text' className='ml-2 h-10 w-full border-l px-2 outline-none' />
            </div>

            {/* UTILITY BUTTONS */}
            <div className='mb-4 space-x-2 self-end'>
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
            <div>
              <table className='w-full table-fixed border-collapse'>
                <thead>
                  <tr className='h-10'>
                    <th className='w-[10%] border border-slate-300'>Key</th>
                    <th className='w-[45%] border border-slate-300'>Name</th>
                    <th className='w-[15%] border border-slate-300'>Assignee</th>
                    <th className='w-[15%] border border-slate-300'>Status</th>
                    <th className='w-[15%] border border-slate-300'>Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => {
                    const exceedUser = task.registeredMembers.slice(3).length;

                    return (
                      <tr className='h-10' key={task.key}>
                        <td className='border border-slate-300 px-4'>{task.key}</td>
                        <td className='border border-slate-300 px-4'>{task.title}</td>
                        <td className='border border-slate-300 px-4'>
                          <div className='flex'>
                            {task.registeredMembers.slice(0, 3).map((user) => (
                              <User
                                key={user._id}
                                name={user.fullName}
                                avatar={user.avatar}
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
                        <td className='border border-slate-300 px-4 text-center'>
                          <div
                            style={TASK_STATUS_COLOR[TaskStatus[task.status]]}
                            className='inline rounded bg-green px-2 py-1 font-semibold text-white'
                          >
                            {getStatusString(task.status)}
                          </div>
                        </td>
                        <td className='border border-slate-300 px-4'>
                          {task.endDate ? dayjs(task.endDate).format('DD/MM/YYYY') : ''}
                        </td>
                      </tr>
                    );
                  })}
                  {isAdding && (
                    <TaskForm
                      key={tasks.length}
                      projectId={projectId}
                      onAddTaskSuccess={() => {
                        fetchTasks();
                        setIsAdding(false);
                      }}
                    />
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* <TaskFilterModal /> */}
    </>
  );
}
