"use client";

import { fetchClientSide } from "@/lib/utils";
import { User } from "@/types/User";
import { LucideUser } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LocalLoggedIn = ({ user }: { user: User }) => {
  const MSG_PLACEHOLDER = "--";

  const router = useRouter();
  const [msg, setMsg] = useState<string>(MSG_PLACEHOLDER);

  const logoutrequest = async () => {
    const res = await fetchClientSide("/auth/clear");
    if (res.ok || res.status === 401) {
      router.refresh();
    } else {
      const msg = await res.text();
      setMsg(msg);
    }
  };

  return (
    <div className="mb-10 mt-4 p-4 flex flex-col h-full gap-4">
      <div className="flex flex-row items-center gap-4">
        {user.profile_picture ? (
          <div className="size-16 bg-stone-950 rounded-full overflow-clip flex items-center justify-center">
            <img
              src={user.profile_picture}
              alt="Your profile picture"
              className="size-16"
            />
          </div>
        ) : (
          <div className="size-16 bg-stone-950 rounded-full overflow-clip flex items-center justify-center">
            <LucideUser size={36} className="text-stone-400" />
          </div>
        )}
        <div>
          <p className="font-semibold text-xl">{`Welcome back, ${user.handle}!`}</p>
          <p className="text-stone-500 text-xs">{`Please choose your next destination.`}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-auto">
        {[
          {
            name: "Tournaments List",
            href: "/tournaments",
          },
          // {
          //   name: "User Settings",
          //   href: "/user-settings",
          //   disabled: true,
          // },
        ].map((el) => {
          return (
            <Link
              href={el.href}
              key={el.href}
              className="cursor-pointer p-1 text-center block w-full bg-stone-700/45 rounded px-2 border border-stone-700 hover:border-stone-500 focus:border-stone-500"
            >
              {el.name}
            </Link>
          );
        })}
      </div>
      <div className="">
        <button
          className="cursor-pointer p-1 w-full bg-red-900/45 rounded px-2 border border-red-900 hover:border-red-700 focus:border-red-700"
          onClick={() => {
            logoutrequest();
          }}
        >
          Log out
        </button>
        <p
          className={`p-1 text-center text-stone-400 text-xs ${msg === MSG_PLACEHOLDER && "text-transparent select-none"}`}
        >
          {msg}
        </p>
      </div>
    </div>
  );
};

export { LocalLoggedIn };
