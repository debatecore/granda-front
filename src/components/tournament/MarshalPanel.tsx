import { getTranslations } from "next-intl/server";

type MarshalPanelProps = {
  motion: string;
};

export async function MarshalPanel({ motion }: MarshalPanelProps) {
  const t = await getTranslations("debate_details");

  const conductDebateHref = `https://tools.debateco.re/oxford-debate/setup?motion=${encodeURIComponent(
    motion,
  )}`;

  return (
    <div className="mt-8 w-full border border-stone-700 bg-stone-900/60 p-4 sm:mt-10">
      <div className="mb-3 flex justify-end">
        <h2 className="text-sm font-medium text-stone-300">
          {t("marshal_panel_title")}
        </h2>
      </div>

      <a
        href={conductDebateHref}
        target="_blank"
        rel="noreferrer"
        className="block w-full rounded-sm border border-stone-600 bg-white/10 px-6 py-5 text-center text-xl font-semibold text-white transition hover:bg-white/15"
      >
        {t("conduct_button")}
      </a>
    </div>
  );
}
