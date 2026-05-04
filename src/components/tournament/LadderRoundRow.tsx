import { Debate } from "@/types/Debate";
import { Round } from "@/types/Round";
import { LadderDebateNode } from "../LadderDebateNode";
import { Phase } from "@/types/Phase";
import { Motion } from "@/types/Motion";
import { useTranslations } from "next-intl";
import { RoundConfig } from "../ui/RoundConfig";
import { useState } from "react";

export function LadderRoundRow({
  round,
  debates,
  phase,
  motions,
}: {
  round: Round;
  debates: Debate[];
  phase: Phase;
  motions: Motion[];
}) {
  const t = useTranslations("ladder");
  const [isRoundConfigOpen, setIsRoundConfigOpen] = useState(false);

  const getDisplayText = (debate: Debate) => {
    const debateMotion = motions.find(
      (motion) => motion.id == debate.motion_id,
    )?.motion;
    return debateMotion || t("no_motion");
  };

  return (
    <div className="w-3xl grid-cols-2">
      <button onClick={() => setIsRoundConfigOpen(!isRoundConfigOpen)}>
        {round.name}
      </button>

      <div className="flex justify-center gap-10">
        {debates.map((debate) => (
          <LadderDebateNode
            key={debate.id}
            debate={debate}
            display_text={getDisplayText(debate)}
            isFinals={phase.is_finals}
          />
        ))}
      </div>

      {isRoundConfigOpen && (
        <div className="absolute">
          <RoundConfig
            name={round.name}
            tournamentId={phase.tournament_id}
            round={round}
          />
        </div>
      )}
    </div>
  );
}
