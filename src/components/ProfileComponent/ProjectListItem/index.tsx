import { Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

/* eslint-disable no-tabs */
type ProjectProps = {
  data: any;
};
export default function ProjectListItem(props: ProjectProps) {
  const { data } = props;
  const router = useRouter();
  const onClickHandle = (item: any) => {
    router.push(`/project?id=${item._id}`);
  };
  return (
    <div>
      {data.length > 0 ? (
        data.map((item: any, index: number) => {
          if (item?.projectName) {
            return (
              <div
                className='mb-2 cursor-pointer rounded border-2 border-solid  border-black hover:shadow-lg'
                key={index}
                onClick={() => onClickHandle(item)}
              >
                <Typography variant='h4' className='text-sky-300'>
                  {item?.projectName}
                </Typography>
              </div>
            );
          }
        })
      ) : (
        <div className='h-full w-full text-center'>No Result</div>
      )}
    </div>
  );
}
