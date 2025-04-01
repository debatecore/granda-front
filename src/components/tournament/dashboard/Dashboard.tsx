"use client";

// import { useState } from "react";

const Dashboard = ({
  sidebar,
  header,
  children,
}: {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  children: React.ReactNode;
}) => {
  // const [showSide, setShowSide] = useState<boolean>(true);
  return (
    <div className="flex h-screen">
      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:block border-r border-stone-700 bg-stone-900">
        {sidebar}
        {/*  */}
      </div>
      {/* MOBILE SIDEBAR */}
      <div className="block lg:hidden">
        {/*  */}
        {/*  */}
      </div>
      <div className="flex flex-1 flex-col">
        <header className="relative flex max-h-20 min-h-20 h-full items-center bg-stone-900 gap-4 border-b border-stone-700 px-4 md:px-6 overflow-hidden">
          {header}
        </header>
        <div className="block w-full h-full overflow-scroll">{children}</div>
      </div>
    </div>
  );
};

export { Dashboard };
