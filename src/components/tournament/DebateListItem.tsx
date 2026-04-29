import { Link } from "@/i18n/navigation";
import { Debate } from "@/types/Debate";
import { GenericListItem } from "./GenericListItem";

const DebateListItem = ({ debate }: { debate: Debate }) => {
  const debateId = debate.id ?? debate.round_id;

  return (
    <Link
      href={`/t/${debate.tournament_id}/debates/${debateId}`}
      className="w-full"
    >
      <GenericListItem>
        <div className="flex w-full flex-col gap-2">
          <h2 className="text-lg font-semibold text-white">
            Debate {debateId}
          </h2>

          <div className="flex flex-col gap-1 text-sm text-stone-400">
            <p>Round: {debate.round_id}</p>
            <p>Motion: {debate.motion_id}</p>
            <p>Marshal: {debate.marshal_user_id}</p>
          </div>
        </div>
      </GenericListItem>
    </Link>
  );
};

export { DebateListItem };
