import { getRequestConfig, RequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const language = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
  return {
    locale: language,
    messages: (await import(`./translations/${language}.json`)).default,
  } as RequestConfig;
});
