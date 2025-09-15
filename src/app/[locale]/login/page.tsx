import { GrainEffect } from "@/components/grain";
import MOW2024 from "@/../public/MOW2024-olekfinal.jpg";
import { LocalLogIn } from "@/components/LogInLocally";
import { fetchServerside } from "@/lib/utils";
import { cookies } from "next/headers";
import { None, Option, Some } from "@/lib/option";
import { User } from "@/types/User";
import { LocalLoggedIn } from "@/components/LoggedInLocally";
import { GrandaLogo } from "@/components/debatecore/GrandaLogo";
import { DebatecoreFooter } from "@/components/debatecore/DebatecoreFooter";

export default async function LogInPage() {
  let data_authme: Option<User> = new None();
  const res_authme = await fetchServerside("/auth/me", {
    headers: {
      Cookie: (await cookies()).toString(),
    },
  });
  if (res_authme.ok) {
    data_authme = new Some(await res_authme.json());
  }

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center">
      <div
        className={`relative max-w-5xl w-full h-4/6 overflow-hidden grid grid-cols-2 border border-stone-700 rounded bg-cover`}
        style={{
          backgroundImage: `url(${MOW2024.src})`,
        }}
      >
        <div className="p-4 flex flex-col items-center backdrop-blur-lg bg-stone-950/75 border-stone-700">
          <GrainEffect />
          <GrandaLogo className="text-7xl mt-10" />
          {/*  */}
          {data_authme instanceof Some ? (
            <>
              <LocalLoggedIn user={data_authme.value} />
            </>
          ) : (
            <LocalLogIn />
          )}
          {/*  */}
          {<DebatecoreFooter />}
        </div>
        <div className="backdrop-blur-xs bg-stone-950/50 p-4"></div>
      </div>
    </div>
  );
}
