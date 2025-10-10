import { Link } from "@/i18n/navigation";
import { GenericButton, SharedButtonProps } from "./GenericButton";
import { PropsWithChildren } from "react";

type LinkButtonProps = {
  href: string;
} & SharedButtonProps;
export type { LinkButtonProps };

const LinkButton = (props: PropsWithChildren<LinkButtonProps>) => {
  return (
    <Link
      href={props.disabled ? "/" : props.href}
      tabIndex={props.disabled ? -1 : 0}
    >
      <GenericButton
        text={props.text}
        disableTabbing
        disabled={props.disabled}
        icon={props.icon}
        compactOnMobile={props.compactOnMobile}
        smol={props.smol}
        square={props.square}
      >
        {props.children}
      </GenericButton>
    </Link>
  );
};

export { LinkButton };
