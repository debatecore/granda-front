import {
  LucideBetweenHorizontalStart,
  LucideCastle,
  LucideFileClock,
  LucideFileImage,
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
import { ComponentType } from "react";
import { Link } from "@/i18n/navigation";
import "@/i18n/language-utils";
import { useTranslations } from "next-intl";
import { DebatecoreLogo } from "@/components/debatecore/DebatecoreLogo";
import { GrandaLogo } from "@/components/debatecore/GrandaLogo";
import { IconDebate } from "@/components/icons/DebateIcon";

type SidebarIconProps = {
  className?: string;
};

const DebateSidebarIcon = ({ className }: SidebarIconProps) => {
  return <IconDebate moreClass={className} />;
};

type DashSideLink = {
  name: string;
  href: string;
  icon: ComponentType<SidebarIconProps>;
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
          disabled: false,
        },
        {
          name: t("sidebar.tournament.debates"),
          href: `/t/${tournament_path}/debates`,
          icon: DebateSidebarIcon,
          disabled: false,
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
      <div className="flex h-20 items-center gap-4 border-b border-stone-700 pl-6">
        <LucideWaypoints size={32} />
        <div className="mb-1">
          <GrandaLogo className="text-2xl" subtitle={false} />
          <p className="text-xs">
            <span className="text-stone-500">{t("sidebar.logo_by")} </span>
            <DebatecoreLogo />
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-8 px-4 pt-4">
        {links.map((category) => {
          return (
            <div
              className="flex flex-col gap-2 font-medium"
              key={category.catname}
            >
              <p className="pl-2 text-sm text-stone-500">
                {category.catname.toUpperCase()}
              </p>

              {category.links.map((link) => {
                const Icon = link.icon;
                const isHighlighted = link.name === path_highlight;

                return (
                  <Link
                    key={link.name}
                    className={`flex flex-row items-center gap-2 rounded border border-transparent px-2 py-1 text-stone-200 hover:border-stone-700 hover:bg-stone-700/25 focus:border-stone-700 focus:bg-stone-700/25 ${
                      isHighlighted ? "bg-stone-700/15" : ""
                    } ${link.disabled ? "opacity-35" : ""}`}
                    href={link.disabled ? "" : link.href}
                    aria-disabled={link.disabled === true}
                  >
                    <Icon
                      className={`h-[22px] w-[22px] ${
                        isHighlighted ? "text-stone-400" : "text-stone-500"
                      }`}
                    />

                    <span className="font-geist font-medium tracking-tight">
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
