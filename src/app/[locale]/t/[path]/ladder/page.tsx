import { fetchServerside } from "@/lib/utils";
import { cookies } from "next/headers";
import { Phase } from "@/types/Phase";
import { LadderView } from "@/components/tournament/LadderView";
import { Round } from "@/types/Round";
import { Debate } from "@/types/Debate";

type LadderPageProps = {
  params: Promise<{
    locale: string;
    path: string;
  }>;
};

export default async function LadderPage({ params }: LadderPageProps) {
  const { path } = await params;

  const ladderDataRes = await fetchServerside(`/tournament/${path}/ladder`, {
    cache: "no-store",
    headers: {
      Cookie: (await cookies()).toString(),
    },
  });

  let ladderData: {
    phases?: Phase[];
    rounds?: Round[];
    debates?: Debate[];
  } = {};
  if (ladderDataRes.ok) {
    ladderData = await ladderDataRes.json();
  }

  return (
    <LadderView
      phases={ladderData.phases}
      rounds={ladderData.rounds}
      debates={ladderData.debates}
      tournamentId={path}
    />
  );
}
