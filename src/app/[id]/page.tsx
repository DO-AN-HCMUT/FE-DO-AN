'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import Header from '@/components/Header';
import SideBar from '@/components/SideBar';
import api from '@/services/api';

/* eslint-disable no-tabs */
// eslint-disable-next-line @next/next/no-async-client-component
export default function DetailProject({ params }: { params: any }) {
  const [projectData, setProjectData] = useState<any>([]);
  const { id } = params;

  const getData = async () => {
    if (id) {
      try {
        const result = await api.get(`/project/${id}/get`);
        setProjectData(result.data.payload);
      } catch (error: any) {
        toast.error(typeof error?.response?.data == 'object' ? error?.response?.data.message : error?.message);
      }
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  return (
    <div>
      <div className='flex h-screen flex-col justify-start'>
        {/* HEADER */}
        <Header />
        {/* BODY */}
        <div className='flex h-screen flex-row  '>
          <SideBar />
          <div className='w-full'>
            {id}
            <div>{projectData.projectName}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
