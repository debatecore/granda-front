import { Dashboard } from "@/components/tournament/dashboard/Dashboard";
import { DashHeader } from "@/components/tournament/dashboard/DashHeader";
import { DashSide } from "@/components/tournament/dashboard/DashSide";
import { TournamentDoesntExist } from "@/components/tournament/Tournament404";
import { Option, Some, None } from "@/lib/option";
import { fetchServerside } from "@/lib/utils";
import { Tournament } from "@/types/Tournament";
import { User } from "@/types/User";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function TournamentRootPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;
  let data_authme: Option<User> = new None();
  let data_tournament: Option<Tournament> = new None();
  const res_authme = await fetchServerside("/auth/me", {
    headers: {
      Cookie: (await cookies()).toString(),
    },
  });
  const res_tournament = await fetchServerside(`/tournament/${path}`, {
    headers: {
      Cookie: (await cookies()).toString(),
    },
  });

  if (res_authme.ok) {
    data_authme = new Some(await res_authme.json());
    if (res_tournament.ok) {
      data_tournament = new Some(await res_tournament.json());
    }
  } else {
    redirect("/login");
  }

  if (data_authme instanceof Some && data_tournament instanceof Some) {
    return (
      <>
        <Dashboard
          sidebar={
            <DashSide tournament_path={path} path_highlight="Overview" />
          }
          header={
            <DashHeader t={data_tournament.value} u={data_authme.value} />
          }
        >
          <div className="p-4">
            <h1 className="text-2xl font-logo mb-6">
              {`${data_tournament.value.full_name} - Overview`}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded border border-stone-700 h-64 bg-stone-700/25 flex flex-col gap-4 p-4">
                <p className="font-logo">Fictional content!</p>
                <div className="animate-pulse w-full h-full bg-stone-500/25 rounded"></div>
              </div>
              <div className="rounded border border-stone-700 h-64 bg-stone-700/25 flex flex-col gap-4 p-4">
                <p className="font-logo">Fictitious content!</p>
                <div className="animate-pulse w-full h-full bg-stone-500/25 rounded"></div>
              </div>
              <div className="rounded border border-stone-700 h-64 bg-stone-700/25 flex flex-col gap-4 p-4">
                <p className="font-logo">Made-up content!</p>
                <div className="animate-pulse w-full h-full bg-stone-500/25 rounded"></div>
              </div>
              <div className="rounded border border-stone-700 h-64 bg-stone-700/25 flex flex-col gap-4 p-4">
                <p className="font-logo">Filler content!</p>
                <div className="animate-pulse w-full h-full bg-stone-500/25 rounded"></div>
              </div>
              <div className="rounded border border-stone-700 h-64 bg-stone-700/25 flex flex-col gap-4 p-4">
                <p className="font-logo">Nonexistent content!</p>
                <div className="animate-pulse w-full h-full bg-stone-500/25 rounded"></div>
              </div>
              <div className="rounded border border-stone-700 h-64 bg-stone-700/25 flex flex-col gap-4 p-4">
                <p className="font-logo">Visual-only content!</p>
                <div className="animate-pulse w-full h-full bg-stone-500/25 rounded"></div>
              </div>
              <div className="rounded border border-stone-700 h-64 bg-stone-700/25 flex flex-col gap-4 p-4">
                <p className="font-logo">Overflowing content!</p>
                <div className="animate-pulse w-full h-full bg-stone-500/25 rounded"></div>
              </div>
              <div className="rounded border border-stone-700 h-64 bg-stone-700/25 flex flex-col gap-4 p-4">
                <p className="font-logo">Scrollable content!</p>
                <div className="animate-pulse w-full h-full bg-stone-500/25 rounded"></div>
              </div>
            </div>
          </div>
        </Dashboard>
      </>
    );
  } else {
    return <TournamentDoesntExist />;
  }
}
