import clsx from 'clsx';
import { InputHTMLAttributes } from 'react';

type TextInputProps = {
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  type?: string;
  placeholder?: string;
  value: string;
  className?: string;
  onInput: (input: string) => void;
};

export default function TextInput({
  inputProps,
  type = 'text',
  placeholder,
  onInput,
  value,
  className,
}: TextInputProps) {
  const inputClass = clsx(
    'w-full h-11 p-3 rounded-lg border-[1px] border-[#616161] placeholder:text-[#616161]',
    className,
  );

  return (
    <input
      {...inputProps}
      value={value}
      onInput={(event) => onInput(event.currentTarget.value)}
      placeholder={placeholder}
      className={inputClass}
      type={type}
    />
  );
}
