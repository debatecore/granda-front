"use client";
import { useState } from "react";
import GenericSelect from "../ui/GenericSelect";
import { LanguageCode } from "@/types/Language";
import { FlagIcon } from "../icons/FlagIcon";
import { getEndonym, LANGUAGE_COOKIE, languages } from "@/i18n/language-utils";

const LanguageSwitcher = ({ cachedLanguage }: { cachedLanguage: string }) => {
  const [language, setLanguage] = useState(cachedLanguage);

  const handleLanguageChange = (language: LanguageCode) => {
    setLanguage(language);
    document.cookie = `${LANGUAGE_COOKIE}=${language}; SameSite=strict; path=/; secure`;
  };

  const languageOptions = languages.map((languageCode) => {
    return {
      value: languageCode,
      text: getEndonym(languageCode),
      icon: <FlagIcon language={languageCode} />,
    };
  });

  return (
    <GenericSelect
      options={languageOptions}
      value={language}
      onValueChange={handleLanguageChange}
    />
  );
};

export { LanguageSwitcher };
