import { Dashboard } from "@/components/tournament/dashboard/Dashboard";
import { DashHeader } from "@/components/tournament/dashboard/DashHeader";
import { DashSide } from "@/components/tournament/dashboard/DashSide";
import { TournamentDoesntExist } from "@/components/tournament/Tournament404";
import { Option, Some, None } from "@/lib/option";
import { fetchServerside } from "@/lib/utils";
import { Tournament } from "@/types/Tournament";
import { User } from "@/types/User";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function TournamentLayout({
  params,
  children,
}: {
  children: ReactNode;
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
          sidebar={<DashSide tournament_path={path} />}
          header={
            <DashHeader t={data_tournament.value} u={data_authme.value} />
          }
        >
          {children}
        </Dashboard>
      </>
    );
  } else {
    return <TournamentDoesntExist />;
  }
}
