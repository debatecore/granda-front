import { fetchServerside } from "@/lib/utils";
import { cookies } from "next/headers";
import { MarshalPanel } from "@/components/tournament/MarshalPanel";
import { GenericComponent } from "@/components/ui/GenericComponent";
import { getTranslations } from "next-intl/server";
import { User, UUID_MAX } from "@/types/User";
import { Debate } from "@/types/Debate";
import { Motion } from "@/types/Motion";

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
  let currentUser: User | null = null;

  const t = await getTranslations("debate_details");
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
    currentUser = await authRes.json();

    const rolesRes = await fetchServerside(
      `/users/${currentUser?.id}/tournaments/${path}/roles`,
      {
        cache: "no-store",
        headers: {
          Cookie: cookieHeader,
        },
      },
    );

    if (rolesRes.ok) {
      roles = await rolesRes.json();
    }
  }

  const getDebateById = async (tournament_id: string, debate_id: string) => {
    const debateRes = await fetchServerside(
      `/tournaments/${tournament_id}/debates/${debate_id}`,
      {
        cache: "no-store",
        headers: {
          Cookie: cookieHeader,
        },
      },
    );
    if (debateRes.ok) {
      return (await debateRes.json()) as Debate;
    }
  };

  const getMotionById = async (tournament_id: string, motion_id: string) => {
    const motionRes = await fetchServerside(
      `/tournaments/${tournament_id}/motions/${motion_id}`,
      {
        cache: "no-store",
        headers: {
          Cookie: cookieHeader,
        },
      },
    );
    console.log("motionRes", motionRes);
    if (motionRes.ok) {
      return (await motionRes.json()) as Motion;
    }
  };

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
    roles.includes("Marshal") ||
    roles.includes("Organizer") ||
    currentUser?.id === UUID_MAX;

  const debate = await getDebateById(path, debate_id);
  console.log("debate", debate);
  let motion = t("no_motion");
  if (debate?.motion_id) {
    const retrievedMoton = await getMotionById(path, debate.motion_id);
    console.log("retrievedMoton", retrievedMoton);
    if (retrievedMoton) {
      motion = retrievedMoton.motion;
    }
  }

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
          {/*{phaseName} | {roundName}{" "}*/}
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
