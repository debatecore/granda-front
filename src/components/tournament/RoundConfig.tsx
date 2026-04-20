"use client";

import { ReusableButton } from "../ui/ReusableButton";
import { GenericInput } from "../ui/GenericInput";
import { useState } from "react";

type InputBlockProps = {
  title: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

function InputBlock({
  title,
  description,
  value,
  onChange,
  placeholder,
}: InputBlockProps) {
  return (
    <div className="flex flex-col items-stretch w-[494px] h-[140px] bg-neutral-900 rounded border-[0.5px] outline-neutral-600/80 px-[10px] py-[12px] gap-2">
      <div className="flex flex-col items-end w-full">
        <div className="text-stone-300 text-xl font-medium leading-tight opacity-75">
          {title}
        </div>
        <div className="text-neutral-500 text-xs font-medium opacity-75 py-[2px]">
          {description}
        </div>
      </div>

      <GenericInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}

type RoundConfigProps = {
  name: string;
};

export function RoundConfig({ name }: RoundConfigProps) {
  const [motion, setMotion] = useState("");
  const [infoslide, setInfoslide] = useState("");

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-950">
      <div className="flex flex-col items-center w-[574px] h-[544px] bg-zinc-950 rounded-md shadow-[0px_10px_9px_0px_rgba(0,0,0,0.25)] outline outline-2 outline-offset-[-2px] outline-neutral-600/80 gap-[36px] px-[10px] py-[32px]">
        <div className="w-[574px] h-5 opacity-75 text-center justify-start text-white text-2xl font-semibold pb-[28px]">
          Round {name} configuration
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
          description="Any additional information regarding the motion?" // TODO: dont hardcode, include the translation thing
          value={infoslide}
          onChange={setInfoslide}
        />

        <ReusableButton text="Apply" defaultSize={true} />
      </div>
    </div>
  );
}
