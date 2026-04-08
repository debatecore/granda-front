import { JSX } from "react";

type GenericComponentProps = {
  title: string;
  content: JSX.Element;
  placeholder?: boolean;
};

const GenericComponent = async (props: GenericComponentProps) => {
  return (
    <div>
      <div className="flex flex-row">
        <p
          className={`font-medium font-[Inter] pt-3 pb-3 ${props.placeholder ? "opacity-75" : ""}`}
        >
          {props.title}
        </p>
        <button>...</button>
      </div>
      <div>{props.content}</div>
    </div>
  );
};

export { GenericComponent };
