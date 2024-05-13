import clsx from 'clsx';

type TextInputProps = {
  type: string;
  placeholder?: string;
  onChange: () => void;
  value: string;
  className?: string;
};

export default function TextInput({ type = 'text', placeholder, onChange, value, className }: TextInputProps) {
  const inputClass = clsx(
    'w-full h-11 p-3 rounded-lg border-[1px] border-[#616161] placeholder:text-[#616161]',
    className,
  );

  return <input placeholder={placeholder} className={inputClass} type={type} />;
}
