"use client";

import { Phase } from "@/types/Phase";
import { useTranslations } from "next-intl";
import { TournamentLadder } from "./TournamentLadder";
import { TournamentPlanningForm } from "./TournamentPlanningForm";
import { useRouter } from "next/navigation";
import { Round } from "@/types/Round";
import { Debate } from "@/types/Debate";
import { Motion } from "@/types/Motion";

export function LadderView({
  phases,
  tournamentId,
  rounds,
  debates,
  motions,
}: {
  phases?: Phase[];
  rounds?: Round[];
  debates?: Debate[];
  motions?: Motion[];
  tournamentId: string;
}) {
  const isPlanned = phases && phases.length > 0;
  const t = useTranslations("ladder");
  const router = useRouter();

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mt-8 flex w-full max-w-5xl flex-col px-8 sm:mt-16 lg:px-16">
        <h1 className="text-center text-3xl font-semibold text-white sm:text-left">
          {isPlanned ? t("title") : t("planning_title")}
        </h1>
        {phases ? (
          ""
        ) : (
          <p className="mt-4 text-sm text-red-400">{t("no_phases_error")}</p>
        )}
        {isPlanned ? (
          <TournamentLadder
            phases={phases || []}
            debates={debates || []}
            rounds={rounds || []}
            motions={motions || []}
            tournamentId={tournamentId}
          />
        ) : (
          <TournamentPlanningForm
            tournamentId={tournamentId}
            onPlanned={() => {
              router.refresh();
            }}
          />
        )}
      </div>
    </div>
  );
}
