import { getRequestConfig, RequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { LANGUAGE_COOKIE } from "./language-utils";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const language = await determineLanguage(requestLocale);
  return {
    locale: language,
    messages: (await import(`./translations/${language}.json`)).default,
  } as RequestConfig;
});

export const determineLanguage = async (
  requestLocale: Promise<string | undefined>
) => {
  const store = await cookies();
  const cachedLanguage = store.get(LANGUAGE_COOKIE);
  if (cachedLanguage) {
    return cachedLanguage.value;
  } else {
    const requested = await requestLocale;
    const locale = hasLocale(routing.locales, requested)
      ? requested
      : routing.defaultLocale;
    return locale;
  }
};
