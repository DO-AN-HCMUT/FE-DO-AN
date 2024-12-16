import { Box, Typography } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { forwardRef, useEffect, useState } from 'react';

import ProjectService from '@/services/project';

import Button from '../Button';
import { Spinner } from '../Spinner';
import User from '../User';

import Task from '@/types/task';

type DeleteMemberModalContentProps = {
  onDeleteMember: () => void;
  deletingMemberId?: string;
  onClose: () => void;
};

const DeleteMemberModalContent = forwardRef(
  ({ onDeleteMember, deletingMemberId, onClose }: DeleteMemberModalContentProps, ref) => {
    const [tasksAffected, setTasksAffected] = useState<Task[]>();

    const searchParams = useSearchParams();
    const projectId = searchParams.get('projectId')!;

    useEffect(() => {
      (async () => {
        setTasksAffected(await ProjectService.getAllTasksByProjectId(projectId, deletingMemberId));
      })();
    }, [deletingMemberId, projectId]);

    return (
      <Box
        ref={ref}
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
          Removing Member
        </Typography>
        <div className='flex w-full flex-col items-stretch justify-between pt-5'>
          <p className='mb-5'>Are you sure? This action is not reversible.</p>
          {tasksAffected ? (
            tasksAffected.length > 0 && (
              <div className='mb-5'>
                <h3 className='mb-2 text-lg font-semibold'>Tasks will be affected:</h3>
                <div className='max-h-[220px] space-y-2 overflow-auto'>
                  {tasksAffected?.map((task) => (
                    <div
                      className='flex items-center justify-between rounded border-[0.5px] p-2 shadow-sm'
                      key={task._id}
                    >
                      <div className='space-x-2'>
                        <span>{task.key}</span>
                        <span className='font-bold text-primary'>{task.title}</span>
                      </div>
                      <div className='flex space-x-1'>
                        {task.registeredMembers.map((member) => (
                          <User
                            key={member._id}
                            name={member.fullName}
                            avatar={member.avatar}
                            isDisplayName={false}
                            isUserDanger={member._id === deletingMemberId}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ) : (
            <div className='flex items-center justify-center'>
              <Spinner />
            </div>
          )}
          <div className='flex flex-row justify-between space-x-2 self-end'>
            <Button type='neutral-positive' onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onDeleteMember} type='negative'>
              Delete
            </Button>
          </div>
        </div>
      </Box>
    );
  },
);

DeleteMemberModalContent.displayName = 'DeleteMemberModalContent';

export default DeleteMemberModalContent;
