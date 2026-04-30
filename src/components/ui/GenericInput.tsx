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
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="h-16 w-full resize-none rounded border-[0.5px] bg-neutral-800 px-3 py-5 text-center text-sm leading-tight text-neutral-200 opacity-60 shadow-[0px_4.28px_4.28px_0px_rgba(0,0,0,0.25)] outline-neutral-600/80 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-600 focus:outline-none [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-700 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-600"
    />
  );
}
