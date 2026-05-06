import { Debate } from "@/types/Debate";
import { Round } from "@/types/Round";
import { LadderDebateNode } from "../LadderDebateNode";
import { Phase } from "@/types/Phase";
import { Motion } from "@/types/Motion";
import { useTranslations } from "next-intl";

export function LadderRoundRow({
  onOpenConfig,
  round,
  debates,
  phase,
  motions,
}: {
  onOpenConfig: () => void;
  configuredRound?: Round;
  round: Round;
  debates: Debate[];
  phase?: Phase;
  motions: Motion[];
}) {
  const t = useTranslations("ladder");

  const getDisplayText = (debate: Debate) => {
    const debateMotion = motions.find(
      (motion) => motion.id == debate.motion_id,
    )?.motion;
    return debateMotion || t("no_motion");
  };

  if (!phase) {
    return (
      <p className="text-red-400">{`Cannot display round ${round.id}; cannot find matching phase`}</p>
    );
  }

  return (
    <div className="w-3xl grid-cols-2 mb-2">
      <button
        className="hover:underline hover:cursor-pointer"
        onClick={onOpenConfig}
      >
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
    </div>
  );
}
