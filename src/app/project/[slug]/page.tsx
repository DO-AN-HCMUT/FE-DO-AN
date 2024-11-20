'use client';
// import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import Header from '@/components/Header';
import SideBar from '@/components/SideBar';
import api from '@/services/api';

/* eslint-disable no-tabs */
// eslint-disable-next-line @next/next/no-async-client-component
export default function DetailProject({ params }: { params: { slug: string } }) {
  const [projectData, setProjectData] = useState<any>([]);
  // const searchParams = useSearchParams();

  // const id = searchParams.get('id');
  const { slug } = params;

  const getData = async () => {
    if (slug) {
      try {
        const result = await api.get(`/project/${slug}/get`);
        setProjectData(result.data.payload);
      } catch (error: any) {
        toast.error(typeof error?.response?.data == 'object' ? error?.response?.data.message : error?.message);
      }
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);
  return (
    <div>
      <div className='flex h-screen flex-col justify-start'>
        {/* HEADER */}
        <Header />
        {/* BODY */}
        <div className='flex h-screen flex-row  '>
          <SideBar />
          <div className='w-full'>
            {slug}
            <div>{projectData.projectName}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
