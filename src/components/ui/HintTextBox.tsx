interface HintTextBoxProps {
  title: string;
  content: string;
  pointerDirection?: "top" | "bottom" | "left" | "right";
  visible: boolean;
  onDismiss: () => void;
}

const HintTextBox = ({
  title,
  content,
  pointerDirection = "bottom",
  visible,
}: HintTextBoxProps) => {
  if (!visible) return null;

  const arrowPosition = {
    top: "after:top-full after:border-t-[10px] after:border-x-[12px] after:left-1/2 after:-ml-[12px] after:border-t-[#ffffff] mb-[8px]",
    bottom:
      "after:bottom-full after:border-b-[10px] after:border-x-[12px] after:left-1/2 after:-ml-[12px] after:border-b-[#ffffff] mt-[8px]",
    left: "after:left-full after:border-l-[10px] after:border-y-[12px] after:top-1/2 after:-mt-[12px] after:border-l-[#ffffff] mr-[8px]",
    right:
      "after:right-full after:border-r-[10px] after:border-y-[12px] after:top-1/2 after:-mt-[12px] after:border-r-[#ffffff] ml-[8px]",
  };

  return (
    <div
      className={`
        relative inline-block flex-wrap align-top text-justify bg-[#ffffff] leading-[16px] min-w-[330px] max-w-[3400px] py-[18px] px-[24px] rounded-lg
        
        after:content-[''] after:absolute after:w-0 after:h-0 after:border-transparent ${arrowPosition[pointerDirection]}`}
    >
      <div className="text-[#333] text-[16px] font-bold pb-[10px]">{title}</div>
      <div className="text-[#333] text-[12px]">{content}</div>
      <div className="text-[#333] text-[12px] underline pt-[6px] text-right hover:cursor-pointer">
        OK
      </div>
    </div>
  );
};

export { HintTextBox };
