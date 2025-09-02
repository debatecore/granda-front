import { useTranslations } from "next-intl";

const GrandaLogo = ({
  className: grandaClassName,
  subtitle = true,
}: {
  className: string;
  subtitle?: boolean;
}) => {
  const t = useTranslations("debatecore");
  return (
    <div className="select-none">
      <h1 className={`${grandaClassName} text-center font-logo`}>{"granda"}</h1>
      {subtitle ? (
        <p className="font-fancy text-stone-400 -mt-1 ml-15 text-center">
          {t("logo_subtitle")}
        </p>
      ) : (
        ""
      )}
    </div>
  );
};
export { GrandaLogo };
