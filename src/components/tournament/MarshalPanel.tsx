import { GenericComponent } from "@/components/ui/GenericComponent";
import { useTranslations } from "next-intl";

type MarshalPanelProps = {
  motion: string;
};

export function MarshalPanel({ motion }: MarshalPanelProps) {
  const t = useTranslations("debate_details");

  const proceedToDebateHref = `https://tools.debateco.re/oxford-debate/setup?motion=${encodeURIComponent(
    motion,
  )}`;

  return (
    <GenericComponent
      title={t("marshal_panel")}
      showActions
      className="w-full max-w-[760px]"
    >
      <a
        href={proceedToDebateHref}
        target="_blank"
        rel="noreferrer"
        className="block w-full rounded-sm border border-stone-600 bg-white/10 px-6 py-5 text-center text-xl font-semibold text-white/75 transition hover:bg-white/15"
      >
        {t("proceed_to_debate")}
      </a>
    </GenericComponent>
  );
}
