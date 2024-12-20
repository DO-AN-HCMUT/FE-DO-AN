import clsx from 'clsx';

import { COLOR_PAIRS } from '@/constants/common';
import { hashStringToRange } from '@/utils/common';

type UserProps = {
  name: string;
  avatar?: string;
  className?: string;
  isDisplayName?: boolean;
  deleteIcon?: boolean;
  onDelete?: () => void;
  isNameBold?: boolean;
  isUserDanger?: boolean;
};

export default function User({
  name,
  avatar,
  className,
  deleteIcon,
  onDelete,
  isDisplayName = true,
  isNameBold = false,
  isUserDanger = false,
}: UserProps) {
  return (
    <div title={!isDisplayName ? name : ''} className={clsx('group relative flex items-center', className)}>
      {avatar ? (
        <img
          src={avatar}
          alt='avatar'
          className={`aspect-square w-7 min-w-6 rounded-full border border-zinc-400 ${isUserDanger ? 'm-1 outline outline-[2px] outline-offset-1 outline-red' : ''}`}
        />
      ) : (
        <div
          style={COLOR_PAIRS[hashStringToRange(name)]}
          className={`flex size-7 select-none items-center justify-center rounded-full text-xs font-semibold ${isUserDanger ? 'm-1 outline outline-[2px] outline-offset-1 outline-red' : ''}`}
        >
          {name
            .split(' ')
            .splice(0, 2)
            .map((word) => word[0].toUpperCase())
            .join('')}
        </div>
      )}
      {isDisplayName && <span className={`ms-2 ${isNameBold ? 'font-[500]' : ''}`}>{name}</span>}
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
