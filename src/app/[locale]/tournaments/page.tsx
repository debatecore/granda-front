import { TournamentsList } from "@/components/tournament/TournamentList";
import { Option, None, Some } from "@/lib/option";
import { fetchServerside } from "@/lib/utils";
import { User } from "@/types/User";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { Link } from "@/i18n/navigation";
import { redirect } from "next/navigation";

export default async function TournamentListPage() {
  const t = await getTranslations("tournaments_list");

  let data_authme: Option<User> = new None();
  const res_authme = await fetchServerside("/auth/me", {
    headers: {
      Cookie: (await cookies()).toString(),
    },
  });

  if (res_authme.ok) {
    data_authme = new Some(await res_authme.json());
  }

  if (data_authme instanceof Some) {
    return (
      <div className="flex flex-col w-full h-screen items-center">
        <h1 className="mt-8 sm:mt-16 text-2xl sm:text-4xl text-balance text-center font-semibold">
          {t("welcome", { handle: data_authme.value.handle })}
        </h1>

        <p className="text-stone-500 text-xs text-balance text-center sm:text-base">
          {t("heading")}
        </p>

        <div className="mt-6 mb-4">
          <Link
            href="/tournaments/create"
            className="inline-flex items-center rounded-md bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition"
          >
            Create tournament
          </Link>
        </div>

        <TournamentsList />

        <p className="text-stone-500 pt-2 mb-16 text-balance text-center">
          {t.rich("login_redirect_footer", {
            login: (chunks) => (
              <Link href="/login" className="underline">
                {chunks}
              </Link>
            ),
          })}
        </p>
      </div>
    );
  }

  redirect("/login");
}