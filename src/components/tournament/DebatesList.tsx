import { GenericList } from "./GenericList";
import { DebateListItem } from "./DebateListItem";
import { loadDebates } from "./debates-loader";

const DebatesList = async ({ tournamentId }: { tournamentId: string }) => {
  const { debates, loadError } = await loadDebates(tournamentId);

  if (loadError) {
    return <p className="text-sm text-red-400">Failed to load debates.</p>;
  }

  if (debates.length === 0) {
    return <p className="text-stone-400">No debates found.</p>;
  }

  return (
    <GenericList>
      {debates.map((debate) => {
        const key = debate.id ?? debate.round_id;
        return <DebateListItem key={key} debate={debate} />;
      })}
    </GenericList>
  );
};

export { DebatesList };
