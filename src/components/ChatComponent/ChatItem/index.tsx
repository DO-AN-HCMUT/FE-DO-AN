import Image from 'next/image';

/* eslint-disable no-tabs */
type ChatItemProps = {
  name: string;
  avatar: string;
};
export default function ChatItem(props: ChatItemProps) {
  return (
    <div className='mb-2 flex flex-row items-center justify-start border-2 border-solid border-zinc-950 bg-slate-50'>
      <div>
        <Image src={props.avatar} alt='avatar' width={50} height={100} />
      </div>
      <div>{props.name}</div>
    </div>
  );
}
