import SearchIcon from '@mui/icons-material/Search';
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

import TaskStatusType from '@/types/task-status';

/* eslint-disable no-tabs */
// eslint-disable-next-line max-params
function createData(title: string, code: number, status: number, deadline: number, project: number) {
  return { title, code, status, deadline, project };
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
      return createData(item.title, item.code, item.status, item.endDate, item.result[0].projectName);
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
          <SearchIcon fontSize='large' />
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
              {formatData().map((row: any) => (
                <TableRow key={row.title} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component='th' scope='row'>
                    {row.title}
                  </TableCell>
                  <TableCell align='right'>{row.code}</TableCell>
                  <TableCell align='right'>
                    <Chip
                      label={row.status}
                      style={{
                        backgroundColor: `${TASK_STATUS_COLOR[row.status as TaskStatusType].backgroundColor}`,
                        color: `${TASK_STATUS_COLOR[row.status as TaskStatusType].color}`,
                      }}
                    />
                  </TableCell>
                  <TableCell align='right'>{new Date(row.deadline).toLocaleString()}</TableCell>
                  <TableCell align='right'>{row.project}</TableCell>
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
