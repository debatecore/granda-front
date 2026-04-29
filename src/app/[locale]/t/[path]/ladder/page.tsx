import { fetchServerside } from "@/lib/utils";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { Phase } from "@/types/Phase";
import { TournamentPlanningForm } from "@/components/tournament/TournamentPlanningForm";
import { TournamentLadderPlaceholder } from "@/components/tournament/TournamentLadderPlaceholder";

type LadderPageProps = {
  params: Promise<{
    locale: string;
    path: string;
  }>;
};

export default async function LadderPage({ params }: LadderPageProps) {
  const { path } = await params;
  const t = await getTranslations("ladder");

  let phases: Phase[] = [];
  let shouldShowPlanningForm = false;
  let shouldShowPlaceholder = false;
  let loadError = false;

  const res = await fetchServerside(`/tournaments/${path}/phases`, {
    cache: "no-store",
    headers: {
      Cookie: (await cookies()).toString(),
    },
  });

  if (res.ok) {
    phases = await res.json();
    shouldShowPlanningForm = phases.length === 0;
    shouldShowPlaceholder = phases.length > 0;
  } else if (res.status === 404) {
    shouldShowPlanningForm = true;
  } else {
    loadError = true;
  }

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mt-8 flex w-full max-w-5xl flex-col px-8 sm:mt-16 lg:px-16">
        <h1 className="text-center text-3xl font-semibold text-white sm:text-left">
          {t("title")}
        </h1>

        {loadError && (
          <p className="mt-4 text-sm text-red-400">{t("no_phases_error")}</p>
        )}

        {shouldShowPlanningForm && (
          <TournamentPlanningForm
            tournamentId={path}
            planningTitle={t("planning_title")}
            planningDescription={t("planning_description")}
            groupPhaseRoundsLabel={t("group_phase_rounds")}
            groupsCountLabel={t("groups_count")}
            advancingTeamsLabel={t("advancing_teams")}
            submitLabel={t("submit")}
            submittingLabel={t("submitting")}
            positiveIntegerError={t("validation_positive_integer")}
            powerOfTwoError={t("validation_power_of_two")}
            requestFailedError={t("request_failed")}
            successMessage={t("success")}
          />
        )}

        {shouldShowPlaceholder && (
          <TournamentLadderPlaceholder
            title={t("placeholder_title")}
            description={t("placeholder_description")}
          />
        )}
      </div>
    </div>
  );
}
