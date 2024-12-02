import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { TASK_STATUS_COLOR } from '@/constants/common';
import api from '@/services/api';
import getStatusString from '@/utils/get-status-string';

import TaskStatusType, { TaskStatus } from '@/types/task-status';

/* eslint-disable no-tabs */
// eslint-disable-next-line max-params
type FormatData = {
  title: string;
  key: string;
  status: keyof typeof TaskStatus;
  deadline: string;
  projectName: string;
};
function createData(example: FormatData) {
  const { title, key, status, deadline, projectName } = example;
  return { title, key, status, deadline, projectName };
}

export default function TaskList() {
  const [taskData, setTaskData] = useState<any>([]);
  const [searchItem, setSearchItem] = useState<string>('');
  const getTaskData = async () => {
    try {
      const result = await api.get(`/task/getAll?search=${encodeURI(searchItem)}`);
      setTaskData(result.data.payload);
    } catch (error: any) {
      if (error?.response?.data.message === 'TokenExpiredError') {
        toast.error('Please log in', { position: 'bottom-center' });
      } else {
        toast.error(typeof error?.response?.data == 'object' ? error?.response?.data.message : error?.message);
      }
    }
  };
  const formatData = () => {
    return taskData.map((item: any) => {
      return createData({
        title: item.title,
        key: item.key,
        status: item.status,
        deadline: item.endDate ?? '',
        projectName: item.result[0].name,
      });
    });
  };
  useEffect(() => {
    getTaskData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchItem]);
  return (
    <div className='p-1'>
      <div>
        <Typography variant='h2'>MY TASK</Typography>
      </div>
      <div>
        <div className='flex flex-row'>
          <img src='/icons/search.svg' alt='search-icon' />
          <TextField
            id='search'
            label='searching'
            value={searchItem}
            fullWidth
            onChange={(e) => setSearchItem(e.target.value)}
            disabled={formatData().length === 0}
          />
        </div>
      </div>
      <div>
        <TableContainer component={Paper} className='overflow-auto'>
          <Table sx={{ minWidth: 650 }} aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell>
                  <div className='font-bold'>Title</div>
                </TableCell>
                <TableCell align='right'>
                  <div className='font-bold'>Code</div>
                </TableCell>
                <TableCell align='right'>
                  <div className='font-bold'>Status</div>
                </TableCell>
                <TableCell align='right'>
                  <div className='font-bold'>Deadline</div>
                </TableCell>
                <TableCell align='right'>
                  <div className='font-bold'>Project</div>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formatData().map((row: FormatData) => (
                <TableRow key={row.title} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component='th' scope='row'>
                    {row.title}
                  </TableCell>
                  <TableCell align='right'>{row.key}</TableCell>
                  <TableCell align='right'>
                    <Chip
                      label={getStatusString(row.status)}
                      style={TASK_STATUS_COLOR[TaskStatus[row.status] as TaskStatusType]}
                    />
                  </TableCell>
                  <TableCell align='right'>
                    {row.deadline ? new Date(row.deadline).toLocaleDateString() : null}
                  </TableCell>
                  <TableCell align='right'>{row.projectName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {formatData().length === 0 ? (
          <div className='mt-1 h-[50px] rounded-[4px] border bg-[#FFFFFF] text-center'>No Task</div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
