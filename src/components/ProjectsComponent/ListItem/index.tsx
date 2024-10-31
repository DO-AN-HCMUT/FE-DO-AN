/* eslint-disable no-tabs */
'use client';

import Image from 'next/image';

type ListItemProps = {
  projectName?: string;
  onClickFunction?: any;
};
export default function ListItem(props: ListItemProps) {
  const { projectName, onClickFunction } = props;
  return (
    <div className='w-fit cursor-pointer hover:drop-shadow-xl  ' onClick={() => onClickFunction()}>
      <div className='w-fit rounded-lg  bg-red'>
        {projectName ? (
          <Image src='/project.svg' alt='project' width={144} height={144} />
        ) : (
          <Image src='/addSquare.svg' alt='project' width={144} height={144} />
        )}
      </div>
      <div className='overflow-auto'>{projectName}</div>
    </div>
  );
}
