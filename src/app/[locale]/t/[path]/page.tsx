import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function TournamentRootPage({
  params,
}: {
  params: Promise<{ locale: string; path: string }>;
}) {
  const { locale, path } = await params;
  const t = await getTranslations("overview");

  let planExists = false; 
  try {
    const res = await fetch(`http://localhost:2023/tournaments/${path}/plan`, {
      cache: "no-store", 
    });
    if (res.ok) {
      planExists = true; 
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
            Welcome to {path}!
          </h1>
          <p className="text-stone-400 text-sm leading-relaxed">
            To get started, go to{" "}
            <Link 
              href={`/${locale}/t/${path}/ladder`} 
              className="text-amber-500 hover:text-amber-400 underline font-medium"
            >
              Tournament Ladder
            </Link>{" "}
            to define the structure of your tournament, which will be generated automatically.
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
