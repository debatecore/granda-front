import { Debate } from "@/types/Debate";
import { Link } from "@/i18n/navigation";

type LadderDebateNodeProps = {
  isFinals: boolean;
  debate: Debate;
  display_text: string;
};

const LadderDebateNode = ({ isFinals, debate, display_text }: LadderDebateNodeProps) => {
  const href = `/t/${debate.tournament_id}/debates/${debate.id}`;

  return (
    <Link 
      href={href}
      className={`
        flex items-center justify-center border-2 transition-all cursor-pointer
        bg-stone-900/80 text-white
        w-[180px] h-[100px] px-4
        
        ${isFinals 
          ? "rounded-full border-[#5E5CE6]" 
          : "rounded-2xl border-[#EF5DA8]"
        }
      `}
    >
      <div className="w-full overflow-hidden text-center text-[14px]">
        {display_text.length > 20
          ? `${display_text.substring(0, 18)}…`
          : display_text}
      </div>
    </Link>
  );
};

export { LadderDebateNode };