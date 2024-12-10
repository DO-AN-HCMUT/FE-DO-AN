import { Modal, Box, Typography } from '@mui/material';
import { useState } from 'react';
import toast from 'react-hot-toast';

import ProjectService from '@/services/project';
import UserService from '@/services/user';
import { isValidEmail } from '@/utils/common';

import Button from '../Button';
import { Spinner } from '../Spinner';
import TextInput from '../TextInput';
import User from '../User';

import UserType from '@/types/user';

export type AddMemberModalProps = {
  projectId: string;
  isAdding: boolean;
  onClose: () => void;
  onAddMemberSuccess: () => void;
};

export default function AddMemberModal({ projectId, isAdding, onClose, onAddMemberSuccess }: AddMemberModalProps) {
  const [users, setUsers] = useState<UserType[]>([]);
  const [emailInput, setEmailInput] = useState('');
  const [isMemberLoading, setIsMemberLoading] = useState(false);

  const handleAddMember = async () => {
    if (users.length === 0) return;

    try {
      await ProjectService.addMembers(
        projectId,
        users.map((user) => user.email),
      );
      onAddMemberSuccess();
      onClose();
      toast.success('Members added successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add members');
    }
  };

  return (
    <Modal open={isAdding} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id='modal-modal-title' variant='h5' component='h1'>
          Add Member
        </Typography>
        <div className='flex w-full flex-col items-stretch justify-between pt-5'>
          <div className='mb-5 flex grow flex-col justify-center'>
            <p className='mb-2 ps-1 font-semibold'>Member Email</p>
            <TextInput
              placeholder='Enter email'
              value={emailInput}
              onInput={async (input) => {
                const email = input.trim();
                if (email[email.length - 1] === ' ' && isValidEmail(email) && !users.find((u) => u.email === email)) {
                  try {
                    setIsMemberLoading(true);
                    const response = await UserService.getUserByEmail(email);
                    setUsers([...users, response]);
                    setEmailInput('');
                    setIsMemberLoading(false);
                  } catch (e) {
                    console.error(e);
                  }
                } else setEmailInput(input);
              }}
              inputProps={{
                onKeyPress: async (e) => {
                  const email = emailInput.trim();
                  if (e.key === 'Enter') {
                    if (isValidEmail(email) && !users.find((u) => u.email === email)) {
                      try {
                        setIsMemberLoading(true);
                        const response = await UserService.getUserByEmail(email);
                        setUsers([...users, response]);
                        setEmailInput('');
                        setIsMemberLoading(false);
                      } catch (e) {
                        console.error(e);
                      }
                    } else setEmailInput('');
                  }
                },
              }}
              type='text'
            />
          </div>
          {users.length > 0 && (
            <div className='mb-5'>
              <h4 className='mb-3 ps-1 font-semibold'>Selected Members</h4>
              <div className='max-h-[140px] overflow-auto'>
                {users.map((user) => (
                  <div key={user._id} className='group mb-2 flex justify-between pe-5 ps-2'>
                    <User name={user.fullName} avatar={user.avatar} />
                    <div
                      onClick={() => setUsers(users?.filter((u) => u._id !== user._id))}
                      className='hidden text-red hover:cursor-pointer group-hover:block'
                    >
                      &#10005;
                    </div>
                  </div>
                ))}
                {isMemberLoading && <Spinner size='sm' />}
              </div>
            </div>
          )}
          <div className='flex flex-row justify-between self-end'>
            <Button type='neutral-positive' className='me-4' onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleAddMember();
              }}
            >
              Submit
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
}
