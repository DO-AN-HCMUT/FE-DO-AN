import clsx from 'clsx';

type UserProps = {
  name: string;
  avatar: string;
  className?: string;
  isDisplayName?: boolean;
  deleteIcon?: boolean;
  onDelete?: () => void;
};

export default function User({ name, avatar, className, deleteIcon, onDelete, isDisplayName = true }: UserProps) {
  return (
    <div className={clsx('group relative flex items-center', className)}>
      <img src={avatar} alt='avatar' className='aspect-square w-6 min-w-6 rounded-full' />
      {isDisplayName && <span className='ms-2'>{name}</span>}
      {deleteIcon && (
        <button
          onClick={onDelete}
          className='absolute -right-1 top-1 hidden size-3 rounded-full bg-black p-0.5 group-hover:block'
        >
          <img src='/icons/close.svg' alt='close-icon' />
        </button>
      )}
    </div>
  );
}
