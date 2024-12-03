import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker, DateRangeIcon, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { TASK_STATUS_COLOR } from '@/constants/common';
import api from '@/services/api';
import getStatusString from '@/utils/get-status-string';

import Task from '@/types/task';
import TaskStatusType from '@/types/task-status';
import User from '@/types/user';

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
  const [deadline, setDeadline] = useState('');
  const [assignedMember, setAssignedMember] = useState<any>([]);
  const [tasks, setTasks] = useState<Task>();
  const [description, setDescription] = useState('');
  const [projectMembers, setProjectMembers] = useState([]);
  const [status, setStatus] = useState<TaskStatusType>();
  const handleClose = () => {
    setIsEdit(false);
    setIsOpenModal(false);
  };
  const handleChange = (value: any, method: any) => {
    setIsEdit(true);
    method(value);
  };
  const handleDisable = useCallback(() => {
    if (new Date(deadline).getTime() > new Date().getTime() && isEdit) {
      return false;
    }
    return true;
  }, [deadline, isEdit]);
  const handleAssign = (value: any) => {
    setIsEdit(true);
    setAssignedMember([value]);
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const payload = {
        endDate: deadline,
        registeredMembers: assignedMember.map((item: User) => item._id),
        description,
        status,
      };
      await api.put(`/task/${taskId}/update`, { payload });
      // toast.success('Success');
      window.location.reload();
      setIsOpenModal(false);
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
        Promise.all([result, getMembers()]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    getDetailTask();
  }, [getDetailTask]);
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
          <div className='my-2 flex flex-row justify-between'>
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
                  labelId='status-chip'
                  id='status-chip'
                  value={status}
                  onChange={(value) => handleChange(value.target.value, setStatus)}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      <Chip key={selected} label={getStatusString(selected)} style={TASK_STATUS_COLOR[selected]} />
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {Object.keys(TASK_STATUS_COLOR).map((item: string, index: number) => (
                    <MenuItem key={index} value={item}>
                      <Chip label={getStatusString(item)} style={TASK_STATUS_COLOR[item as TaskStatusType]} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          <div className='flex w-full flex-col items-stretch justify-between'>
            <form onSubmit={handleSubmit}>
              <div className='my-2 flex w-full flex-row'>
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
              <div className='my-2'>
                Assigned to
                <div className='my-2'>
                  <FormControl sx={{ width: 430 }}>
                    <InputLabel id='member-label'>Members</InputLabel>
                    <Select
                      labelId='member-label'
                      id='member-chip'
                      value={assignedMember[0]?.fullName}
                      onChange={(value) => handleAssign(value.target.value)}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {/* <Chip key={selected._id} label={selected.fullName} /> */}
                          <div>{selected}</div>
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
                <div className='my-2'>
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
              <div className='my-2 flex flex-row justify-between self-end'>
                <Button className='me-4 border-[1px]' onClick={handleClose} variant='outlined'>
                  Cancel
                </Button>
                <Button type='submit' disabled={handleDisable()} variant='outlined'>
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
