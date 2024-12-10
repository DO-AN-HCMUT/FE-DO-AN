import { Modal, Box, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDebounceValue } from 'usehooks-ts';

import api from '@/services/api';
import ProjectService from '@/services/project';

import Button from '../Button';
import { Spinner } from '../Spinner';
import TextInput from '../TextInput';

export type CreateProjectModalProps = {
  isAdding: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function CreateProjectModal({ isAdding, onClose, onSubmitSuccess }: CreateProjectModalProps) {
  const [projectKey, setProjectKey] = useState<string>();
  const [projectName, setProjectName] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [debouncedProjectName, setDebouncedProjectName] = useDebounceValue(projectName, 500);
  const [isProjectKeyLoading, setIsProjectKeyLoading] = useState(false);

  const generateProjectKey = useCallback(async (projectName: string) => {
    let key = projectName
      .split(' ')
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toUpperCase();

    while (true) {
      try {
        await api.post('/project/key', { key });
        break;
      } catch (e) {
        console.error(e);
        if (key.length === 2) {
          key += 'A';
        } else {
          key = key.slice(0, 2) + String.fromCharCode(key.charCodeAt(2) + 1);
        }
      }
    }

    setProjectKey(key);
    setIsProjectKeyLoading(false);
  }, []);

  const handleSubmit = async () => {
    if (!projectName || !projectKey) return;

    try {
      await ProjectService.addProject({ name: projectName, key: projectKey, description });
      toast.success('Project created successfully');
      onSubmitSuccess();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!debouncedProjectName) {
      setProjectKey('');
      setIsProjectKeyLoading(false);
      return;
    }
    generateProjectKey(debouncedProjectName);
  }, [debouncedProjectName, generateProjectKey]);

  return (
    <Modal open={isAdding} onClose={onClose}>
      <Box sx={style}>
        <Typography id='modal-modal-title' variant='h5' component='h1'>
          Create Project
        </Typography>
        <div className='flex w-full flex-col items-stretch justify-between pt-5'>
          <form onSubmit={handleSubmit}>
            <div className='mb-4 flex grow flex-col justify-center'>
              <p className='mb-2 ps-1 font-semibold'>Project Name</p>
              <TextInput
                placeholder='Enter project name'
                value={projectName ?? ''}
                onInput={(projectName) => {
                  setProjectName(projectName);
                  setDebouncedProjectName(projectName);
                  setIsProjectKeyLoading(true);
                }}
                type='text'
              />
            </div>
            <div className='mb-4 flex grow flex-col justify-center'>
              {projectName && (
                <p className='mb-2 ps-1 text-sm font-light'>
                  Project Key: {isProjectKeyLoading ? <Spinner className='inline-block' /> : <span>{projectKey}</span>}
                </p>
              )}
            </div>
            <div className='mb-4'>
              <p className='mb-2 ps-1 font-semibold'>Description</p>
              <textarea
                placeholder='Describe your project'
                value={description}
                onInput={(e) => setDescription(e.target.value)}
                className='h-20 w-full rounded-lg border-[1px] border-[#616161] p-3 placeholder:text-[#616161] '
              />
            </div>
            <div className='flex flex-row justify-between self-end'>
              <Button className='me-4' onClick={onClose} type='neutral-positive'>
                Cancel
              </Button>
              <Button isDisabled={!projectName} onClick={() => {}}>
                Submit
              </Button>
            </div>
          </form>
        </div>
      </Box>
    </Modal>
  );
}
