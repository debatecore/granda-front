"use client";
import { useTranslations } from "next-intl";
import { GenericButton } from "../ui/GenericButton";
import { usePathname, useRouter } from "@/i18n/navigation";
import { getCachedLanguage } from "@/i18n/language-utils";

const SaveButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("settings");
  return (
    <GenericButton
      square
      onClick={() => {
        // TO-DO: send requests to change settings
        // show a message indicating successful change
        const locale = getCachedLanguage();
        router.replace(pathname, { locale });
      }}
      className="max-w-1/12"
      color="success"
    >
      {t("save")}
    </GenericButton>
  );
};

export { SaveButton };
