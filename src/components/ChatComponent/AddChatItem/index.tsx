/* eslint-disable no-console */
import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Typography } from '@mui/material';
import { useState } from 'react';

import api from '@/services/api';

/* eslint-disable no-tabs */
export default function AddChatItem(props: any) {
  const { sender } = props;
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
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const [willReceive, setWillReceive] = useState('');
  const handleChange = (event: any) => {
    setWillReceive(event.target.value as string);
  };
  const handleClick = async () => {
    try {
      await api.post('/chat/create', {
        sender,
        receiver: willReceive,
        message: [],
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Button onClick={handleOpen} variant='contained'>
        New Chat
      </Button>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Typography id='modal-modal-title' variant='h6' component='h2'>
            Text in a modal
          </Typography>
          <div className='flex flex-row justify-between'>
            <FormControl fullWidth>
              <InputLabel id='demo-simple-select-label'>User</InputLabel>
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={willReceive}
                label='User'
                onChange={handleChange}
              >
                <MenuItem value={'10'}>Ten</MenuItem>
                <MenuItem value={'20'}>Twenty</MenuItem>
                <MenuItem value={'30'}>Thirty</MenuItem>
              </Select>
            </FormControl>
            <Button variant='contained' disabled={willReceive.length <= 0 && true} onClick={handleClick}>
              Chat
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
