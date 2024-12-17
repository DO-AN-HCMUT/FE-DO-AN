import { Box, FormControl, InputLabel, MenuItem, Modal, Select, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';

import Button from '@/components/Button';
import { Spinner } from '@/components/Spinner';
import TaskStatus from '@/components/TaskStatus';
import User from '@/components/User';
import { TASK_STATUS_COLOR } from '@/constants/common';
import api from '@/services/api';
import TaskService from '@/services/task';
import UserService from '@/services/user';

import { GetCommentsDto } from '@/types/comment';
import Task from '@/types/task';
import TaskStatusType from '@/types/task-status';
import UserType from '@/types/user';

dayjs.extend(relativeTime);

type TaskModalProps = {
  isOpenModal: boolean;
  onClose: () => void;
  task: Task;
  updateSuccessCallback: () => void;
  memberOptions: UserType[];
  isMeLeader?: boolean;
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function TasksModal({
  isOpenModal,
  onClose,
  task: initialTask,
  updateSuccessCallback,
  memberOptions,
  isMeLeader,
}: TaskModalProps) {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId')!;

  const [task, setTask] = useState<Task>(initialTask);
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [comments, setComments] = useState<GetCommentsDto>();
  const [isLoading, setIsLoading] = useState(false);
  const [me, setMe] = useState<UserType>();
  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string>();
  const [editingComment, setEditingComment] = useState('');

  const handleUpdateComment = async () => {
    if (!editingComment || !editingCommentId) return;

    try {
      await TaskService.updateComment(editingCommentId, editingComment);
      toast.success('Comment updated successfully');
      setEditingCommentId(undefined);
      setEditingComment('');
      fetchComments();
    } catch (error: any) {
      if (error?.response?.data.message === 'TokenExpiredError') {
        toast.error('Please log in', { position: 'bottom-center' });
      } else {
        toast.error(typeof error?.response?.data == 'object' ? error?.response?.data.message : error?.message);
      }
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/task/${task._id}/delete?projectId=${projectId}`);
      toast.success('Task deleted successfully');
      onClose();
      updateSuccessCallback();
    } catch (error: any) {
      if (error?.response?.data.message === 'TokenExpiredError') {
        toast.error('Please log in', { position: 'bottom-center' });
      } else {
        toast.error(typeof error?.response?.data == 'object' ? error?.response?.data.message : error?.message);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      await api.put(`/task/${task._id}/update`, {
        payload: {
          title: task.title,
          description: task.description,
          status: task.status,
          endDate: task.endDate,
          registeredMembers: task.registeredMembers.map((member) => member._id),
        },
      });
      toast.success('Task updated successfully');
      onClose();
      updateSuccessCallback();
    } catch (error: any) {
      if (error?.response?.data.message === 'TokenExpiredError') {
        toast.error('Please log in', { position: 'bottom-center' });
      } else {
        toast.error(typeof error?.response?.data == 'object' ? error?.response?.data.message : error?.message);
      }
    }
  };

  const handleAddComment = async () => {
    try {
      await TaskService.addComment(task._id, commentText);
      toast.success('Comment created successfully');
      setCommentText('');
      fetchComments();
    } catch (error: any) {
      if (error?.response?.data.message === 'TokenExpiredError') {
        toast.error('Please log in', { position: 'bottom-center' });
      } else {
        toast.error(typeof error?.response?.data == 'object' ? error?.response?.data.message : error?.message);
      }
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await TaskService.deleteComment(commentId);
      toast.success('Comment deleted successfully');
      fetchComments();
    } catch (error: any) {
      if (error?.response?.data.message === 'TokenExpiredError') {
        toast.error('Please log in', { position: 'bottom-center' });
      } else {
        toast.error(typeof error?.response?.data == 'object' ? error?.response?.data.message : error?.message);
      }
    }
  };

  const fetchComments = useCallback(async () => {
    setIsLoading(true);

    try {
      setComments(await TaskService.getComments(task._id));
    } catch (error: any) {
      if (error?.response?.data.message === 'TokenExpiredError') {
        toast.error('Please log in', { position: 'bottom-center' });
      } else {
        toast.error(typeof error?.response?.data == 'object' ? error?.response?.data.message : error?.message);
      }
    }

    setIsLoading(false);
  }, [task._id]);

  const fetchMe = useCallback(async () => {
    setIsLoading(true);

    try {
      setMe(await UserService.getMe());
    } catch (error: any) {
      if (error?.response?.data.message === 'TokenExpiredError') {
        toast.error('Please log in', { position: 'bottom-center' });
      } else {
        toast.error(typeof error?.response?.data == 'object' ? error?.response?.data.message : error?.message);
      }
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchComments();
    fetchMe();
  }, [fetchComments, fetchMe]);

  return (
    <div>
      <Modal open={isOpenModal} onClose={onClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 1200,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 5,
          }}
        >
          {isLoading || !comments || !me ? (
            <div className='flex size-full items-center justify-center'>
              <Spinner size='lg' />
            </div>
          ) : (
            <>
              <div className='mb-5 flex flex-grow flex-row items-center justify-between'>
                <div className='w-full'>
                  <div className='ms-2'>{task.key}</div>
                  <div className='w-full max-w-[600px] flex-grow'>
                    {isTitleEditing ? (
                      <TextField
                        value={task.title}
                        variant='standard'
                        fullWidth
                        onBlur={() => setIsTitleEditing(false)}
                        autoFocus
                      />
                    ) : (
                      <div
                        className='w-fit cursor-pointer p-2 hover:bg-slate-300'
                        onClick={() => setIsTitleEditing(true)}
                      >
                        <Typography id='modal-modal-title' variant='h5' component='h1'>
                          {task.title}
                        </Typography>
                      </div>
                    )}
                  </div>
                </div>
                <div className='w-fit'>
                  <FormControl>
                    <InputLabel>Status</InputLabel>
                    <Select
                      label='status'
                      value={task.status}
                      onChange={(value) => setTask({ ...task, status: value.target.value as TaskStatusType })}
                      renderValue={(selected) => <TaskStatus status={selected} />}
                      MenuProps={MenuProps}
                    >
                      {Object.keys(TASK_STATUS_COLOR)
                        .slice(0, 3)
                        .map((item) => (
                          <MenuItem key={item} value={item}>
                            <TaskStatus status={item as TaskStatusType} />
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div className='flex h-[460px] w-full items-stretch justify-between space-x-5'>
                <div className='flex w-[50%] flex-col items-stretch space-y-6'>
                  <TextField
                    id='description'
                    variant='outlined'
                    label='Description'
                    multiline
                    minRows={5}
                    value={task.description}
                    fullWidth
                    onChange={(event) => setTask({ ...task, description: event.target.value })}
                  />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label='Date Created'
                      value={dayjs(task.createdAt)}
                      disabled
                      views={['year', 'month', 'day']}
                      format='DD/MM/YYYY'
                    />
                  </LocalizationProvider>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label='Deadline'
                      value={task.endDate ? dayjs(task.endDate) : undefined}
                      onChange={(value) => setTask({ ...task, endDate: value?.toDate().toString() })}
                      views={['year', 'month', 'day']}
                      format='DD/MM/YYYY'
                    />
                  </LocalizationProvider>
                  <FormControl>
                    <InputLabel>Assignee</InputLabel>
                    <Select
                      label='Members'
                      disabled={!isMeLeader}
                      multiple
                      value={task.registeredMembers.map((user) => user._id)}
                      onChange={(value) =>
                        setTask({
                          ...task,
                          registeredMembers: (value.target.value as string[]).map(
                            (id) => memberOptions.find((option) => option._id === id)!,
                          ),
                        })
                      }
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((item) => {
                            const user = memberOptions.find((option) => option._id === item);
                            return (
                              <div key={item}>
                                <User
                                  name={user!.fullName}
                                  avatar={user!.avatar}
                                  isDisplayName={selected.length === 1}
                                />
                              </div>
                            );
                          })}
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {memberOptions.map((user) => (
                        <MenuItem key={user._id} value={user._id}>
                          <User name={user.fullName} avatar={user.avatar} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <div className='mt-10 flex w-full items-center justify-between'>
                    {isMeLeader && (
                      <Button type='negative' onClick={handleDelete}>
                        Delete Task
                      </Button>
                    )}
                    <div className='flex items-center space-x-2'>
                      <Button type='neutral-positive' onClick={onClose}>
                        Cancel
                      </Button>
                      <Button type='positive' onClick={handleSubmit}>
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </div>
                <div className='flex-grow'>
                  <h3 className='mb-4 font-semibold'>Comments</h3>
                  <div className='flex flex-col'>
                    <div className='mb-2 flex items-start'>
                      <div className='me-2'>
                        <User avatar={me.avatar} name={me.fullName} isDisplayName={false} />
                      </div>
                      <TextField
                        variant='outlined'
                        label='Comment'
                        multiline
                        fullWidth
                        value={commentText}
                        onChange={(event) => setCommentText(event.target.value)}
                      />
                    </div>
                    <Button className='self-end' onClick={handleAddComment}>
                      Comment
                    </Button>
                  </div>
                  {comments.length > 0 ? (
                    <div className='h-[320px] space-y-5 overflow-auto'>
                      {comments.map((comment) => (
                        <div key={comment._id} className='flex flex-col'>
                          <div className='mb-2 flex items-center space-x-3'>
                            <User name={comment.author.fullName} avatar={comment.author.avatar} isNameBold />
                            <span className='text-sm font-light'>{dayjs(comment.createdAt).fromNow()}</span>
                            {comment.hasUpdated && <span className='text-sm font-extralight'>Edited</span>}
                          </div>
                          <div className='mb-3 ms-9'>
                            {editingCommentId === comment._id ? (
                              <TextField
                                value={editingComment}
                                fullWidth
                                onChange={(e) => setEditingComment(e.target.value)}
                                onBlur={() => setEditingCommentId(undefined)}
                              />
                            ) : (
                              comment.content
                            )}
                          </div>
                          {comment.author._id === me._id && (
                            <div className='ms-9 space-x-3 text-sm font-light'>
                              {editingCommentId === comment._id ? (
                                <button
                                  onClick={handleUpdateComment}
                                  onMouseDown={(e) => e.preventDefault()}
                                  className='hover:underline '
                                >
                                  Save
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setEditingCommentId(comment._id);
                                    setEditingComment(comment.content);
                                  }}
                                  className='hover:underline '
                                >
                                  Edit
                                </button>
                              )}
                              <button onClick={() => handleDeleteComment(comment._id)} className='hover:underline '>
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className='text-center text-sm italic'>Add your first comment for this task</p>
                  )}
                </div>
              </div>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
}
// ObjectId('674c06f3e9283ab4834d9318'),
// ObjectId('674c071ae9283ab4834d9319'),
// ObjectId('674c0721e9283ab4834d931a'),
// ObjectId('674c0729e9283ab4834d931b'),
// ObjectId('674c0736e9283ab4834d931c'),
// ObjectId('674c0745e9283ab4834d931d'),
// ObjectId('674c0756e9283ab4834d931e'),
// ObjectId('674c109a5b8053972370c7cd'),
// ObjectId('674c4d59e48f404af35ab6c1'),
// ObjectId('6751dfd1716eb4706ccd5727'),
// ObjectId('67527522d30be8755707d43d')
