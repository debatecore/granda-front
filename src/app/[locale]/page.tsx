import { fetchServerside } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";

export default async function HomePage() {
  // here, we redirect all index page hits to:
  // * /tournaments, if they're correctly authenticated
  // * /login, if there's something wrong with their auth
  //   or if they're just plain logged out
  //
  // TODO: would it be wiser to redirect them to last visited site? 🤔

  const locale = await getLocale();
  const res_authme = await fetchServerside("/auth/me", {
    headers: {
      Cookie: (await cookies()).toString(),
    },
  });
  if (res_authme.ok) {
    redirect({ href: "/tournaments", locale });
  } else {
    redirect({ href: "/login", locale });
  }
  return (
    <div className="relative w-full h-screen flex justify-center items-center">
      <p>Please wait to be redirected.</p>
    </div>
  );
}
