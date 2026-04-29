import { Debate } from "@/types/Debate";
import { Link } from "@/i18n/navigation";

type LadderDebateNodeProps = {
  isFinals: boolean;
  debate: Debate;
  display_text: string;
};

const LadderDebateNode = ({ isFinals, debate, display_text }: LadderDebateNodeProps) => {
  const href = `/t/${debate.tournament_id}/debates/${debate.id}`;
  const ELLIPSIS = "…";

  let renderedContent;

  if (isFinals) {
    const teams = display_text.split(/\s+vs\s+/i);
    renderedContent = (
      <div className="flex flex-col items-center leading-tight font-normal text-[14px]">
        <div className="truncate w-full text-center">{teams[0]}</div>
        <div className="text-[12px] text-center my-1 uppercase">vs</div>
        <div className="truncate w-full text-center">{teams[1]}</div>
      </div>
    );
  } else {
    // 【Group Phase】
    const items = display_text.split(/:\s*/);
    const header = items[0] + ":";
    const teamsPart = items[1] || "";
    const teams = teamsPart.split(/,\s*/);
    
    const displayedTeams = teams.length > 2 
      ? `${teams[0]}, ${teams[1]}, ${teams[2]}${ELLIPSIS}` 
      : teams.join(", ");

    renderedContent = (
      <div className="flex flex-col items-center text-center leading-tight">
        <div className="text-[14px] font-bold mb-1">{header}</div>
        <div className="text-[14px] font-normal">{displayedTeams}</div>
      </div>
    );
  }

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
      <div className="w-full overflow-hidden">
        {renderedContent}
      </div>
    </Link>
  );
};

export { LadderDebateNode };