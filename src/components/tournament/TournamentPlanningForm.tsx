"use client";

import { useActionState } from "react";
import { planTournament } from "./ladder-actions";

type TournamentPlanningFormProps = {
  tournamentId: string;
  groupPhaseRoundsLabel: string;
  groupsCountLabel: string;
  advancingTeamsLabel: string;
  submitLabel: string;
  submittingLabel: string;
  planningTitle: string;
  planningDescription: string;
  positiveIntegerError: string;
  powerOfTwoError: string;
  requestFailedError: string;
  successMessage: string;
};

const initialState = {
  success: false,
  error: null as string | null,
};

export function TournamentPlanningForm({
  tournamentId,
  groupPhaseRoundsLabel,
  groupsCountLabel,
  advancingTeamsLabel,
  submitLabel,
  submittingLabel,
  planningTitle,
  planningDescription,
  positiveIntegerError,
  powerOfTwoError,
  requestFailedError,
  successMessage,
}: TournamentPlanningFormProps) {
  const boundPlanTournament = planTournament.bind(null, tournamentId);

  const [state, formAction, isPending] = useActionState(
    boundPlanTournament,
    initialState,
  );

  let errorMessage: string | null = null;

  if (state.error === "validation_positive_integer") {
    errorMessage = positiveIntegerError;
  } else if (state.error === "validation_power_of_two") {
    errorMessage = powerOfTwoError;
  } else if (state.error === "request_failed") {
    errorMessage = requestFailedError;
  }

  return (
    <div className="mt-8 w-full border-t border-b border-stone-700/70 px-8 py-12 sm:mt-16 sm:w-fit sm:py-16 lg:px-16">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6">
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <h2 className="text-2xl font-semibold text-white">{planningTitle}</h2>
          <p className="text-sm text-stone-400 sm:text-base">
            {planningDescription}
          </p>
        </div>

        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label
              htmlFor="group_phase_rounds"
              className="mb-1 text-sm text-stone-300"
            >
              {groupPhaseRoundsLabel}
            </label>
            <input
              id="group_phase_rounds"
              type="number"
              name="group_phase_rounds"
              min="1"
              step="1"
              required
              className="rounded-md bg-white/10 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="groups_count"
              className="mb-1 text-sm text-stone-300"
            >
              {groupsCountLabel}
            </label>
            <input
              id="groups_count"
              type="number"
              name="groups_count"
              min="1"
              step="1"
              required
              className="rounded-md bg-white/10 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="advancing_teams"
              className="mb-1 text-sm text-stone-300"
            >
              {advancingTeamsLabel}
            </label>
            <input
              id="advancing_teams"
              type="number"
              name="advancing_teams"
              min="1"
              step="1"
              required
              className="rounded-md bg-white/10 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>

          {errorMessage && (
            <p className="text-sm text-red-400">{errorMessage}</p>
          )}

          {state.success && (
            <p className="text-sm text-green-400">{successMessage}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 rounded-md bg-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/30 disabled:opacity-50"
          >
            {isPending ? submittingLabel : submitLabel}
          </button>
        </form>
      </div>
    </div>
  );
}
