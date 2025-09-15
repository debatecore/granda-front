import { LANGUAGE_COOKIE } from "@/i18n/language-utils";
import { cookies } from "next/headers";
import { LanguageSwitcher } from "@/components/settings/LanguageSwitcher";
import { getLocale, getTranslations } from "next-intl/server";
import { SaveButton } from "@/components/settings/SaveButton";

export default async function TournamentSettingsPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const t = await getTranslations("settings");
  const store = await cookies();
  const language = await getLocale();

  return (
    <>
      <div className="p-4 gap-6 items-center">
        <h1 className="text-2xl font-logo mb-6">{t("title")}</h1>
        <h2>{t("language_heading")}</h2>
        <LanguageSwitcher cachedLanguage={language} />
        <SaveButton />
      </div>
    </>
  );
}
