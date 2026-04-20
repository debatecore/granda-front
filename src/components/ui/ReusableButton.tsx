import { iconprops } from "@/types/iconprops";
import { JSX, PropsWithChildren } from "react";

const buttonColors = ["default", "error", "success"] as const;
export { buttonColors };

export type ButtonColor = (typeof buttonColors)[number];

type SharedButtonProps = {
  text?: string; // text on button
  disabled?: boolean; // is button disabled
  //compactOnMobile?: boolean; i dont know
  icon?: (props: iconprops) => JSX.Element;
  defaultSize?: boolean; // w270 h54 from figma design
  //square?: boolean;
  onClick?: () => void;
  className?: string;
  hidden?: boolean; // i dont get the difference between hidden and disabled
  color?: ButtonColor;
};

type ReusableButtonProps = {
  disableTabbing?: boolean;
};

export type { SharedButtonProps };

const setColor = (color: ButtonColor) => {
  switch (color) {
    case "default":
      return "bg-[#2c2c2c] border-[#979797]/80 hover:bg-[#272727] hover:border-[#979797]/60";
    case "error":
      return "bg-red-900/45 border-red-900 hover:border-red-700 focus:border-red-700"; // to be changed
    case "success":
      return "bg-green-700/45 border-green-900 hover:border-green-700 focus:border-green-700"; // to be changed
  }
};

const ReusableButton = (
  props: PropsWithChildren<SharedButtonProps & ReusableButtonProps>,
) => {
  if (props.hidden) return null;

  return (
    <button
      disabled={props.disabled}
      tabIndex={props.disableTabbing ? -1 : 0}
      onClick={props.onClick}
      className={`
        relative w-[270px] h-[54px] overflow-hidden cursor-pointer text-center bg-[#979797]/20 rounded border-[0.50px] border-offset-[-0.50px] border-neutral-600/80 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed gap-3.5
        ${props.defaultSize ? "w-[270px] h-[40px]" : "w-auto px-4 text-xs"} 
        
        ${setColor(props.color || "default")}
        ${props.className || ""}
      `}
    >
      <div className="opacity-75 text-center justify-center text-white/75 text-l font-medium">
        {props.children}
        {props.text && <span>{props.text}</span>}
      </div>

      {props.icon &&
        props.icon({
          moreClass:
            "absolute -bottom-1 -right-1 scale-[1.75] rotate-[-15deg] opacity-[.15] text-white z-10 pointer-events-none",
        })}
    </button>
  );
};

export { ReusableButton };
