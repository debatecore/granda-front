"use client";

{
  /* "Minimal round config design - https://www.figma.com/design/YpE2VaLgvXSeJi9NWV0gcw/Semester-Project-UI-UX?node-id=246-465&t=qBOHYsuG8F9PSNqD-0" */
}

import { ReusableButton } from "../ui/ReusableButton";
import { InputBlock } from "../ui/InputBlock";
import { useState } from "react";
import { Round } from "@/types/Round";
import { Motion } from "@/types/Motion";
import { createMotion } from "@/lib/utils";

type RoundConfigProps = {
  name: string;
  tournamentId: string;
  round: Round;
};

export function RoundConfig({ name, tournamentId, round }: RoundConfigProps) {
  const [motion, setMotion] = useState("");
  const [infoslide, setInfoslide] = useState("");

  {
    /* this runs when Apply is clicked */
  }
  const handleApply = async () => {
    try {
      const payload: Motion = {
        motion,
        adinfo: infoslide || null,
      };

      await createMotion(tournamentId, round, payload);
    } catch (error) {
      console.error("Error applying motion:", error);
    }
  };

  return (
    <div className="flex flex-col items-center w-[574px] h-[544px] bg-zinc-950 rounded-md shadow-[0px_10px_9px_0px_rgba(0,0,0,0.25)] outline outline-2 outline-offset-[-2px] outline-neutral-600/80 gap-[36px] px-[10px] py-[32px]">
      <div className="w-[574px] h-5 opacity-75 text-center justify-start text-white text-2xl font-semibold pb-[28px]">
        Round {name} configuration{" "}
        {/* I guess this should not be hardcoded but the translation thing */}
      </div>

      <InputBlock
        title="Motion"
        description="What should this round's topic be?"
        value={motion}
        onChange={setMotion}
        placeholder="(Required)"
      />

      <InputBlock
        title="Infoslide"
        description="Any additional information regarding the motion?"
        value={infoslide}
        onChange={setInfoslide}
      />

      <ReusableButton text="Apply" defaultSize={true} onClick={handleApply} />
    </div>
  );
}
