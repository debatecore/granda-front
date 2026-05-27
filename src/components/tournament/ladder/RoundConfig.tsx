"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { LucideX } from "lucide-react";
import { ReusableButton } from "../../ui/ReusableButton";
import { InputBlock } from "../../ui/InputBlock";
import { Round } from "@/types/Round";
import { Motion } from "@/types/Motion";
import { createMotion, setRoundMotion } from "@/lib/utils";

type RoundConfigProps = {
  motion?: Motion;
  round: Round;
  tournamentId: string;
  onApplyAction: () => void;
  onClose: () => void;
};

export function RoundConfig({
  motion,
  tournamentId,
  round,
  onApplyAction: onApply,
  onClose,
}: RoundConfigProps) {
  const t = useTranslations("round_config");
  const [motionText, setMotionText] = useState(motion?.motion || "");
  const [infoslide, setInfoslide] = useState(motion?.adinfo || "");
  const [isApplying, setIsApplying] = useState(false);
  const [resultMessage, setResultMessage] = useState({
    message: "",
    error: false,
  });
  const name = round.name;

  const isApplyDisabled = motionText.trim().length === 0 || isApplying;

  const handleApply = async () => {
    if (isApplyDisabled) {
      return;
    }

    setIsApplying(true);

    try {
      const payload: Partial<Motion> = {
        motion: motionText.trim(),
        adinfo: infoslide.trim().length > 0 ? infoslide.trim() : undefined,
      };

      const createdMotion = await createMotion(tournamentId, round, payload);
      await setRoundMotion(round, createdMotion.id, tournamentId);

      setResultMessage({
        message: "Round config applied. Closing...",
        error: false,
      });

      setTimeout(() => {
        onApply();
        onClose();
      }, 800);
    } catch (error) {
      setResultMessage({
        message: `Error applying motion: ${error}`,
        error: true,
      });
      setIsApplying(false);
    }
  };

  return (
    <div className="relative mt-40 flex w-[574px] flex-col items-center gap-[36px] rounded-md bg-zinc-950 px-[10px] py-[32px] shadow-[0px_10px_9px_0px_rgba(0,0,0,0.25)] outline-2 outline-offset-[-2px] outline-neutral-600/80">
      <button
        type="button"
        aria-label="Close round configuration"
        onClick={onClose}
        className="absolute right-4 top-4 rounded border border-stone-700 bg-stone-700/40 p-1 text-stone-300 hover:border-stone-500 hover:bg-stone-600/40 hover:text-white focus:border-stone-500 focus:bg-stone-600/40"
      >
        <LucideX size={20} />
      </button>

      <div className="h-5 w-[574px] pb-[28px] text-center text-2xl font-semibold text-white opacity-75">
        {t("title", { name })}
      </div>

      <InputBlock
        title={t("motion_title")}
        description={t("motion_description")}
        value={motionText}
        onChange={setMotionText}
        placeholder={t("motion_placeholder")}
      />

      <InputBlock
        title={t("infoslide_title")}
        description={t("infoslide_description")}
        value={infoslide}
        onChange={setInfoslide}
      />

      <p className={resultMessage.error ? "text-red-400" : "text-green-400"}>
        {resultMessage.message || " "}
      </p>

      <ReusableButton
        text={t("apply")}
        defaultSize={true}
        disabled={isApplyDisabled}
        onClick={handleApply}
      />
    </div>
  );
}
