import SearchIcon from '@mui/icons-material/Search';
import { TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import api from '@/services/api';

import ProjectListItem from '../ProjectListItem';

/* eslint-disable no-tabs */
export default function ProjectList() {
  const [searchItem, setSearchItem] = useState<string>('');
  const [projectData, setProjectData] = useState<any>([]);
  const getData = async () => {
    try {
      if (searchItem.length > 0) {
        const searchParams = encodeURI(searchItem.trim());
        const result = await api.get(`/user/projects?searching=${searchParams}`);
        setProjectData(result.data.payload);
      } else {
        const result = await api.get('/user/projects');
        setProjectData(result.data.payload);
      }
    } catch (error: any) {
      if (error?.response?.data.message === 'TokenExpiredError') {
        toast.error('Please log in', { position: 'bottom-center' });
      } else {
        toast.error(typeof error?.response?.data == 'object' ? error?.response?.data.message : error?.message);
      } //console.log(error);
    }
  };
  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchItem]);
  return (
    <div>
      <Typography variant='h3'>My Project</Typography>
      <div className='flex flex-row'>
        <SearchIcon fontSize='large' />
        <TextField
          id='search'
          label='searching'
          value={searchItem}
          fullWidth
          onChange={(e) => setSearchItem(e.target.value)}
        />
      </div>
      <div className='mt-1 h-[300px] overflow-y-auto   p-2'>
        <ProjectListItem data={projectData} />
      </div>
    </div>
  );
}
