import { Typography } from '@mui/material';

/* eslint-disable no-tabs */
type ProjectProps = {
  data: any;
};
export default function ProjectListItem(props: ProjectProps) {
  const { data } = props;
  return (
    <div>
      {data.map((item: any, index: number) => {
        if (item?.projectName) {
          return (
            <div
              className='mb-2 cursor-pointer rounded border-2 border-solid  border-black hover:shadow-lg'
              key={index}
            >
              <Typography variant='h4' className='text-sky-300'>
                {item?.projectName}
              </Typography>
            </div>
          );
        }
      })}
    </div>
  );
}
