import { TournamentDoesntExist } from "@/components/tournament/Tournament404";
import { Option, Some, None } from "@/lib/option";
import { fetchServerside } from "@/lib/utils";
import { Tournament } from "@/types/Tournament";
import { User } from "@/types/User";
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

  if (data_tournament instanceof Some) {
    return (
      <>
        <p>{"Tournament loaded!"}</p>
      </>
    );
  } else {
    return <TournamentDoesntExist />;
  }
}
