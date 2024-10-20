/* eslint-disable no-tabs */
import CircularProgress from '@mui/material/CircularProgress';

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className='flex h-screen w-full flex-row items-center justify-center bg-slate-200'>
      <CircularProgress size='3rem' />
    </div>
  );
}
