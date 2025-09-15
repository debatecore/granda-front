import { defineRouting } from "next-intl/routing";
import { LANGUAGE_COOKIE, languages } from "./language-utils";

export const routing = defineRouting({
  locales: languages,
  defaultLocale: "en",
  localePrefix: "always",
  localeCookie: {
    name: LANGUAGE_COOKIE,
  },
});
