import { Tournament } from "@/types/Tournament";
import olek from "@/../public/S-MOW2024-olekrelief.jpg";
import { LucideSettings, LucideUserCircle } from "lucide-react";
import { User } from "@/types/User";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOutDashHeaderDropdownButton } from "./Logout";

const DashHeader = ({ t, u }: { t: Tournament; u: User }) => {
  return (
    <>
      <div className="space-x-1 z-40">
        <span className="font-semibold font-logo z-40 hidden xs:inline">
          {t.full_name}
        </span>
        <span className="text-xs font-light z-40 hidden xs:inline">{`(${t.shortened_name})`}</span>
        <span className="font-semibold font-logo z-40 xs:hidden">
          {t.shortened_name}
        </span>
        {/* this should be the separator between breadcrumb steps.. */}
        {/* <LucideChevronRight className="inline" size={16} /> */}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="ml-auto flex gap-4 px-3 py-1 bg-stone-700/40 hover:bg-stone-600/40 focus:bg-stone-600/40 border border-stone-700 hover:border-stone-500 focus:border-stone-500 rounded z-40 cursor-pointer">
            <p className="font-semibold tracking-tight">{u.handle}</p>
            <LucideUserCircle />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="select-none">
            {"Your account"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem disabled>
              <LucideUserCircle /> {"Account"}
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <LucideSettings /> {"Settings"}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <LogOutDashHeaderDropdownButton />
        </DropdownMenuContent>
      </DropdownMenu>
      {/* COMMENT OUT THOSE BOTTOM TWO TO DELETE THE IMAGE FROM THE HEADER.. BOTH! */}
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
