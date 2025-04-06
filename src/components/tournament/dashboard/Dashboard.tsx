"use client";

import { LucideSidebar, LucideX } from "lucide-react";

import { useState } from "react";

const Dashboard = ({
  sidebar,
  header,
  children,
}: {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  children: React.ReactNode;
}) => {
  const [showSide, setShowSide] = useState<boolean>(true);
  return (
    <div className="flex h-screen relative">
      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:block border-r border-stone-700 bg-stone-900">
        {sidebar}
        {/*  */}
      </div>
      {/* MOBILE SIDEBAR */}
      <div className="block lg:hidden">
        {showSide && (
          <>
            <div className="absolute h-full w-full xs:w-72 left-0 top-0 bg-stone-900 z-150 border-r border-stone-700">
              {sidebar}
              <button
                className="absolute top-7 right-6 cursor-pointer rounded border border-stone-700 hover:border-stone-500 focus:border-stone-500 bg-stone-700/40 hover:bg-stone-600/40 focus:bg-stone-600/40 z-160"
                onClick={() => setShowSide(false)}
              >
                <LucideX />
              </button>
            </div>
          </>
        )}
      </div>
      <div className="flex flex-1 flex-col">
        <header className="relative flex max-h-20 min-h-20 h-full items-center bg-stone-900 gap-4 border-b border-stone-700 px-4 md:px-6 overflow-hidden">
          <button
            className="block lg:hidden p-1 rounded border border-stone-700 hover:border-stone-500 focus:border-stone-500 bg-stone-700/40 hover:bg-stone-600/40 focus:bg-stone-600/40 text-stone-100 z-40 cursor-pointer"
            onClick={() => setShowSide(true)}
          >
            <LucideSidebar />
          </button>
          {header}
        </header>
        <div className="block w-full h-full overflow-scroll">{children}</div>
      </div>
    </div>
  );
};

export { Dashboard };
