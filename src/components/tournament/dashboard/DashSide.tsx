import {
  LucideBetweenHorizontalStart,
  LucideCastle,
  LucideFileClock,
  LucideFileImage,
  LucideIcon,
  LucideLayoutDashboard,
  LucidePaintBucket,
  LucideScale,
  LucideScrollText,
  LucideSettings,
  LucideTrophy,
  LucideUserCog,
  LucideUsers,
  LucideWaypoints,
} from "lucide-react";
import Link from "next/link";
import "@/i18n/language-utils";
import { useTranslations } from "next-intl";

type DashSideLink = {
  name: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
};

type DashSidebarLinks = {
  catname: string;
  links: DashSideLink[];
}[];

const DashSide = ({
  tournament_path,
  path_highlight,
}: {
  tournament_path: string;
  path_highlight?: string;
}) => {
  const t = useTranslations("dash");
  const links: DashSidebarLinks = [
    {
      catname: t("sidebar.tournament.catname"),
      links: [
        {
          name: t("sidebar.tournament.overview"),
          href: `/t/${tournament_path}`,
          icon: LucideLayoutDashboard,
        },
        {
          name: t("sidebar.tournament.ladder"),
          href: `/t/${tournament_path}/ladder`,
          icon: LucideBetweenHorizontalStart,
          disabled: true,
        },
        {
          name: t("sidebar.tournament.standings"),
          href: `/t/${tournament_path}/standings`,
          icon: LucideTrophy,
          disabled: true,
        },
      ],
    },
    {
      catname: t("sidebar.tournament_data.catname"),
      links: [
        {
          name: t("sidebar.tournament_data.competing_teams"),
          href: `/t/${tournament_path}/teams`,
          icon: LucideUsers,
        },
        {
          name: t("sidebar.tournament_data.debate_motions"),
          href: `/t/${tournament_path}/motions`,
          icon: LucideScrollText,
        },
        {
          name: t("sidebar.tournament_data.staff_judges_bias"),
          href: `/t/${tournament_path}/staff`,
          icon: LucideScale,
        },
        {
          name: t("sidebar.tournament_data.physical_infrastructure"),
          href: `/t/${tournament_path}/locations`,
          icon: LucideCastle,
        },
        {
          name: t("sidebar.tournament_data.event_branding"),
          href: `/t/${tournament_path}/event-branding`,
          icon: LucideFileImage,
          disabled: true,
        },
      ],
    },
    {
      catname: t("sidebar.shareable.catname"),
      links: [
        {
          name: t("sidebar.shareable.image_generation"),
          href: `/t/${tournament_path}/image-generation`,
          icon: LucidePaintBucket,
          disabled: true,
        },
      ],
    },
    {
      catname: t("sidebar.organisational.catname"),
      links: [
        {
          name: t("sidebar.organisational.audit_log"),
          href: `/t/${tournament_path}/logs`,
          icon: LucideFileClock,
        },
        {
          name: t("sidebar.organisational.users"),
          href: `/t/${tournament_path}/users`,
          icon: LucideUserCog,
        },
        {
          name: t("sidebar.organisational.tournament_settings"),
          href: `/t/${tournament_path}/settings`,
          icon: LucideSettings,
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="flex items-center pl-6 gap-4 h-20 border-b border-stone-700">
        <LucideWaypoints size={32} />
        <div className="mb-1">
          <h3 className="font-logo text-2xl">{"granda"}</h3>
          <p className="text-xs">
            <span className="text-stone-500">{t("sidebar.logo_by")} </span>
            <Link
              href={"https://debateco.re"}
              className="font-semibold font-lexend tracking-wide text-transparent text-clip bg-clip-text bg-gradient-to-r from-violet-600 from-30% to-70% to-pink-400"
            >
              {"debatecore"}
            </Link>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-8 pt-4 px-4">
        {links.map((category) => {
          return (
            <div
              className="flex flex-col gap-2 font-medium"
              key={category.catname}
            >
              <p className="text-stone-500 text-sm pl-2">
                {category.catname.toUpperCase()}
              </p>
              {category.links.map((link) => {
                return (
                  <Link
                    key={link.name}
                    className={`flex flex-row items-center gap-2 border border-transparent hover:border-stone-700 hover:bg-stone-700/25 focus:border-stone-700 focus:bg-stone-700/25 text-stone-200 rounded py-1 px-2 ${
                      link.name === path_highlight && "bg-stone-700/15"
                    } ${link.disabled && "opacity-35"}`}
                    href={link.disabled === true ? "" : link.href}
                    aria-disabled={link.disabled === true}
                  >
                    <link.icon
                      size={22}
                      className={`${
                        link.name === path_highlight
                          ? "text-stone-400"
                          : "text-stone-500"
                      } font-light`}
                    />
                    <span className="tracking-tight font-geist font-medium">
                      {link.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { DashSide };
