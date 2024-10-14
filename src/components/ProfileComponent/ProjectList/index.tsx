import SearchIcon from '@mui/icons-material/Search';
import { TextField, Typography } from '@mui/material';
import { useState } from 'react';

import ProjectListItem from '../ProjectListItem';

/* eslint-disable no-tabs */
export default function ProjectList() {
  const [searchItem, setSearchItem] = useState<string>('');

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
      <div className='mt-1 rounded bg-pink-500 p-2'>
        <ProjectListItem />
      </div>
    </div>
  );
}
