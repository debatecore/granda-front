"use client";

import { useActionState, useEffect } from "react";
import { planTournament } from "./ladder-actions";
import { useTranslations } from "next-intl";

type TournamentPlanningFormProps = {
  tournamentId: string;
  onPlanned: () => void;
};

const initialState = {
  success: false,
  error: null as string | null,
};

export function TournamentPlanningForm({
  tournamentId,
  onPlanned,
}: TournamentPlanningFormProps) {
  const boundPlanTournament = planTournament.bind(onPlanned, tournamentId);

  const t = useTranslations("ladder");

  const [state, formAction, isPending] = useActionState(
    boundPlanTournament,
    initialState,
  );

  let errorMessage: string | null = null;
  if (state.error) {
    errorMessage = t(state.error as string);
  }

  useEffect(() => {
    if (state.success) {
      onPlanned();
    }
  }, [state.success, onPlanned]);

  return (
    <div className="mt-8 w-full border-t border-b border-stone-700/70 px-8 py-12 sm:mt-16 sm:w-fit sm:py-16 lg:px-16">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6">
        <div className="flex flex-col gap-2 text-center sm:text-left items-center">
          <p className="text-sm text-stone-400 sm:text-base">
            {t("planning_description")}
          </p>
        </div>

        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label
              htmlFor="group_phase_rounds"
              className="mb-1 text-sm text-stone-300"
            >
              {t("group_phase_rounds")}
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
              {t("groups_count")}
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
              {t("total_teams")}
            </label>
            <input
              id="total_teams"
              type="number"
              name="total_teams"
              min="2"
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
              {t("advancing_teams")}
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
            <p className="text-sm text-green-400">{t("success")}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 rounded-md bg-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/30 disabled:opacity-50"
          >
            {isPending ? t("submitting") : t("submit")}
          </button>
        </form>
      </div>
    </div>
  );
}
