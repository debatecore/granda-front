import { fetchServerside } from "@/lib/utils";
import { cookies } from "next/headers";
import { MarshalPanel } from "@/components/tournament/MarshalPanel";
import { User } from "@/types/User";
import { GenericComponent } from "@/components/ui/GenericComponent";

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
  let data_debate = null;

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

  const res = await fetchServerside(
    `/tournaments/${path}/debates/${debate_id}`,
    {
      cache: "no-store",
      headers: {
        Cookie: cookieHeader,
      },
    },
  );

  if (!res.ok) {
    loadError = true;
  } else {
    const json = await res.json();
    data_debate = Array.isArray(json) ? json[0] : json;
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

  const motion = data_debate?.motion?.motion || "Unknown Motion";
  const roundName = data_debate?.round?.name || "Unknown Round";
  const phaseName = data_debate?.round?.phase?.name || "Unknown Phase";

  return (
    <div className="mx-auto max-w-[1252px] min-h-[746px] bg-[#070707] p-6 text-white overflow-hidden">
      <header className="flex justify-between items-center py-4">
        <h1 className="text-2xl font-semibold opacity-75 max-w-[686px]">
          {" "}
          {motion}{" "}
        </h1>
        <div className="size-[26px] opacity-50 italic">ret</div>
      </header>

      <div className="py-2 mb-6">
        <div className="text-[22px] font-semibold text-white/50 opacity-75">
          {" "}
          {phaseName} | {roundName}{" "}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-[20px]">
        <div className="flex flex-col items-center gap-[20px]">
          <GenericComponent title="Marshal">
            <div>
              {" "}
              Information about assigned Marshal will be presented here.{" "}
            </div>
          </GenericComponent>

          <GenericComponent title="Judges">
            <div>
              {" "}
              Information about assigned Judges will be presented here.{" "}
            </div>
          </GenericComponent>

          <GenericComponent title="Teams">
            <div>
              {" "}
              Information about time and place of the debate will be presented
              here.{" "}
            </div>
          </GenericComponent>
        </div>

        <div className="flex flex-col items-center gap-[20px]">
          {canConductDebate && <MarshalPanel motion={motion} />}
          <GenericComponent title="Verdict panel">
            <div> Waiting for the component to be ready. </div>
          </GenericComponent>
        </div>
      </div>
    </div>
  );
}
