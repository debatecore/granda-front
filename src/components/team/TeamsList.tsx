import { fetchServerside } from "@/lib/utils";
import { Team } from "@/types/Team";
import { cookies } from "next/headers";
import { GenericListItem } from "../GenericListItem";

const TeamsList = async ({ tournament_id }: { tournament_id: string }) => {
  let data_team: Team[] = [];
  const response = await fetchServerside(`/tournament/${tournament_id}/team`, {
    headers: {
      Cookie: (await cookies()).toString(),
    },
  });
  if (response.ok) {
    data_team = await response.json();
  }

  return (
    <div className="px-8 py-12 sm:py-16 lg:px-16 border-t border-b border-stone-700/70 overflow-y-scroll">
      {data_team.length !== 0 ? (
        <div className="flex flex-col gap-4 items-center">
          {data_team.map((team, i) => {
            return <TeamListItem key={team.id} team={team} indexForImage={i} />;
          })}
        </div>
      ) : (
        <>
          <p className="text-stone-500">
            {"There are currently no teams in the tournament."}
          </p>
        </>
      )}
    </div>
  );
};

const TeamListItem = ({
  team: team,
}: {
  team: Team;
  indexForImage: number;
}) => {
  return (
    <GenericListItem
      title={team.full_name}
      subtitle={team.shortened_name}
      href={`/t/${team.tournament_id}/team/${team.id}`}
    />
  );
};

export { TeamsList };
