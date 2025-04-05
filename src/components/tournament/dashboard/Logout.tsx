"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { fetchClientSide } from "@/lib/utils";
import { useRouter } from "next/navigation";

const LogOutDashHeaderDropdownButton = () => {
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
      {"Log out"}
    </DropdownMenuItem>
  );
};

export { LogOutDashHeaderDropdownButton };
