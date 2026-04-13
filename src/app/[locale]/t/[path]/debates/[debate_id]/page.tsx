import { fetchServerside } from "@/lib/utils";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { MarshalPanel } from "@/components/tournament/MarshalPanel";
import { User } from "@/types/User";

type DebateDetailsPageProps = {
  params: Promise<{
    locale: string;
    path: string;
    debate_id: string;
  }>;
};

type DebateDetails = {
  id: string;
  motion?: string | null;
};

export default async function DebateDetailsPage({
  params,
}: DebateDetailsPageProps) {
  const { path, debate_id } = await params;
  const t = await getTranslations("debate_details");

  const cookieHeader = (await cookies()).toString();

  let debate: DebateDetails | null = null;
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

    const [debateRes, rolesRes] = await Promise.all([
      fetchServerside(`/tournaments/${path}/debates/${debate_id}`, {
        cache: "no-store",
        headers: {
          Cookie: cookieHeader,
        },
      }),
      fetchServerside(`/users/${currentUser.id}/tournaments/${path}/roles`, {
        cache: "no-store",
        headers: {
          Cookie: cookieHeader,
        },
      }),
    ]);

    if (debateRes.ok) {
      debate = await debateRes.json();
    } else {
      loadError = true;
    }

    if (rolesRes.ok) {
      roles = await rolesRes.json();
    }
  }

  if (loadError || !debate) {
    return (
      <div className="flex w-full flex-col items-center">
        <div className="mt-8 flex w-full max-w-5xl flex-col px-8 sm:mt-16 lg:px-16">
          <h1 className="text-center text-3xl font-semibold text-white sm:text-left">
            {t("title")}
          </h1>
          <p className="mt-4 text-sm text-red-400">{t("load_error")}</p>
        </div>
      </div>
    );
  }

  const motion = debate.motion?.trim() || t("fallback_motion");
  const canConductDebate =
    roles.includes("Marshal") || roles.includes("Organizer");

  const conductDebateHref = `https://tools.debateco.re/oxford-debate/setup?motion=${encodeURIComponent(
    motion
  )}`;

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mt-8 flex w-full max-w-5xl flex-col px-8 sm:mt-16 lg:px-16">
        <h1 className="text-center text-3xl font-semibold text-white sm:text-left">
          {t("title")}
        </h1>

        <div className="mt-8 w-full border-t border-b border-stone-700/70 px-8 py-12 sm:mt-16 sm:py-16 lg:px-16">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold text-white">{motion}</h2>
            <p className="text-sm text-stone-400">
              {t("debate_id")}: {debate.id}
            </p>
          </div>
        </div>

        {canConductDebate && (
          <MarshalPanel
            title={t("marshal_panel_title")}
            buttonLabel={t("conduct_button")}
            href={conductDebateHref}
          />
        )}
      </div>
    </div>
  );
}