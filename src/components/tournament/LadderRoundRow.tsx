import { Debate } from "@/types/Debate";
import { Round } from "@/types/Round";
import { LadderDebateNode } from "../LadderDebateNode";

export function LadderRoundRow({
  round,
  debates,
}: {
  round: Round;
  debates: Debate[];
}) {
  return (
    <div className="w-3xl grid-cols-2">
      <span>{round.name}</span>{" "}
      <div className="flex justify-center gap-10">
        {debates.map((debate) => {
          return <LadderDebateNode key={debate.id} debate={debate} />;
        })}
      </div>
    </div>
  );
}
