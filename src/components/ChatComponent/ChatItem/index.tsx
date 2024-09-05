import { Avatar } from '@mui/material';

/* eslint-disable no-tabs */
type ChatItemProps = {
  name: string;
  onClick: any;
};
export default function ChatItem(props: ChatItemProps) {
  return (
    <div
      className='mb-2 flex flex-row items-center justify-start border-2 border-solid border-zinc-950 bg-slate-50 p-2'
      onClick={props.onClick}
    >
      <div>
        <Avatar>{props.name}</Avatar>
      </div>
      <div className='ml-1'>{props.name}</div>
    </div>
  );
}
