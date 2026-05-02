"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { ReusableButton } from "./ReusableButton";
import { InputBlock } from "./InputBlock";
import { Round } from "@/types/Round";
import { Motion } from "@/types/Motion";
import { createMotion } from "@/lib/utils";

type RoundConfigProps = {
  name: string;
  tournamentId: string;
  round: Round;
};

export function RoundConfig({ name, tournamentId, round }: RoundConfigProps) {
  const t = useTranslations("round_config");
  const [motion, setMotion] = useState("");
  const [infoslide, setInfoslide] = useState("");

  const isApplyDisabled = motion.trim().length === 0;

  const handleApply = async () => {
    if (isApplyDisabled) {
      return;
    }

    try {
      const payload: Motion = {
        motion: motion.trim(),
        adinfo: infoslide.trim().length > 0 ? infoslide.trim() : null,
      };

      await createMotion(tournamentId, round, payload);
    } catch (error) {
      console.error("Error applying motion:", error);
    }
  };

  return (
    <div className="flex h-[544px] w-[574px] flex-col items-center gap-[36px] rounded-md bg-zinc-950 px-[10px] py-[32px] shadow-[0px_10px_9px_0px_rgba(0,0,0,0.25)] outline outline-2 outline-offset-[-2px] outline-neutral-600/80">
      <div className="h-5 w-[574px] pb-[28px] text-center text-2xl font-semibold text-white opacity-75">
        {t("title", { name })}
      </div>

      <InputBlock
        title={t("motion_title")}
        description={t("motion_description")}
        value={motion}
        onChange={setMotion}
        placeholder={t("motion_placeholder")}
      />

      <InputBlock
        title={t("infoslide_title")}
        description={t("infoslide_description")}
        value={infoslide}
        onChange={setInfoslide}
      />

      <ReusableButton
        text={t("apply")}
        defaultSize={true}
        disabled={isApplyDisabled}
        onClick={handleApply}
      />
    </div>
  );
}
