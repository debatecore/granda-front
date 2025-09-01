import { iconprops } from "@/types/iconprops";
import { JSX, PropsWithChildren } from "react";

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
};
type GenericButtonProps = {
  disableTabbing?: boolean;
};
export type { SharedButtonProps };

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
        p-2 border-2 relative overflow-hidden
        ${!props.smol ? "px-12 w-full" : ""}
        ${!props.square ? "rounded-lg" : "rounded"}
        border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700
        disabled:opacity-50 disabled:cursor-not-allowed
        ${props.className}
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
