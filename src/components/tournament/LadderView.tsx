"use client";

import { Phase } from "@/types/Phase";
import { useTranslations } from "next-intl";
import { TournamentLadder } from "./TournamentLadder";
import { TournamentPlanningForm } from "./TournamentPlanningForm";
import { useRouter } from "next/navigation";
import { Round } from "@/types/Round";
import { Debate } from "@/types/Debate";
import { Motion } from "@/types/Motion";
import { RoundConfig } from "../ui/RoundConfig";
import { useState } from "react";

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
  const [configuredRound, setConfiguredRound] = useState<Round | null>(null);
  const [isRoundConfigOpen, setIsRoundConfigOpen] = useState(false);

  return (
    <div className="relative flex w-full flex-col items-center">
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
            onOpenConfig={(round) => {
              setIsRoundConfigOpen(true);
              setConfiguredRound(round);
            }}
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
      {isRoundConfigOpen && configuredRound && (
        <div
          className="w-full fixed inset-0 bg-black/40 left-1/2 -translate-x-1/2 m-auto flex justify-center"
          onClick={() => setIsRoundConfigOpen(false)}
        >
          <RoundConfig
            onApplyAction={() => {}}
            tournamentId={tournamentId}
            round={configuredRound}
            motion={motions?.find(
              (motion) => configuredRound.motion_id == motion.id,
            )}
          />
        </div>
      )}
    </div>
  );
}
