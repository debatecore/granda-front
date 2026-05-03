import VerdictPanel from "@/components/VerdictPanel";

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
      <h1 className="text-2xl font-semibold mb-4">Verdict Panel</h1>
      <div className="w-full max-w-3xl">
        <VerdictPanel
          userId="ffffffff-ffff-ffff-ffff-ffffffffffff"
          tournamentId="019da9ec-09ed-75b0-b437-803201f5453f"
          debateId="019dc02f-cc43-74b1-a093-fc281bf009db"
        />
      </div>
    </div>
  );
}
// </p>
//   <VerdictPanel
//   userId="ffffffff-ffff-ffff-ffff-ffffffffffff"
//   tournamentId="019da9ec-09ed-75b0-b437-803201f5453f"
//   debateId="019dc02f-cc43-74b1-a093-fc281bf009db"
// />
