import { LanguageCode } from "@/types/Language";
import "../../../node_modules/flag-icons/css/flag-icons.min.css";

type FlagIconProps = {
  language: LanguageCode;
};

const FlagIcon = (props: FlagIconProps) => {
  let flagCode = "";
  switch (props.language) {
    case "en": {
      flagCode = "gb";
      break;
    }
    default: {
      flagCode = props.language;
    }
  }
  return <span className={`h-[12px] scale-x-[1.15] fi fi-${flagCode}`}></span>;
};

export { FlagIcon };
