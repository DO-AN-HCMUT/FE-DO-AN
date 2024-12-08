import { Box, FormControl, InputLabel, MenuItem, Modal, Select, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

import Button from '@/components/Button';
import TaskStatus from '@/components/TaskStatus';
import User from '@/components/User';
import { TASK_STATUS_COLOR } from '@/constants/common';
import api from '@/services/api';

import Task from '@/types/task';
import TaskStatusType from '@/types/task-status';
import UserType from '@/types/user';

type TaskModalProps = {
  isOpenModal: boolean;
  onClose: () => void;
  task: Task;
  updateSuccessCallback: () => void;
  memberOptions: UserType[];
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
}: TaskModalProps) {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId')!;

  const [task, setTask] = useState<Task>(initialTask);
  const [isTitleEditing, setIsTitleEditing] = useState(false);

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

  return (
    <div>
      <Modal
        open={isOpenModal}
        onClose={onClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 1000,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
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
                  <div className='w-fit cursor-pointer p-2 hover:bg-slate-300' onClick={() => setIsTitleEditing(true)}>
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
                  {Object.keys(TASK_STATUS_COLOR).map((item) => (
                    <MenuItem key={item} value={item}>
                      <TaskStatus status={item as TaskStatusType} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          <div className='mb-5 flex w-full items-stretch justify-between space-x-5'>
            <div className='w-[60%]'>
              <TextField
                id='description'
                variant='outlined'
                label='Description'
                multiline
                minRows={4}
                value={task.description}
                fullWidth
                onChange={(event) => setTask({ ...task, description: event.target.value })}
              />
            </div>

            <div className='flex flex-grow flex-col items-stretch space-y-5'>
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
                            <User name={user!.fullName} avatar={user!.avatar} isDisplayName={selected.length === 1} />
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
            </div>
          </div>
          <div className='flex w-full items-center justify-between'>
            <Button type='negative' onClick={handleDelete}>
              Delete Task
            </Button>
            <div className='flex items-center space-x-2'>
              <Button type='neutral-positive' onClick={onClose}>
                Cancel
              </Button>
              <Button type='positive' onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </div>
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
