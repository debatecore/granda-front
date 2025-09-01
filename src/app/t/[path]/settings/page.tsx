"use client";

import i18next from "i18next";
import GenericSelect from "@/components/ui/GenericSelect";
import { getEndonym, languages } from "@/i18n/config";
import { FlagIcon } from "@/components/icons/FlagIcon";
import { useState } from "react";
import { LanguageCode } from "@/types/Language";
import { useTranslation } from "react-i18next";

export default function TournamentSettingsPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { t } = useTranslation("settings");
  const languageOptions = languages.map((languageCode) => {
    return {
      value: languageCode,
      text: getEndonym(languageCode),
      icon: <FlagIcon language={languageCode} />,
    };
  });
  const [currentLanguage, setCurrentLanguage] = useState(i18next.language);

  const handleLanguageChange = (language: LanguageCode) => {
    setCurrentLanguage(language);
    i18next.changeLanguage(language);
  };

  return (
    <>
      <div className="p-4 gap-6 items-center">
        <h1 className="text-2xl font-logo mb-6">{t("title")}</h1>
        <h2>{t("language_heading")}</h2>
        <GenericSelect
          options={languageOptions}
          value={currentLanguage}
          onValueChange={handleLanguageChange}
        />
      </div>
    </>
  );
}
