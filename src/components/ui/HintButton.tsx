"use client";

import { IconQuestion } from "../icons/QuestionIcon";
import { useEffect, useRef, useState } from "react";
import { HintTextBox } from "./HintTextBox";

interface HintButtonProps {
  title: string;
  content: string;
  boxPosition: "top" | "bottom" | "left" | "right";
}

const HintButton = ({ title, content, boxPosition }: HintButtonProps) => {
  const [showTutorial, setShowTutorial] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showTutorial &&
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowTutorial(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showTutorial]);

  const textBoxPlacement = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-[10px]",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-[10px]",
    left: "right-full top-1/2 -translate-y-1/2 mr-[10px]",
    right: "left-full top-1/2 -translate-y-1/2 ml-[10px]",
  };

  return (
    <div ref={wrapperRef} className="z-50 relative inline-block">
      <button
        className="flex items-center justify-center p-2 bg-transparent hover:cursor-pointer focus:outline-none"
        onClick={() => setShowTutorial(!showTutorial)}
        aria-label={`Hint: ${title}`}
      >
        <IconQuestion />
      </button>

      <div className={`absolute z-50 ${textBoxPlacement[boxPosition]}`}>
        <HintTextBox
          title={title}
          content={content}
          visible={showTutorial}
          boxPosition={boxPosition}
          onDismiss={() => setShowTutorial(false)}
        />
      </div>
    </div>
  );
};

export { HintButton };
