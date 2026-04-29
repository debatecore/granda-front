{
  /* This is the component for a block containing a title, description, and a generic input - eg. Motion; What should this round's topic be?; Text area for the user */
}

import { GenericInput } from "../ui/GenericInput";

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
    <div className="flex flex-col items-stretch w-[494px] h-[140px] bg-neutral-900 rounded border-[0.5px] outline-neutral-600/80 px-[10px] py-[12px] gap-2">
      <div className="flex flex-col items-end w-full">
        <div className="text-stone-300 text-xl font-medium leading-tight opacity-75">
          {title}
        </div>
        <div className="text-neutral-500 text-xs font-medium opacity-75 py-[2px]">
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
