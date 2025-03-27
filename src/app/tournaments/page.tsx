import { TournamentsList } from "@/components/tournament/TournamentList";
import { Option, None, Some } from "@/lib/option";
import { fetchServerside } from "@/lib/utils";
import { User } from "@/types/User";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function TournamentListPage() {
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
      <>
        <div className="flex flex-col w-full h-screen items-center">
          <h1 className="mt-16 text-4xl font-semibold">{`Welcome, ${data_authme.value.handle}!`}</h1>
          <p className="text-stone-500">
            {"Here's a selection of tournaments you can access."}
          </p>
          <TournamentsList />
          <p className="text-stone-500 pt-2 mb-16">
            {"Alternatively, back to the "}
            <Link href={"/login"} className="underline">
              {"login page."}
            </Link>
          </p>
        </div>
      </>
    );
  } else {
    redirect("/login");
  }
}
