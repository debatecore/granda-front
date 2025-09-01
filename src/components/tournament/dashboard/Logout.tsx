"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { fetchClientSide } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const LogOutDashHeaderDropdownButton = () => {
  const { t } = useTranslation("dash_header");
  const router = useRouter();
  const logoutrequest = async () => {
    const res = await fetchClientSide("/auth/clear");
    if (res.ok || res.status === 401) {
      router.refresh();
    }
  };
  return (
    <DropdownMenuItem
      variant="destructive"
      className="cursor-pointer"
      onClick={() => logoutrequest()}
    >
      {t("log_out")}
    </DropdownMenuItem>
  );
};

export { LogOutDashHeaderDropdownButton };
