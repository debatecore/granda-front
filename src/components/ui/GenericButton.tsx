import { iconprops } from "@/types/iconprops";
import { JSX, PropsWithChildren } from "react";

const buttonColors = ["default", "error", "success"] as const;
export { buttonColors };

export type ButtonColor = (typeof buttonColors)[number];

type SharedButtonProps = {
  text?: string;
  disabled?: boolean;
  compactOnMobile?: boolean;
  icon?: (props: iconprops) => JSX.Element;
  smol?: boolean;
  square?: boolean;
  onClick?: () => void;
  className?: string;
  hidden?: boolean;
  color?: ButtonColor;
};
type GenericButtonProps = {
  disableTabbing?: boolean;
};
export type { SharedButtonProps };

const setColor = (color: ButtonColor) => {
  switch (color) {
    case "default":
      return "bg-stone-700/45 border-stone-700 hover:border-stone-500 focus:border-stone-500";
    case "error":
      return "bg-red-900/45 border-red-900 hover:border-red-700 focus:border-red-700";
    case "success":
      return "bg-green-700/45 border-green-900 hover:border-green-700 focus:border-green-700";
  }
};

const GenericButton = (
  props: PropsWithChildren<SharedButtonProps & GenericButtonProps>
) => {
  return (
    <button
      disabled={props.disabled}
      tabIndex={props.disableTabbing ? -1 : 0}
      className={
        props.hidden
          ? "hidden"
          : `
        cursor-pointer p-1 text-center block w-full rounded px-2 border
        ${!props.smol ? "px-12 w-full" : ""}
        ${!props.square ? "rounded-lg" : "rounded"}
        disabled:opacity-50 disabled:cursor-not-allowed
        ${props.className}
        ${setColor(props.color || "default")}
      `
      }
      onClick={props.onClick}
    >
      <div className="z-20">{props.children}</div>
      {props.text && <span className="z-20">{props.text}</span>}
      {props.icon &&
        props.icon({
          moreClass:
            "absolute bottom-1 right-0 scale-[1.75] rotate-[-15deg] opacity-[.15] text-white z-10",
        })}
    </button>
  );
};

export { GenericButton };
