import clsx from 'clsx';

type UserProps = {
  name: string;
  avatar?: string;
  className?: string;
  isDisplayName?: boolean;
  deleteIcon?: boolean;
  onDelete?: () => void;
};

const AVATAR_COLOR_STYLES = [
  {
    backgroundColor: '#1E88E5',
    color: '#FFFFFF',
  },
  {
    backgroundColor: '#43A047',
    color: '#FFFFFF',
  },
  {
    backgroundColor: '#FB8C00',
    color: '#FFFFFF',
  },
  {
    backgroundColor: '#F4511E',
    color: '#FFFFFF',
  },
  {
    backgroundColor: '#6D4C41',
    color: '#FFFFFF',
  },
  {
    backgroundColor: '#8E24AA',
    color: '#FFFFFF',
  },
  {
    backgroundColor: '#3949AB',
    color: '#FFFFFF',
  },
  {
    backgroundColor: '#E53935',
    color: '#FFFFFF',
  },
  {
    backgroundColor: '#00796B',
    color: '#FFFFFF',
  },
  {
    backgroundColor: '#5E35B1',
    color: '#FFFFFF',
  },
];

export default function User({ name, avatar, className, deleteIcon, onDelete, isDisplayName = true }: UserProps) {
  return (
    <div className={clsx('group relative flex items-center', className)}>
      {avatar ? (
        <img src={avatar} alt='avatar' className='aspect-square w-7 min-w-6 rounded-full border border-zinc-400' />
      ) : (
        <div
          style={AVATAR_COLOR_STYLES[Math.floor(Math.random() * 10)]}
          className='flex size-7 items-center justify-center rounded-full text-xs font-semibold'
        >
          {name
            .split(' ')
            .splice(0, 2)
            .map((word) => word[0].toUpperCase())
            .join('')}
        </div>
      )}
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
