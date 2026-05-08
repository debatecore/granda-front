import { fetchServerside } from "@/lib/utils";
import { cookies } from "next/headers";
import { MarshalPanel } from "@/components/tournament/MarshalPanel";
import { User } from "@/types/User";

type DebateDetailsPageProps = {
  params: Promise<{
    locale: string;
    path: string;
    debate_id: string;
  }>;
};

export default async function DebateDetailsPage({
  params,
}: DebateDetailsPageProps) {
  const { path, debate_id } = await params;

  const cookieHeader = (await cookies()).toString();

  let roles: string[] = [];
  let loadError = false;

  const authRes = await fetchServerside("/auth/me", {
    cache: "no-store",
    headers: {
      Cookie: cookieHeader,
    },
  });

  if (!authRes.ok) {
    loadError = true;
  } else {
    const currentUser: User = await authRes.json();

    const rolesRes = await fetchServerside(
      `/users/${currentUser.id}/tournaments/${path}/roles`,
      {
        cache: "no-store",
        headers: {
          Cookie: cookieHeader,
        },
      },
    );

    if (rolesRes.ok) {
      roles = await rolesRes.json();
    } else {
      loadError = true;
    }
  }

  if (loadError) {
    return (
      <div className="flex w-full flex-col items-center">
        <div className="mt-8 flex w-full max-w-5xl flex-col px-8 sm:mt-16 lg:px-16">
          <h1 className="text-center text-3xl font-semibold text-white sm:text-left">
            Debate details
          </h1>
          <p className="mt-4 text-sm text-red-400">
            Failed to load debate details.
          </p>
        </div>
      </div>
    );
  }

  const canConductDebate =
    roles.includes("Marshal") || roles.includes("Organizer");

  const motion = "Untitled motion";

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mt-8 flex w-full max-w-5xl flex-col px-8 sm:mt-16 lg:px-16">
        <h1 className="text-center text-3xl font-semibold text-white sm:text-left">
          Debate details
        </h1>

        <div className="mt-8 w-full border-t border-b border-stone-700/70 px-8 py-12 sm:mt-16 sm:py-16 lg:px-16">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold text-white">{motion}</h2>
            <p className="text-sm text-stone-400">Debate ID: {debate_id}</p>
          </div>
        </div>

        {canConductDebate && <MarshalPanel motion={motion} />}
      </div>
    </div>
  );
}
