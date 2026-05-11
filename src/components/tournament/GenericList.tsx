import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

type GenericListProps = {
  children: ReactNode;
  icon?: LucideIcon;
};

const GenericList = ({ children, icon: ICON }: GenericListProps) => {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full flex-col gap-3">
        {ICON && (
          <div className="flex h-8 w-8 items-center justify-center rounded bg-pink-500 text-white">
            <ICON size={20} />
          </div>
        )}
      </div>

      <div className="flex w-full flex-col gap-4">{children}</div>
    </div>
  );
};

export { GenericList };
