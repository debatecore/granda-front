"use client";
import { useTranslations } from "next-intl";
import { GenericButton } from "../ui/GenericButton";

// TO-DO: send requests to change settings
// show a message indicating successful change
const saveSettings = () => {
  window.location.reload();
};

const SaveButton = () => {
  const t = useTranslations("settings");
  return (
    <GenericButton
      text={t("save")}
      onClick={saveSettings}
      className="max-w-1/12"
    />
  );
};

export { SaveButton };
