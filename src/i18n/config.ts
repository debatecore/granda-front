"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector, {
  DetectorOptions,
} from "i18next-browser-languagedetector";
import settings_en from "./en/settings.json";
import dash_pl from "./pl/dash.json";
import dash_en from "./en/dash.json";
import settings_pl from "./pl/settings.json";
import login_pl from "./pl/login.json";
import login_en from "./en/login.json";
import { LanguageCode } from "@/types/Language";

const options: DetectorOptions = {
  // order and from where user language should be detected
  order: ["querystring", "localStorage", "navigator"],

  // keys or params to lookup language from
  lookupQuerystring: "lng",
  lookupCookie: "i18next",
  lookupLocalStorage: "i18nextLng",
  lookupSessionStorage: "i18nextLng",
  lookupFromPathIndex: 0,
  lookupFromSubdomainIndex: 0,

  // cache user language on
  caches: ["localStorage", "cookie"],
  excludeCacheFor: ["cimode"], // languages to not persist (cookie, localStorage)
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection: options,
    debug: true,
    load: "languageOnly",
    supportedLngs: ["en", "pl"],
    fallbackLng: "en",
    resources: {
      en: {
        settings: settings_en,
        dash: dash_en,
        login: login_en,
      },
      pl: {
        settings: settings_pl,
        dash: dash_pl,
        login: login_pl,
      },
    },
  });

const languages = ["en", "pl"] as const;
export { languages };

const getEndonym = (languageCode: LanguageCode) => {
  switch (languageCode) {
    case "en":
      return "English";
    case "pl":
      return "Polski";
  }
};

export { getEndonym };
export default i18n;
