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

  let phases: Phase[] | undefined;
  const res = await fetchServerside(`/tournaments/${path}/phases`, {
    cache: "no-store",
    headers: {
      Cookie: (await cookies()).toString(),
    },
  });

  if (res.ok) {
    phases = await res.json();
  }

  const rounds: Round[] = [];

  await Promise.all(
    phases?.map(async (phase) => {
      const res = await fetchServerside(
        `/tournaments/${path}/phases/${phase.id}/rounds`,
        {
          cache: "no-store",
          headers: {
            Cookie: (await cookies()).toString(),
          },
        },
      );
      if (res.ok) {
        rounds.push(...((await res.json()) as Round[]));
      }
      return [];
    }) ?? [],
  );

  const debates: Debate[] = [];
  const debateRes = await fetchServerside(`/tournaments/${path}/debates`, {
    cache: "no-store",
    headers: {
      Cookie: (await cookies()).toString(),
    },
  });

  if (debateRes.ok) {
    debates.push(...(await debateRes.json()));
  }

  return (
    <LadderView
      phases={phases}
      rounds={rounds}
      debates={debates}
      tournamentId={path}
    />
  );
}
