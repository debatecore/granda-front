import { iconprops } from "@/types/iconprops";
import { JSX, PropsWithChildren } from "react";


type GenericComponentProps = {
  title: string;
  className?: string;
  error?: {
    code: number;
    message: string;
  };
};

const GenericComponent = (props: PropsWithChildren<GenericComponentProps>) => {
  return (
    <div className={`border border-stone-700 bg-stone-900/45 rounded-lg p-4 min-h-[100px] ${props.className}`}>
      {/* header */}
      <div className="flex justify-between items-center mb-4">
        {/* left: 3 dod */}
        <div className="text-stone-500 cursor-pointer hover:text-white">•••</div>
        {/* right：design title */}
        <div className="font-['Inter'] font-medium text-[20px] leading-none text-white/75 text-right">
          {props.title}
        </div>
      </div>

      {/* contents or error */}
      {props.error ? (
        // error (purple design)
        <div className="border border-purple-900/50 bg-purple-900/10 p-4 rounded text-sm">
          <div className="text-right text-stone-400 mb-1">Error {props.error.code}</div>
          <p className="text-stone-300 italic">
            An error has occurred while loading this content: <span className="underline">{props.error.message}</span>. Something went wrong.
          </p>
        </div>
      ) : (
        // usual contents
        <div className="text-stone-300">
          {props.children}
        </div>
      )}
    </div>
  )
};

export { GenericComponent };
export type { GenericComponentProps };