import { Box, Chip, FormControl, InputLabel, MenuItem, Modal, Select, TextField, Typography } from '@mui/material';
import { DatePicker, DateRangeIcon, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { TASK_STATUS_COLOR } from '@/constants/common';
import api from '@/services/api';

import Task from '@/types/task';
import TaskStatusType from '@/types/task-status';

/* eslint-disable no-tabs */
type ModelProps = {
  isOpenModal: boolean;
  setIsOpenModal: any;
  taskId: string | undefined;
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

export default function TasksModal(props: ModelProps) {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  const { isOpenModal, setIsOpenModal, taskId } = props;
  const searchParams = useSearchParams();

  const projectId = searchParams.get('project-id')!;
  const [isEdit, setIsEdit] = useState(false);
  const [deadline, setDeadline] = useState(new Date().toString());
  const [assignedMember, setAssignedMember] = useState<any>([]);
  const [tasks, setTasks] = useState<Task>();
  const [description, setDescription] = useState('');
  const [projectMembers, setProjectMembers] = useState([]);
  const [status, setStatus] = useState<TaskStatusType>();
  const handleClose = () => {
    setIsOpenModal(false);
  };
  const handleChange = (value: any, method: any) => {
    setIsEdit(true);
    method(value);
  };
  const handleAssign = (value: any) => {
    setIsEdit(true);
    setAssignedMember([value]);
  };
  const handleSubmit = () => {
    try {
    } catch (error: any) {
      if (error?.response?.data.message === 'TokenExpiredError') {
        toast.error('Please log in', { position: 'bottom-center' });
      } else {
        toast.error(typeof error?.response?.data == 'object' ? error?.response?.data.message : error?.message);
      }
    }
  };
  const getDetailTask = useCallback(async () => {
    if (taskId) {
      try {
        const result = await api.get(`/task/${taskId}/getDetail`);
        setAssignedMember(result.data.payload.memberDetail);
        setDeadline(new Date(result.data.payload?.endDate as string).toString());
        setDescription(result.data.payload?.description);
        setStatus(result.data.payload.status);
        setTasks(result.data.payload);
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
    }
  }, [taskId]);
  const getMembers = useCallback(async () => {
    try {
      const result = await api.get(`/project/${projectId}/members`);
      // console.log(result.data.payload);
      setProjectMembers(result.data.payload);
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
  }, [projectId]);

  useEffect(() => {
    getMembers();
    getDetailTask();
  }, [getMembers, getDetailTask]);
  return (
    <div>
      <Modal
        open={isOpenModal}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <div>Task Key: {tasks?.key}</div>
          <div className='flex flex-row justify-between'>
            <div>
              <Typography id='modal-modal-title' variant='h5' component='h1'>
                Task Detail
              </Typography>
              <div>
                Task Name: <span>{tasks?.title}</span>
              </div>
            </div>
            <div>
              <FormControl>
                <Select
                  labelId='demo-multiple-chip-label'
                  id='demo-multiple-chip'
                  value={status}
                  onChange={(value) => handleChange(value.target.value, setStatus)}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      <Chip key={selected} label={selected} style={TASK_STATUS_COLOR[selected]} />
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {Object.keys(TASK_STATUS_COLOR).map((item: string, index: number) => (
                    <MenuItem key={index} value={item}>
                      <Chip label={item} style={TASK_STATUS_COLOR[item as TaskStatusType]} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          <div className='flex w-full flex-col items-stretch justify-between'>
            <form onSubmit={handleSubmit}>
              <div className='flex w-full flex-row'>
                <div className='flex w-6/12 flex-row  p-1'>
                  <DateRangeIcon fontSize='large' />
                  <div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label='CreateDate'
                        value={dayjs(tasks?.createdAt)}
                        disabled
                        views={['year', 'month', 'day']}
                      />
                    </LocalizationProvider>
                  </div>
                </div>
                <div className='flex w-6/12 flex-row  p-1'>
                  <DateRangeIcon fontSize='large' />
                  <div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label='Deadline'
                        value={dayjs(deadline)}
                        onChange={(value) => handleChange(value?.toDate().toString(), setDeadline)}
                        disablePast
                        views={['year', 'month', 'day']}
                      />
                    </LocalizationProvider>
                  </div>
                </div>
              </div>
              <div>
                Assigned to
                <div>
                  <FormControl sx={{ width: 430 }}>
                    <InputLabel id='demo-multiple-chip-label'>Members</InputLabel>
                    <Select
                      labelId='demo-multiple-chip-label'
                      id='demo-multiple-chip'
                      value={assignedMember[0]}
                      onChange={(value) => handleAssign(value.target.value)}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          <Chip key={selected._id} label={selected.fullName} />
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {projectMembers.map((name: any, index: number) => (
                        <MenuItem key={index} value={name}>
                          {name.fullName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div>
                Description
                <div>
                  <TextField
                    id='description'
                    label='Description'
                    variant='outlined'
                    multiline
                    maxRows={4}
                    value={description}
                    fullWidth
                    onChange={(event) => handleChange(event.target.value, setDescription)}
                  />
                </div>
              </div>
              <div className='flex flex-row justify-between self-end'>
                <button
                  className='me-4 border-[1px] border-primary bg-emerald-700  text-white hover:bg-red hover:text-white'
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button className='bg-primary text-white hover:bg-primary-dark' type='submit' disabled={!isEdit}>
                  Submit
                </button>
              </div>
            </form>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
