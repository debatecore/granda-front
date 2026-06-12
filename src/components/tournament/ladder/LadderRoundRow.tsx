import { Debate } from "@/types/Debate";
import { Round } from "@/types/Round";
import { LadderDebateNode } from "./LadderDebateNode";
import { Phase } from "@/types/Phase";
import { Motion } from "@/types/Motion";
import { useTranslations } from "next-intl";
import { GenericButton } from "@/components/ui/GenericButton";

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
    return debateMotion || t("unconfigured_debate");
  };

  if (!phase) {
    return (
      <p className="text-red-400">{`Cannot display round ${round.id}; cannot find matching phase`}</p>
    );
  }

  return (
    <div className="w-3xl grid-cols-2 mb-2">
      <GenericButton
        smol
        className="w-fit hover:underline cursor-pointer"
        onClick={onOpenConfig}
      >
        {round.name}
      </GenericButton>
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
