"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { ReusableButton } from "./ReusableButton";
import { InputBlock } from "./InputBlock";
import { Round } from "@/types/Round";
import { Motion } from "@/types/Motion";
import { createMotion, setRoundMotion } from "@/lib/utils";

type RoundConfigProps = {
  motion?: Motion;
  round: Round;
  tournamentId: string;
  onApplyAction: () => void;
};

export function RoundConfig({
  motion,
  tournamentId,
  round,
  onApplyAction: onApply,
}: RoundConfigProps) {
  const t = useTranslations("round_config");
  const [motionText, setMotionText] = useState(motion?.motion || "");
  const [infoslide, setInfoslide] = useState("");
  const [resultMessage, setResultMessage] = useState({
    message: "",
    error: false,
  });
  const name = round.name;

  const isApplyDisabled = motionText.trim().length === 0;

  const handleApply = async () => {
    if (isApplyDisabled) {
      return;
    }

    try {
      const payload: Partial<Motion> = {
        motion: motionText.trim(),
        adinfo: infoslide.trim().length > 0 ? infoslide.trim() : undefined,
      };

      const createdMotion = await createMotion(tournamentId, round, payload);
      await setRoundMotion(round, createdMotion.id, tournamentId);
      setResultMessage({ message: "Round config applied", error: false });
    } catch (error) {
      setResultMessage({
        message: `Error applying motion: ${error}`,
        error: true,
      });
    }

    onApply();
  };

  return (
    <div className="mt-40 flex w-[574px] flex-col items-center gap-[36px] rounded-md bg-zinc-950 px-[10px] py-[32px] shadow-[0px_10px_9px_0px_rgba(0,0,0,0.25)] outline-2 outline-offset-[-2px] outline-neutral-600/80">
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
