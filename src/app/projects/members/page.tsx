'use client';

import { Modal, Box, Typography, Button as MuiButton } from '@mui/material';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import Button from '@/components/Button';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import TextInput from '@/components/TextInput';
import User from '@/components/User';
import ProjectService from '@/services/project';
import { isValidEmail } from '@/utils/common';

import { GetAllUserDto, GetProjectByIdDto } from '@/types/project';

export default function MemberPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [project, setProject] = useState<GetProjectByIdDto>();
  const [members, setMembers] = useState<GetAllUserDto>();
  const [search, setSearch] = useState('');
  const [newMemberEmails, setNewMemberEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState('');
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId')!;

  const fetchMembers = useCallback(async () => {
    const response = await ProjectService.getProjectById(projectId);
    setProject(response);
    setMembers(await ProjectService.getAllUsers(projectId));
  }, [projectId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleAddMember = async () => {
    if (newMemberEmails.length === 0) return;

    try {
      await ProjectService.addMembers(projectId, newMemberEmails);
      setNewMemberEmails([]);
      await fetchMembers();
      setIsAdding(false);
      toast.success('Members added successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add members');
    }
  };

  const handleDeleteMember = async () => {
    if (!deletingMemberId) return;

    try {
      await ProjectService.deleteMembers(projectId, [deletingMemberId]);
      await fetchMembers();
      setDeletingMemberId(null);
      toast.success('Member deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete member');
    }
  };

  if (!project || !members) return null;

  return (
    <>
      <div className='flex h-screen flex-col'>
        {/* HEADER */}
        <Header />
        {/* BODY */}
        <div className='flex flex-grow overflow-hidden'>
          <Sidebar />
          <div className='flex flex-grow flex-col items-start p-10'>
            <h1 className='mb-2 text-lg'>
              <Link className='hover:underline' href='/projects'>
                Projects
              </Link>{' '}
              / {project.name}
            </h1>
            <h2 className='mb-5 text-3xl font-bold text-primary'>Members</h2>
            {project.isMeLeader && (
              <Button
                className='mb-5'
                onClick={() => {
                  setIsAdding(true);
                }}
              >
                + New member
              </Button>
            )}

            {/* UTILITY BUTTONS */}
            <div className='mb-4 flex w-full items-center space-x-2'>
              <div className='flex flex-grow items-center rounded-lg border px-2'>
                <img src='/icons/search.svg' alt='search-icon' />
                <input
                  value={search}
                  onInput={(e) => {
                    setSearch(e.currentTarget.value);
                  }}
                  type='text'
                  className='ml-2 h-10 w-full border-l px-2 outline-none'
                />
              </div>
              <button className='inline-flex items-center rounded border p-2'>
                <img className='me-2' src='/icons/tune.svg' alt='tune-icon' />
                <span>Filter</span>
              </button>
              <button className='inline-flex items-center rounded border p-2'>
                <img className='me-2' src='/icons/sort.svg' alt='sort-icon' />
                <span>Sort</span>
              </button>
            </div>

            {/* TASKS */}
            <div className='overflow-auto pb-5'>
              <table className='w-full table-fixed border-collapse'>
                <thead>
                  <tr className='h-12 rounded-lg bg-[#e4f8fa]'>
                    <th className='w-[10%] ps-4 text-left'>No.</th>
                    <th className='w-[35%] ps-4 text-left'>Name</th>
                    <th className='w-[25%] ps-4 text-left'>Email</th>
                    <th className='w-[15%]'>Role</th>
                    <th className='w-[15%] ps-4'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members
                    .filter((member) => {
                      const lowerCaseSearch = search.toLowerCase();
                      return (
                        member.fullName.toLowerCase().includes(lowerCaseSearch) ||
                        member.email.toLowerCase().includes(lowerCaseSearch)
                      );
                    })
                    .map((member, index) => (
                      <tr
                        className='h-12 cursor-pointer border-b transition-all duration-100 hover:bg-[#0b363b10]'
                        key={member._id}
                      >
                        <td className='px-4'>{index + 1}</td>
                        <td className='px-4'>
                          <User name={member.fullName} avatar={member.avatar} />
                        </td>
                        <td className='px-4'>{member.email}</td>
                        <td className='px-4 text-center'>{member.isLeader ? 'Leader' : 'Member'}</td>
                        <td className='space-x-2 px-4 text-center'>
                          {!member.isLeader && project.isMeLeader && (
                            <button
                              onClick={() => setDeletingMemberId(member._id)}
                              className='hover:text-red-dark text-red hover:underline'
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  <Modal
                    open={isAdding}
                    onClose={() => {
                      setIsAdding(false);
                      setNewMemberEmails([]);
                      setEmailInput('');
                    }}
                  >
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
                            onInput={(email) => {
                              if (email[email.length - 1] === ' ' && isValidEmail(email.trim())) {
                                setNewMemberEmails([...newMemberEmails, email.trim()]);
                                setEmailInput('');
                              } else setEmailInput(email);
                            }}
                            inputProps={{
                              onKeyPress: (e) => {
                                if (e.key === 'Enter' && isValidEmail(emailInput)) {
                                  setNewMemberEmails([...newMemberEmails, emailInput]);
                                  setEmailInput('');
                                }
                              },
                            }}
                            type='text'
                          />
                        </div>
                        {newMemberEmails.length > 0 && (
                          <div className='mb-5'>
                            <h4 className='mb-3 ps-1 font-semibold'>Selected Members</h4>
                            <div className='max-h-[140px] overflow-auto'>
                              {newMemberEmails.map((email, index) => (
                                <div key={email} className='group mb-2 flex justify-between pe-5 ps-2'>
                                  <User name={email} />
                                  <div
                                    onClick={() =>
                                      setNewMemberEmails(newMemberEmails.filter((email, i) => i !== index))
                                    }
                                    className='hidden text-red hover:cursor-pointer group-hover:block'
                                  >
                                    &#10005;
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className='flex flex-row justify-between self-end'>
                          <MuiButton
                            className='me-4 border-[1px] border-primary bg-white text-primary hover:bg-rose-500 hover:text-white'
                            onClick={() => setIsAdding(false)}
                          >
                            Cancel
                          </MuiButton>
                          <MuiButton
                            className='bg-primary text-white hover:bg-primary-dark'
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddMember();
                            }}
                            type='submit'
                          >
                            Submit
                          </MuiButton>
                        </div>
                      </div>
                    </Box>
                  </Modal>
                  <Modal
                    open={!!deletingMemberId}
                    onClose={() => {
                      setDeletingMemberId(null);
                    }}
                  >
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
                        Removing Member
                      </Typography>
                      <div className='flex w-full flex-col items-stretch justify-between pt-5'>
                        <p>Are you sure? This action is not reversible.</p>
                        <div className='flex flex-row justify-between self-end'>
                          <MuiButton
                            className='me-4 border-[1px] border-primary bg-white text-primary hover:bg-rose-500 hover:text-white'
                            onClick={() => setDeletingMemberId(null)}
                          >
                            Cancel
                          </MuiButton>
                          <MuiButton
                            className='bg-primary text-white hover:bg-primary-dark'
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMember();
                            }}
                            type='submit'
                          >
                            Delete
                          </MuiButton>
                        </div>
                      </div>
                    </Box>
                  </Modal>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
