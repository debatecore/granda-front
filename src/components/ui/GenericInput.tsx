{
  /* This is basically just a formatted textarea */
}

type GenericInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};
export function GenericInput({
  value,
  onChange,
  placeholder,
}: GenericInputProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="
        w-full h-16 bg-neutral-800 shadow-[0px_4.28px_4.28px_0px_rgba(0,0,0,0.25)] rounded border-[0.5px] outline-neutral-600/80 text-center py-5 px-3 opacity-60 text-neutral-200 text-sm leading-tight resize-none focus:outline-none

        scrollbar-thin 
        scrollbar-thumb-neutral-600 
        scrollbar-track-transparent
    
        [&::-webkit-scrollbar]:w-1.5
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-neutral-700
        [&::-webkit-scrollbar-thumb]:rounded-full
        hover:[&::-webkit-scrollbar-thumb]:bg-neutral-600
      "
    />
  );
}
