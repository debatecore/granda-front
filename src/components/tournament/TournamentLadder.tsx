import { Round } from "@/types/Round";
import { LadderRoundRow } from "./LadderRoundRow";
import { Debate } from "@/types/Debate";

export function TournamentLadder({
  debates,
  rounds,
}: {
  tournamentId: string;
  rounds: Round[];
  debates: Debate[];
}) {
  return (
    <div className="mt-8 w-full border-t border-b border-stone-700/70 px-8 py-12 sm:mt-16 sm:w-fit sm:py-16 lg:px-16">
      {rounds.map((round) => {
        return (
          <LadderRoundRow
            key={round.id}
            round={round}
            debates={debates.filter((debate) => {
              return debate.round_id == round.id;
            })}
          />
        );
      })}
    </div>
  );
}
