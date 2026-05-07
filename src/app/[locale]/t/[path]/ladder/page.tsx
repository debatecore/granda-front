import { fetchServerside } from "@/lib/utils";
import { cookies } from "next/headers";
import { Phase } from "@/types/Phase";
import { LadderView } from "@/components/tournament/ladder/LadderView";
import { Round } from "@/types/Round";
import { Debate } from "@/types/Debate";
import { Motion } from "@/types/Motion";

type LadderPageProps = {
  params: Promise<{
    locale: string;
    path: string;
  }>;
};

const sortPhases = (phases: Phase[]) => {
  const sorted = [];
  let nextPhase = phases.find((phase) => phase.previous_phase_id == undefined);
  while (nextPhase) {
    sorted.push(nextPhase);
    nextPhase = phases.find(
      (phase) => phase.previous_phase_id === nextPhase?.id,
    );
  }
  return sorted;
};

const sortRounds = (rounds: Round[], phases: Phase[]) => {
  const sorted: Round[] = [];
  sortPhases(phases).forEach((phase) => {
    const phaseRounds = rounds.filter((round) => {
      return round.phase_id == phase.id;
    });
    let nextRound = phaseRounds.find(
      (round) => round.previous_round_id == undefined,
    );
    while (nextRound) {
      sorted.push(nextRound);
      nextRound = rounds.find(
        (round) => round.previous_round_id === nextRound?.id,
      );
    }
  });
  return sorted;
};

export default async function LadderPage({ params }: LadderPageProps) {
  const { path } = await params;

  const ladderDataRes = await fetchServerside(`/tournaments/${path}/ladder`, {
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

  let motions: Motion[] = [];

  const motionsRes = await fetchServerside(`/tournaments/${path}/motions`, {
    cache: "no-store",
    headers: {
      Cookie: (await cookies()).toString(),
    },
  });

  console.log(motionsRes);
  if (motionsRes.ok) {
    motions = await motionsRes.json();
  }

  return (
    <LadderView
      phases={ladderData.phases}
      rounds={sortRounds(ladderData.rounds || [], ladderData.phases || [])}
      debates={ladderData.debates}
      tournamentId={path}
      motions={motions}
    />
  );
}
