import { Tournament } from "@/types/Tournament";
import olek from "@/../public/S-MOW2024-olekrelief.jpg";
import { LucideUserCircle } from "lucide-react";
import { User } from "@/types/User";

const DashHeader = ({ t, u }: { t: Tournament; u: User }) => {
  return (
    <>
      <div className="space-x-1 z-40">
        <span className="font-semibold font-logo z-40">{t.full_name}</span>
        <span className="text-xs font-light z-40">{`(${t.shortened_name})`}</span>
        {/* this should be the separator between breadcrumb steps.. */}
        {/* <LucideChevronRight className="inline" size={16} /> */}
      </div>
      <div className="ml-auto flex gap-4 px-3 py-1 bg-stone-700/40 border border-stone-700 rounded z-40 cursor-pointer">
        <p className="font-semibold tracking-tight">{u.handle}</p>
        <LucideUserCircle />
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-30" />
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center blur-sm opacity-25 z-20"
        style={{
          backgroundImage: `url(${olek.src})`,
        }}
      />
    </>
  );
};

export { DashHeader };
