import { IconTutorial } from "@/components/icons/TutorialIcon";

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
  onDismiss,
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
        relative inline-block flex-wrap align-top text-justify bg-[#ffffff] leading-[16px] min-w-[340px] py-[18px] px-[24px] rounded-md
        
        after:content-[''] after:absolute after:w-0 after:h-0 after:border-transparent ${arrowPosition[pointerDirection]}`}
    >
      <div className="flex items-center justify-between select-none pb-[10px]">
        <span className="text-[#333] text-[16px] font-bold pt-[2px]">
          {title}
        </span>
        <IconTutorial moreClass="text-pink-500 w-[30px] h-[30px]" />{" "}
      </div>
      <div className="text-[#333] text-[12px] select-none">{content}</div>
      <div className=" pt-[6px] text-right">
        <span
          className="text-[#333] text-[12px] underline hover:cursor-pointer select-none pd-[2px]"
          onClick={onDismiss}
        >
          OK
        </span>
      </div>
    </div>
  );
};

export { HintTextBox };
