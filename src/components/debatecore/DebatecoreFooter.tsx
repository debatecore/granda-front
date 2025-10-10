import { useTranslations } from "next-intl";
import { DebatecoreLogo as DebatecoreLogo } from "./DebatecoreLogo";

const DebatecoreFooter = () => {
  const t = useTranslations("debatecore");
  return (
    <p className="text-sm text-stone-400 mt-auto">
      {t.rich("footer_text", {
        debatecore: () => <DebatecoreLogo />,
      })}
    </p>
  );
};
export { DebatecoreFooter };
