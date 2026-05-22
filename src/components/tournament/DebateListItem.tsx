import { Link } from "@/i18n/navigation";
import { Debate } from "@/types/Debate";
import { GenericListItem } from "./GenericListItem";

const DebateListItem = ({ debate }: { debate: Debate }) => {
  const debateId = debate.id ?? debate.round_id;

  const motion = debate.motion_id || `Debate ${debateId}`;
  const displayTitle =
    motion.length > 60 ? `${motion.substring(0, 57)}...` : motion;

  return (
    <Link
      href={`/t/${debate.tournament_id}/debates/${debateId}`}
      className="w-full"
    >
      <GenericListItem title={displayTitle}>
        <span>Round: {debate.round_id}</span>
      </GenericListItem>
    </Link>
  );
};

export { DebateListItem };
