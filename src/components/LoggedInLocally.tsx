"use client";

import { fetchClientSide } from "@/lib/utils";
import { User } from "@/types/User";
import { LucideUser } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LinkButton } from "./ui/LinkButton";
import { GenericButton } from "./ui/GenericButton";

const LocalLoggedIn = ({ user }: { user: User }) => {
  const t = useTranslations("login");
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
          <p className="font-semibold text-xl">
            {t("welcome_back", { handle: user.handle })}
          </p>
          <p className="text-stone-500 text-xs">
            {t("next_destination_instruction")}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-auto">
        {[
          {
            name: t("tournaments_list"),
            href: "/tournaments",
          },
        ].map((el) => {
          return (
            <LinkButton key={el.href} href={el.href} square>
              {t("tournaments_list")}
            </LinkButton>
          );
        })}
      </div>
      <div className="">
        <GenericButton
          square
          color="error"
          onClick={() => {
            logoutrequest();
          }}
        >
          {t("log_out")}
        </GenericButton>
        <p
          className={`p-1 text-center text-stone-400 text-xs ${
            msg === MSG_PLACEHOLDER && "text-transparent select-none"
          }`}
        >
          {msg}
        </p>
      </div>
    </div>
  );
};

export { LocalLoggedIn };
