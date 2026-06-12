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

  const getRoundLabel = (round: Round, phase: Phase, debates: Debate[]) => {
    // finals: determine label based on number of debates
    if (phase.is_finals) {
      const matches = debates.length;
      if (matches === 1) return t("finals.final");
      if (matches === 2) return t("finals.semi_final");
      if (matches === 4) return t("finals.quarter_final");
      if (matches > 0 && (matches & (matches - 1)) === 0) {
        const n = matches * 2;
        return t("finals.nth_final", { n });
      }
      return round.name;
    }

    // non-finals
    const m = round.name.match(/^round_(\d+)$/i);
    if (m) {
      const roundNumber = Number(m[1]);
      if (!Number.isNaN(roundNumber)) return t("round", { n: roundNumber });
    }

    return round.name;
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
        onClick={() => {
          onOpenConfig();

          setTimeout(() => {
            document
              .querySelector("[data-round-config-popup]")
              ?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
          }, 50);
        }}
      >
        {getRoundLabel(round, phase, debates)}
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
