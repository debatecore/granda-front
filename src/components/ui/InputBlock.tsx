import { GenericInput } from "./GenericInput";

type InputBlockProps = {
  title: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function InputBlock({
  title,
  description,
  value,
  onChange,
  placeholder,
}: InputBlockProps) {
  return (
    <div className="flex h-[140px] w-[494px] flex-col items-stretch gap-2 rounded border-[0.5px] bg-neutral-900 px-[10px] py-[12px] outline-neutral-600/80">
      <div className="flex w-full flex-col items-end">
        <div className="text-xl font-medium leading-tight text-stone-300 opacity-75">
          {title}
        </div>
        <div className="py-[2px] text-xs font-medium text-neutral-500 opacity-75">
          {description}
        </div>
      </div>

      <GenericInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}
