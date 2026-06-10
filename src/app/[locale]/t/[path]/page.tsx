import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { fetchServerside } from "@/lib/utils"; 
import { cookies } from "next/headers";

export default async function TournamentRootPage({
  params,
}: {
  params: Promise<{ locale: string; path: string }>;
}) {
  const { locale, path } = await params;
  const t = await getTranslations("overview");

  let planExists = false; 
  let tournamentName = path;

  try {
    const tournamentRes = await fetchServerside(`/tournaments/${path}`, {
      cache: "no-store",
      headers: {
        Cookie: (await cookies()).toString(),
      },
    });

    if (tournamentRes.ok) {
      const tournamentData = await tournamentRes.json();
      tournamentName = tournamentData.full_name || path;
    }

    const ladderRes = await fetchServerside(`/tournaments/${path}/ladder`, {
      cache: "no-store",
      headers: {
        Cookie: (await cookies()).toString(),
      },
    });

    if (ladderRes.ok) {
      const ladderData = await ladderRes.json();
      if (ladderData.phases && ladderData.phases.length > 0) {
        planExists = true; 
      }
    }
  } catch (error) {
    console.error("Failed to fetch tournament plan:", error);
    planExists = false; 
  }

  if (!planExists) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] p-4">
        <div className="max-w-md w-full rounded border border-stone-700 bg-stone-800/50 p-8 text-center flex flex-col gap-4 shadow-xl">
          <h1 className="text-2xl font-logo text-stone-100">
            {t("welcome", { tournamentName })}
          </h1>
          <p className="text-stone-400 text-sm leading-relaxed">
            {t("get_started_1")}{" "}
            <Link 
              href={`/${locale}/t/${path}/ladder`} 
              className="text-stone-100 hover:text-stone-300 underline font-medium"
            >
              Tournament Ladder
            </Link>{" "}
            {t("get_started_2")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-logo mb-6">{t("title")}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="rounded border border-stone-700 h-64 bg-stone-700/25 flex flex-col gap-4 p-4">
            <p className="font-logo">Team leaderboard (to be implemented)</p>
            <p className="text-sm text-stone-400">The leaderboard will be presented here.</p>
          </div>
          
          <div className="rounded border border-stone-700 h-64 bg-stone-700/25 flex flex-col gap-4 p-4">
            <p className="font-logo">Upcoming debates (to be implemented)</p>
            <p className="text-sm text-stone-400">Information about debates starting soon will be presented here.</p>
          </div>
          
          <div className="rounded border border-stone-700 h-64 bg-stone-700/25 flex flex-col gap-4 p-4">
            <p className="font-logo">Event log (to be implemented)</p>
            <p className="text-sm text-stone-400">Most recent actions performed by the app users will be reported here.</p>
          </div>
          
          <div className="rounded border border-stone-700 h-64 bg-stone-700/25 flex flex-col gap-4 p-4">
            <p className="font-logo">Tournament rules (to be implemented)</p>
            <p className="text-sm text-stone-400">Rules of the tournament will be presented here.</p>
          </div>

        </div>
      </div>
    </>
  );
}
