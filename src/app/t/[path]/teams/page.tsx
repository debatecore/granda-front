import { TeamsList } from "@/components/team/TeamsList";
import Link from "next/link";

export default async function TournamentTeamsPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  return (
    <>
      <div className="p-4 flex gap-6 items-center">
        <h1 className="text-2xl font-logo">{`Teams`}</h1>
        <div className="w-fit border p-2 border-stone-700/70 rounded">
          <Link href={`/t/${(await params).path}/teams/create`}>Add</Link>
        </div>
      </div>
      <TeamsList tournament_id={(await params).path} />
    </>
  );
}
