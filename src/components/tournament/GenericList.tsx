import { ReactNode } from "react";

const GenericList = ({ children }: { children: ReactNode }) => {
  return <div className="flex w-full flex-col gap-4">{children}</div>;
};

export { GenericList };
