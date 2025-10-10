"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { fetchClientSide } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

const LogOutDashHeaderDropdownButton = () => {
  const t = useTranslations("dash");
  const router = useRouter();
  const logoutrequest = async () => {
    const res = await fetchClientSide("/auth/clear");
    if (res.ok || res.status === 401) {
      router.push("/login");
    }
  };
  return (
    <DropdownMenuItem
      variant="destructive"
      className="cursor-pointer"
      onClick={() => logoutrequest()}
    >
      {t("header.log_out")}
    </DropdownMenuItem>
  );
};

export { LogOutDashHeaderDropdownButton };
