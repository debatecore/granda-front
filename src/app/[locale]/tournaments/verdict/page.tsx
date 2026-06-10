import VerdictPanel from "@/components/tournament/VerdictPanel";

interface VerdictPageProps {
  params: { locale: string };
  searchParams: {
    userId?: string;
    tournamentId?: string;
    debateId?: string;
  };
}

export default async function VerdictPage({ searchParams }: VerdictPageProps) {
  const resolvedParams = await searchParams;
  const userId = resolvedParams.userId ?? "example-user";
  const tournamentId = resolvedParams.tournamentId ?? "example-tournament";
  const debateId = resolvedParams.debateId ?? "example-debate";

  return (
    <div className="flex flex-col w-full items-center p-6">
      <div className="w-full max-w-3xl">
        <VerdictPanel
          userId={userId}
          tournamentId={tournamentId}
          debateId={debateId}
        />
      </div>
    </div>
  );
}
