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

  const motion = "This House would do Something";
  const phaseName = "Phase 1";
  const roundName = "Round 1"; 

  return (
    <div className="mx-auto max-w-[1252px] min-h-[746px] bg-[#070707] p-6 text-white overflow-hidden">
      <header className="flex justify-between items-center py-4">
        <h1 className="text-2xl font-semibold opacity-75 max-w-[686px]"> {motion} </h1>
        <div className="size-[26px] opacity-50 italic">ret</div>
      </header>

      <div className="py-2 mb-6">
        <div className="text-[22px] font-semibold text-white/50 opacity-75"> {phaseName} | {roundName} </div>
      </div>

      <div className="grid grid-cols-2 gap-[20px]">
        
        <div className="flex flex-col items-center gap-[20px]">
          <div className="w-full aspect-[594/347] bg-[#141414] rounded-sm border-[0.5px] border-[#8a8a8a]/80 opacity-75" />
          <div className="w-full aspect-[594/264] bg-[#141414] rounded-sm border-[0.5px] border-[#8a8a8a]/80 flex flex-col justify-end items-center" />
          <div className="w-full aspect-[594/264] bg-[#141414] rounded-sm border-[0.5px] border-[#8a8a8a]/80 flex flex-col justify-end items-center" />
        </div>

        <div className="flex flex-col items-center gap-[20px]">
          <div className="w-full aspect-[594/347] bg-[#141414] rounded-sm border-[0.5px] border-white/80 flex flex-col justify-end items-center" />
          <div className="w-full aspect-[594/264] bg-[#141414] rounded-sm border-[0.5px] border-[#8a8a8a]/80 flex flex-col justify-end items-center" />
        </div>

      </div>

    </div>
  );
}
