'use client';

import { Modal, Box, Typography } from '@mui/material';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import AddMemberModal from '@/components/AddMemberModal';
import Button from '@/components/Button';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Spinner } from '@/components/Spinner';
import User from '@/components/User';
import ProjectService from '@/services/project';

import { GetAllUserDto, GetProjectByIdDto } from '@/types/project';

export default function MemberPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [project, setProject] = useState<GetProjectByIdDto>();
  const [members, setMembers] = useState<GetAllUserDto>();
  const [search, setSearch] = useState('');
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId')!;

  const fetchMembers = useCallback(async () => {
    setIsLoading(true);
    const response = await ProjectService.getProjectById(projectId);
    setProject(response);
    setMembers(await ProjectService.getAllUsers(projectId));
    setIsLoading(false);
  }, [projectId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

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

  if (!project || !members || isLoading)
    return (
      <div className='flex h-screen w-full items-center justify-center'>
        <Spinner size='lg' />
      </div>
    );

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

                  {isAdding && (
                    <AddMemberModal
                      isAdding={isAdding}
                      onClose={() => {
                        setIsAdding(false);
                      }}
                      projectId={projectId}
                      onAddMemberSuccess={fetchMembers}
                    />
                  )}

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
                        <p className='mb-5'>Are you sure? This action is not reversible.</p>
                        <div className='flex flex-row justify-between space-x-2 self-end'>
                          <Button type='neutral-positive' onClick={() => setDeletingMemberId(null)}>
                            Cancel
                          </Button>
                          <Button
                            onClick={() => {
                              handleDeleteMember();
                            }}
                            type='negative'
                          >
                            Delete
                          </Button>
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
