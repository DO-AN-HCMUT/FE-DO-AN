import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import api from '@/services/api';

/* eslint-disable no-tabs */
export default function AddChatItem(props: any) {
  const { sender } = props;
  const [friend, setFriend] = useState<any>([]);
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
  const getData = async () => {
    try {
      const result = await api.get('/user/friend');
      setFriend(result.data.payload);
    } catch (error: any) {
      toast.error(typeof error?.response?.data == 'object' ? error?.response?.data.message : error?.message);
      //console.log(error);
    }
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
        userIDs: [sender, willReceive],
        message: [],
      });
      setIsOpen(false);
      window.location.reload();
    } catch (error: any) {
      toast.error(typeof error?.response?.data == 'object' ? error?.response?.data.message : error?.message);
      // console.log(error);
    }
  };
  useEffect(() => {
    getData();
  }, [isOpen]);
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
            Create Chat
          </Typography>
          <div className='mt-1 flex flex-row justify-between'>
            <FormControl fullWidth>
              <InputLabel id='select-label'>Friend</InputLabel>
              <Select labelId='select-label' id='select' value={willReceive} label='Friend' onChange={handleChange}>
                {friend.map((item: any, index: number) => {
                  return (
                    <MenuItem value={item.id} key={index}>
                      {item.fullName ? item.fullName : 'User'}
                    </MenuItem>
                  );
                })}
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
