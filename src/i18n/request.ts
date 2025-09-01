import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { LANGUAGE_COOKIE } from "./language-utils";

export default getRequestConfig(async () => {
  const store = await cookies();
  const language = store.get(LANGUAGE_COOKIE)?.value || "en";

  return {
    locale: language,
    messages: (await import(`./translations/${language}.json`)).default,
  };
});
