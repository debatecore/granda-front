"use client";

import { IconQuestion } from "../icons/QuestionIcon";
import { useState } from "react";
import { HintTextBox } from "./HintTextBox";

interface HintButtonProps {
  title: string;
  content: string;
  pointerDirection: "top" | "bottom" | "left" | "right";
}

const HintButton = ({ title, content, pointerDirection }: HintButtonProps) => {
  const [showTutorial, setShowTutorial] = useState(false);

  const textBoxPlacement = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-[10px]",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-[10px]",
    left: "right-full top-1/2 -translate-y-1/2 mr-[10px]",
    right: "left-full top-1/2 -translate-y-1/2 ml-[10px]",
  };
  return (
    <div className="z-50 relative inline-block">
      <button
        className="flex items-center justify-center p-[8px] bg-transparent hover:cursor-pointer focus:outline-none"
        onClick={() => setShowTutorial(!showTutorial)}
      >
        <IconQuestion />
      </button>

      <div className={`absolute z-50 ${textBoxPlacement[pointerDirection]}`}>
        <HintTextBox
          title={title}
          content={content}
          visible={showTutorial}
          pointerDirection={pointerDirection}
          onDismiss={() => setShowTutorial(false)}
        />
      </div>
    </div>
  );
};

export { HintButton };
