import { ReactNode } from "react";

const GenericListItem = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full rounded border border-stone-700 bg-stone-700/15 px-4 py-4 hover:bg-stone-700/25 transition-colors">
      {children}
    </div>
  );
};

export { GenericListItem };
