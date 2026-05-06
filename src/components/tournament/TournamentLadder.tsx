import { Round } from "@/types/Round";
import { LadderRoundRow } from "./LadderRoundRow";
import { Debate } from "@/types/Debate";
import { Phase } from "@/types/Phase";
import { Motion } from "@/types/Motion";

export function TournamentLadder({
  debates,
  rounds,
  phases,
  motions,
  onOpenConfig,
}: {
  tournamentId: string;
  rounds: Round[];
  debates: Debate[];
  phases: Phase[];
  motions: Motion[];
  onOpenConfig: (round: Round) => void;
}) {
  return (
    <div className="mt-8 w-full border-t border-b border-stone-700/70 px-8 py-12 sm:mt-16 sm:w-fit sm:py-16 lg:px-16">
      {rounds.map((round) => {
        return (
          <LadderRoundRow
            onOpenConfig={() => onOpenConfig(round)}
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
