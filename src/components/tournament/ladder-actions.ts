"use server";

import { fetchServerside } from "@/lib/utils";
import { cookies } from "next/headers";

type PlanTournamentState = {
  success: boolean;
  error: string | null;
};

function isPositiveInteger(value: number) {
  return Number.isInteger(value) && value > 0;
}

function isPowerOfTwo(value: number) {
  return value > 0 && (value & (value - 1)) === 0;
}

export async function planTournament(
  tournamentId: string,
  _prevState: PlanTournamentState,
  formData: FormData
): Promise<PlanTournamentState> {
  const groupPhaseRounds = Number(formData.get("group_phase_rounds"));
  const groupsCount = Number(formData.get("groups_count"));
  const advancingTeams = Number(formData.get("advancing_teams"));

  if (
    !isPositiveInteger(groupPhaseRounds) ||
    !isPositiveInteger(groupsCount) ||
    !isPositiveInteger(advancingTeams)
  ) {
    return {
      success: false,
      error: "validation_positive_integer",
    };
  }

  if (!isPowerOfTwo(advancingTeams)) {
    return {
      success: false,
      error: "validation_power_of_two",
    };
  }

  const res = await fetchServerside(`/tournament/${tournamentId}/plan`, {
    method: "POST",
    headers: {
      Cookie: (await cookies()).toString(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      group_phase_rounds: groupPhaseRounds,
      groups_count: groupsCount,
      advancing_teams: advancingTeams,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Plan tournament failed");
    console.error("Status:", res.status);
    console.error("Response:", errorText);

    return {
      success: false,
      error: "request_failed",
    };
  }

  return {
    success: true,
    error: null,
  };
}