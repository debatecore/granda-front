import { LanguageCode } from "@/types/Language";

export const languages = ["en", "pl"] as const;

export const LANGUAGE_COOKIE = "language";

export const getEndonym = (languageCode: LanguageCode) => {
  switch (languageCode) {
    case "en":
      return "English";
    case "pl":
      return "Polski";
  }
};
