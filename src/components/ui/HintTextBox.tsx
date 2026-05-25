type HintTextBoxProps = {
  title: string;
  content: string;
  onClose: () => void;
};

const HintTextBox = (props: HintTextBoxProps) => {
  return (
    <div
      className="
        relative inline-block flex-wrap align-top text-justify bg-[#ffffff] leading-[18px] min-w-[280px] max-w-[320px] p-[20px] mb-[16px] rounded-lg overflow-wrap
        
        after:content-[''] after:absolute after:top-full after:left-1/2 after:-ml-[1em] after:w-0 after:h-0 after:border-t-[10px] after:border-x-[20px] after:-ml-[20px] after:border-transparent after:border-t-[#ffffff]"
    >
      <div className="text-[#333] text-[16px] font-bold pb-[10px]">
        {props.title}
      </div>
      <div className="text-[#333] text-[12px]">{props.content}</div>
      <div className="text-[#333] text-[12px] underline pt-[10px] text-right hover:cursor-pointer">
        {" "}
        OK{" "}
      </div>
    </div>
  );
};

export { HintTextBox };
