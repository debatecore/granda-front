import { Round } from "@/types/Round";
import { LadderRoundRow } from "./LadderRoundRow";
import { Debate } from "@/types/Debate";
import { Phase } from "@/types/Phase";
import { Motion } from "@/types/Motion";
import { useState } from "react";
import { RoundConfig } from "../ui/RoundConfig";

export function TournamentLadder({
  debates,
  rounds,
  phases,
  motions,
  tournamentId,
}: {
  tournamentId: string;
  rounds: Round[];
  debates: Debate[];
  phases: Phase[];
  motions: Motion[];
}) {
  const [configuredRound, setConfiguredRound] = useState<Round | null>(null);
  const [isRoundConfigOpen, setIsRoundConfigOpen] = useState(false);
  return (
    <div className="mt-8 w-full border-t border-b border-stone-700/70 px-8 py-12 sm:mt-16 sm:w-fit sm:py-16 lg:px-16">
      {isRoundConfigOpen && configuredRound && (
        <div className="absolute">
          <RoundConfig
            onApplyAction={() => setIsRoundConfigOpen(false)}
            tournamentId={tournamentId}
            round={configuredRound}
            motion={motions.find(
              (motion) => configuredRound.motion_id == motion.id,
            )}
          />
        </div>
      )}
      {rounds.map((round) => {
        return (
          <LadderRoundRow
            onOpenConfig={() => {
              setIsRoundConfigOpen(true);
              setConfiguredRound(round);
            }}
            phase={phases.find((phase) => {
              return phase.id == round.phase_id;
            })}
            key={round.id}
            round={round}
            debates={debates.filter((debate) => {
              return debate.round_id == round.id;
            })}
            motions={motions}
          />
        );
      })}
    </div>
  );
}
