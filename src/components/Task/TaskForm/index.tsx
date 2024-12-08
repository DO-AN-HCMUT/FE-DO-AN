import clsx from 'clsx';
import dayjs from 'dayjs';
import { forwardRef, useEffect, useState } from 'react';

import Button from '@/components/Button';
import User from '@/components/User';
import { TASK_STATUS_COLOR } from '@/constants/common';
import ProjectService from '@/services/project';
import getStatusString from '@/utils/get-status-string';

import TaskStatusType, { TaskStatus } from '@/types/task-status';
import UserType from '@/types/user';

type TaskFormProps = {
  projectId: string;
  onAddTaskSuccess: () => void;
  onBlur: () => void;
};

const TaskForm = forwardRef<HTMLTableRowElement, TaskFormProps>(({ projectId, onAddTaskSuccess, onBlur }, ref) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [assignees, setAssignees] = useState<UserType[]>([]);
  const [memberSearch, setMemberSearch] = useState('');
  const [isMemberSearching, setIsMemberSearching] = useState(false);
  const [memberSearchResults, setMemberSearchResults] = useState<UserType[]>([]);
  const [isSelectingStatus, setIsSelectingStatus] = useState(false);
  const [status, setStatus] = useState<TaskStatusType>(TaskStatus.TO_DO);
  const [deadline, setDeadline] = useState<string>();

  useEffect(() => {
    if (projectId) {
      (async () => {
        const assigneeIds = assignees.map((member) => member._id);

        setMemberSearchResults(
          (await ProjectService.getAllUsers(projectId, memberSearch)).filter(
            (member) => !assigneeIds.includes(member._id),
          ),
        );
      })();
    }
  }, [memberSearch, projectId, assignees]);

  const handleSubmit = async () => {
    await ProjectService.createTask(projectId, {
      title,
      registeredMembers: assignees.map((member) => member._id),
      status,
      endDate: deadline ? dayjs(deadline).toISOString() : undefined,
    });
    onAddTaskSuccess();
  };

  return (
    <tr ref={ref} className='relative h-10'>
      <td className='cursor-not-allowed border border-slate-300 bg-gray-100 px-4'></td>
      <td className='border border-slate-300'>
        <input
          onBlur={() => {
            if (!isAdding) onBlur();
          }}
          type='text'
          className='size-full h-10 px-4 outline-none'
          placeholder='Add new task'
          value={title}
          onChange={(e) => {
            if (e.currentTarget.value) setIsAdding(true);
            else setIsAdding(false);
            setTitle(e.currentTarget.value);
          }}
        />
      </td>
      <td className={clsx('relative border border-slate-300 px-4', !isAdding && 'bg-gray-100')}>
        {isAdding && (
          <div className='flex'>
            {assignees.map((assignee) => (
              <User
                key={assignee._id}
                name={assignee.fullName}
                avatar={assignee.avatar}
                isDisplayName={false}
                className='me-2'
                deleteIcon
                onDelete={() => {
                  setAssignees((prev) => prev.filter((member) => member._id !== assignee._id));
                }}
              />
            ))}
            <input
              type='text'
              className='size-full h-10 outline-none'
              value={memberSearch}
              onInput={(e) => setMemberSearch(e.currentTarget.value)}
              placeholder={assignees.length === 0 ? 'Choose assignee' : undefined}
              onFocus={() => setIsMemberSearching(true)}
              onBlur={() => setIsMemberSearching(false)}
            />
            {isMemberSearching && (
              <div className='absolute -left-1 top-[100%] z-10 mt-2 max-h-[200px] w-full overflow-auto rounded-lg bg-white shadow-md'>
                {memberSearchResults.length > 0 ? (
                  memberSearchResults.map((member) => (
                    <div
                      key={member._id}
                      className='cursor-pointer px-3 py-3 hover:bg-slate-100'
                      onClick={() => setAssignees((prev) => [...prev, member])}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <User name={member.fullName} avatar={member.avatar} />
                    </div>
                  ))
                ) : (
                  <div className='px-3 py-3' onMouseDown={(e) => e.preventDefault()}>
                    No member found
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </td>
      <td className={clsx('relative border border-slate-300 text-center', !isAdding && 'bg-gray-100')}>
        {/* <td className='border border-slate-300 px-4 text-center'> */}
        {isAdding && (
          <div
            style={!status ? { backgroundColor: '#F0F0F0', color: '#888' } : TASK_STATUS_COLOR[status]}
            className='inline-flex cursor-pointer items-center rounded bg-green px-2 py-1 font-semibold text-white'
            onClick={() => setIsSelectingStatus((prev) => !prev)}
          >
            <span>{getStatusString(status)}</span>
            <img
              src={isSelectingStatus ? '/icons/arrow_drop_up.svg' : '/icons/arrow_drop_down.svg'}
              alt='arrow'
              className=''
            />
            {isSelectingStatus && (
              <div className='absolute -left-1 top-[100%] z-10 mt-2 w-full rounded-lg bg-white shadow-md'>
                <div
                  className='flex cursor-pointer px-3 py-1.5 hover:bg-slate-100'
                  onClick={(e) => {
                    e.stopPropagation();
                    setStatus(TaskStatus.TO_DO);
                    setIsSelectingStatus(false);
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <div
                    style={TASK_STATUS_COLOR[TaskStatus.TO_DO]}
                    className='inline-flex rounded px-2 py-1'
                    onClick={() => setIsSelectingStatus((prev) => !prev)}
                  >
                    To Do
                  </div>
                </div>
                <div
                  className='flex cursor-pointer px-3 py-1.5 hover:bg-slate-100'
                  onClick={(e) => {
                    e.stopPropagation();
                    setStatus(TaskStatus.IN_PROGRESS);
                    setIsSelectingStatus(false);
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <div
                    style={TASK_STATUS_COLOR[TaskStatus.IN_PROGRESS]}
                    className='inline-flex rounded px-2 py-1'
                    onClick={() => setIsSelectingStatus((prev) => !prev)}
                  >
                    In progress
                  </div>
                </div>
                <div
                  className='flex cursor-pointer px-3 py-1.5 hover:bg-slate-100'
                  onClick={(e) => {
                    e.stopPropagation();
                    setStatus(TaskStatus.DONE);
                    setIsSelectingStatus(false);
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <div
                    style={TASK_STATUS_COLOR[TaskStatus.DONE]}
                    className='inline-flex rounded px-2 py-1'
                    onClick={() => setIsSelectingStatus((prev) => !prev)}
                  >
                    Done
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </td>
      <td className={clsx('border border-slate-300', !isAdding && 'bg-gray-100')}>
        {isAdding && (
          <input
            type='date'
            className='size-full h-10 p-4 outline-none'
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        )}
      </td>
      {isAdding && (
        <Button className='absolute right-0 top-12 z-10' onClick={handleSubmit}>
          Submit
        </Button>
      )}
    </tr>
  );
});

TaskForm.displayName = 'TaskForm';

export default TaskForm;
