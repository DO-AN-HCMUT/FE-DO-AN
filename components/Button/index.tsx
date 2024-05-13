import clsx from 'clsx';
import { ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  isDisabled?: boolean;
  onClick: () => void;
  className?: string;
  width?: 'fit' | 'full';
  type?: 'positive' | 'negative' | 'neutral-positive' | 'neutral-negative';
  tabIndex?: number;
};

export default function Button({
  children,
  isDisabled,
  onClick,
  className,
  width = 'fit',
  type = 'positive',
  tabIndex,
}: ButtonProps) {
  const buttonClass = clsx(
    width === 'full' && 'w-full',
    isDisabled
      ? 'bg-disabled text-white'
      : type === 'positive'
        ? 'bg-primary text-white hover:bg-primary-dark'
        : type === 'negative'
          ? 'bg-red text-white hover:bg-[#ca3326]'
          : type === 'neutral-positive'
            ? 'border-[1px] border-primary bg-white text-primary hover:bg-primary hover:text-white'
            : type === 'neutral-negative' && 'border-[1px] border-red bg-white text-red hover:bg-red hover:text-white',
    'rounded-lg px-4 py-2 transition-all',
    className,
  );

  return (
    <button tabIndex={tabIndex} disabled={isDisabled} className={buttonClass} onClick={onClick}>
      {children}
    </button>
  );
}
