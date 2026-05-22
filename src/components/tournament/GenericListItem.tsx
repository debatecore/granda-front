import { ReactNode } from "react";

type GenericListProps = {
  title: string;
  children: ReactNode;
};

const GenericListItem = ({ title, children }: GenericListProps) => {
  return (
    <div className="w-full rounded border border-stone-700 bg-stone-700/15 px-4 py-4 hover:bg-stone-700/25 transition-colors">
      <div className="text-lg font-medium text-white mb-1">{title}</div>

      <div className="flex flex-row items-center gap-x-4 text-sm text-stone-400">
        {children}
      </div>
    </div>
  );
};

export { GenericListItem };
